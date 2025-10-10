'use client'
import { downloadActionHistoryCSV, getActionHistories } from '@/servers/action-history'
import { getAllActions } from '@/servers/actions'
import { getAllActuators } from '@/servers/actuators'
import { IPaginatedResponse } from '@/types'
import { IAction } from '@/types/action'
import { IActionHistory } from '@/types/action-history'
import { IActuator } from '@/types/actuator'
import { DownloadOutlined, SearchOutlined } from '@ant-design/icons'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, DatePicker, Input, Select, Table, Tag, Tooltip } from 'antd'
import { ColumnsType } from 'antd/es/table'
import dayjs from 'dayjs'
import { useCallback, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { MdOutlineContentCopy } from 'react-icons/md'
import { z } from 'zod'

type FilterFormData = {
    queryName?: string;
    actuatorIds?: string[];
    actionIds?: string[];
    status?: string;
    startDate?: number;
    endDate?: number;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
    page?: number;
    size?: number;
};

const filterSchema = z.object({
    queryName: z.string().optional(),
    actuatorIds: z.array(z.number()).optional(),
    actionIds: z.array(z.number()).optional(),
    status: z.string().optional(),
    startDate: z.number().optional(),
    endDate: z.number().optional(),
    sortBy: z.string().optional(),
    sortOrder: z.enum(['ASC', 'DESC']).optional(),
    page: z.number().min(1).default(1),
    size: z.number().min(1).max(100).default(10),
});

const ActionHistoryPage = () => {
    const [data, setData] = useState<IPaginatedResponse<IActionHistory>>({
        data: [],
        pagination: {
            total: 0,
            page: 1,
            size: 10,
            totalPages: 0
        }
    });
    const [loading, setLoading] = useState(false);
    const [actions, setActions] = useState<IAction[]>([]);
    const [actuators, setActuators] = useState<IActuator[]>([]);

    const { control, handleSubmit, reset, formState: { errors }, setValue, getValues } = useForm<FilterFormData>({
        resolver: zodResolver(filterSchema),
    });

    const fetchActions = useCallback(async () => {
        try {
            const actions = await getAllActions();
            setActions(actions);
        } catch (error) {
            console.error('Error fetching actions:', error);
        }
    }, []);

    const fetchActuators = useCallback(async () => {
        try {
            const actuators = await getAllActuators();
            setActuators(actuators);
        } catch (error) {
            console.error('Error fetching actuators:', error);
        }
    }, []);

    const fetchData = async (filter: FilterFormData) => {
        setLoading(true);
        try {
            const cleanedFilter = { ...filter };
            Object.keys(cleanedFilter).forEach(key => {
                if (cleanedFilter[key as keyof FilterFormData] === undefined || cleanedFilter[key as keyof FilterFormData] === null) {
                    delete cleanedFilter[key as keyof FilterFormData];
                }
            });

            const data = await getActionHistories(cleanedFilter);
            setData(data);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData({});
        fetchActions();
        fetchActuators();
    }, []);

    const handleReset = () => {
        reset();
        fetchData({});
    };

    const handlePageChange = (page: number, size?: number) => {
        setValue('page', page);
        setValue('size', size);
        const value = getValues();
        fetchData(value);
    };

    const handleChangeSort = async ({ field, order }: any) => {
        const preValues = getValues();

        if (preValues.sortBy === field && preValues.sortOrder === (order === 'ascend' ? 'ASC' : order === 'descend' ? 'DESC' : undefined)) {
            return;
        }

        setValue('sortBy', field);
        setValue('sortOrder', order === 'ascend' ? 'ASC' : order === 'descend' ? 'DESC' : undefined);
        setValue('page', 1);
        const value = getValues();
        fetchData(value);
    }

    const handleDownload = async () => {
        const value = getValues();
        const blob = await downloadActionHistoryCSV(value);
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'action_history.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    };

    const onSubmit = (data: FilterFormData) => {
        data.page = 1;
        fetchData(data);
    }

    const columns: ColumnsType<IActionHistory> = [
        {
            title: 'Id',
            dataIndex: 'id',
            key: 'id',
            render: (id: number) => id || 'N/A',
            sorter: true,
        },
        {
            title: 'Action',
            dataIndex: 'action_id',
            key: 'actionName',
            render: (_, record) => record?.action?.name || 'Unknown Action',
            sorter: true,
        },
        {
            title: 'Actuator',
            dataIndex: 'actuator_id',
            key: 'actuatorName',
            render: (_, record) => record?.actuator?.name || 'Unknown Actuator',
            sorter: true,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => {
                let color = 'default';
                if (status === 'success') {
                    color = 'success';
                } else if (status === 'failed') {
                    color = 'error';
                } else if (status === 'pending') {
                    color = 'processing';
                }
                return <Tag color={color}>{status?.charAt(0).toUpperCase() + status?.slice(1) || 'N/A'}</Tag>;
            },
            sorter: true,
        },
        {
            title: 'Timestamp',
            dataIndex: 'timestamp',
            key: 'timestamp',
            render: (timestamp: string) =>
                timestamp ? dayjs(timestamp).format('DD/MM/YYYY HH:mm:ss') : 'N/A',
            sorter: true,
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Tooltip title="Copy">
                    <Button
                        type="link"
                        onClick={() => handleCopy(record)}
                    >
                        <MdOutlineContentCopy />
                    </Button>
                </Tooltip>
            ),
        }
    ];

    const handleCopy = (record: IActionHistory) => {
        const textToCopy = `Action: ${record.action?.name || 'Unknown Action'}\nActuator: ${record.actuator?.name || 'Unknown Actuator'}\nStatus: ${record.status || 'N/A'}\nTimestamp: ${record.timestamp ? dayjs(record.timestamp).format('DD/MM/YYYY HH:mm:ss') : 'N/A'}`;
        navigator.clipboard.writeText(textToCopy).then(() => {
            toast.success('Copied to clipboard');
        }).catch(err => {
            toast.error('Failed to copy');
        });
    }

    return (
        <div className="flex-1 flex flex-col">
            <main className="flex-1 p-6 overflow-auto bg-gray-50">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Filters</h3>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div>
                                <label htmlFor="queryName" className="block text-sm font-medium text-gray-700 mb-2">
                                    Search
                                </label>
                                <Controller
                                    name="queryName"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            id="queryName"
                                            placeholder="Search actions..."
                                            prefix={<SearchOutlined />}
                                        />
                                    )}
                                />
                                {errors.queryName && (
                                    <span className="text-red-500 text-sm">{errors.queryName.message}</span>
                                )}
                            </div>

                            <div>
                                <label htmlFor="actionIds" className="block text-sm font-medium text-gray-700 mb-2">
                                    Actions
                                </label>
                                <Controller
                                    name="actionIds"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            id="actionIds"
                                            mode="multiple"
                                            placeholder="Select actions"
                                            style={{ width: '100%' }}
                                            options={actions.map(action => ({
                                                value: action.id,
                                                label: action.name
                                            }))}
                                        />
                                    )}
                                />
                                {errors.actionIds && (
                                    <span className="text-red-500 text-sm">{errors.actionIds.message}</span>
                                )}
                            </div>

                            <div>
                                <label htmlFor="actuatorIds" className="block text-sm font-medium text-gray-700 mb-2">
                                    Actuators
                                </label>
                                <Controller
                                    name="actuatorIds"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            id="actuatorIds"
                                            mode="multiple"
                                            placeholder="Select actuators"
                                            style={{ width: '100%' }}
                                            options={actuators.map(actuator => ({
                                                value: actuator.id,
                                                label: actuator.name
                                            }))}
                                        />
                                    )}
                                />
                                {errors.actuatorIds && (
                                    <span className="text-red-500 text-sm">{errors.actuatorIds.message}</span>
                                )}
                            </div>

                            <div>
                                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                                    Status
                                </label>
                                <Controller
                                    name="status"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            id="status"
                                            placeholder="Select status"
                                            style={{ width: '100%' }}
                                            allowClear
                                            options={[
                                                { value: 'success', label: 'Success' },
                                                { value: 'failed', label: 'Failed' },
                                                { value: 'pending', label: 'Pending' }
                                            ]}
                                        />
                                    )}
                                />
                                {errors.status && (
                                    <span className="text-red-500 text-sm">{errors.status.message}</span>
                                )}
                            </div>

                            <div>
                                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
                                    Start Date
                                </label>
                                <Controller
                                    name="startDate"
                                    control={control}
                                    render={({ field }) => (
                                        <DatePicker
                                            {...field}
                                            id="startDate"
                                            showTime
                                            placeholder="Select start date"
                                            style={{ width: '100%' }}
                                            value={field.value ? dayjs(field.value) : null}
                                            onChange={(date) => field.onChange(date ? date.valueOf() : undefined)}
                                        />
                                    )}
                                />
                                {errors.startDate && (
                                    <span className="text-red-500 text-sm">{errors.startDate.message}</span>
                                )}
                            </div>

                            <div>
                                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
                                    End Date
                                </label>
                                <Controller
                                    name="endDate"
                                    control={control}
                                    render={({ field }) => (
                                        <DatePicker
                                            {...field}
                                            id="endDate"
                                            showTime
                                            placeholder="Select end date"
                                            style={{ width: '100%' }}
                                            value={field.value ? dayjs(field.value) : null}
                                            onChange={(date) => field.onChange(date ? date.valueOf() : undefined)}
                                        />
                                    )}
                                />
                                {errors.endDate && (
                                    <span className="text-red-500 text-sm">{errors.endDate.message}</span>
                                )}
                            </div>
                        </div>

                        <div className='flex items-center justify-between'>
                            <div className="flex gap-4 pt-4">
                                <Button type="primary" htmlType="submit" loading={loading}>
                                    Apply Filters
                                </Button>
                                <Button type="default" onClick={handleReset}>
                                    Reset
                                </Button>
                            </div>
                            <Button
                                type="primary"
                                icon={<DownloadOutlined />}
                                size="middle"
                                onClick={handleDownload}
                            >
                                Export Data
                            </Button>
                        </div>
                    </form>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="p-6 border-b border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900">Action History</h3>
                        <p className="text-sm text-gray-500 mt-1">
                            Total: {data.pagination.total} records
                        </p>
                    </div>

                    <div className='p-5'>
                        <Table
                            columns={columns}
                            dataSource={data.data}
                            rowKey={(record) => `${record.id}-${record.timestamp}`}
                            loading={loading}
                            pagination={{
                                current: data.pagination.page ?? 1,
                                pageSize: data.pagination.size ?? 10,
                                total: data.pagination.total ?? 0,
                                onChange: handlePageChange,
                            }}
                            onChange={(__, _, sorter) => {
                                handleChangeSort(sorter);
                            }}
                        />
                    </div>
                </div>
            </main>
        </div>
    );
}

export default ActionHistoryPage;