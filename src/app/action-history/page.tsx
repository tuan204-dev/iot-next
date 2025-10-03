'use client'
import React, { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button, DatePicker, Input, Select, Table, Tag } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { DownloadOutlined, SearchOutlined } from '@ant-design/icons'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import dayjs from 'dayjs'
import { IPaginatedResponse } from '@/types'
import { IActionHistory } from '@/types/action-history'
import { getActionHistories } from '@/servers/action-history'
import { getAllActions } from '@/servers/actions'
import { getAllActuators } from '@/servers/actuators'
import { IAction } from '@/types/action'
import { IActuator } from '@/types/actuator'

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
    actuatorIds: z.array(z.string()).optional(),
    actionIds: z.array(z.string()).optional(),
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

    const { control, handleSubmit, reset, formState: { errors }, setValue, getValues, watch } = useForm<FilterFormData>({
        resolver: zodResolver(filterSchema),
    });

    console.log('watch', watch())

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
    }, [fetchActions, fetchActuators]);

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

    const handleChangeSort = async (sorter: { field?: string; order?: string }) => {
        const preValues = getValues();
        
        let sortOrder: 'ASC' | 'DESC' | undefined;
        if (sorter.order === 'ascend') {
            sortOrder = 'ASC';
        } else if (sorter.order === 'descend') {
            sortOrder = 'DESC';
        } else {
            sortOrder = undefined;
        }

        if (preValues.sortBy === sorter.field && preValues.sortOrder === sortOrder) {
            return;
        }

        setValue('sortBy', sorter.field || '');
        setValue('sortOrder', sortOrder);
        setValue('page', 1);
        const value = getValues();
        fetchData(value);
    }

    const handleDownload = async () => {
        // Implement download functionality
        console.log('Downloading action history data...');
    };

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
    ];

    return (
        <div className="min-h-screen bg-gray-100 flex">
            <div className="w-64 bg-white shadow-sm border-r border-gray-200 flex flex-col">
                <div className="h-16 flex items-center px-4 border-b border-gray-200">
                    <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                            <span className="text-white font-bold text-sm">IOT</span>
                        </div>
                        <h1 className="text-lg font-semibold text-gray-800">IOT Dashboard</h1>
                    </div>
                </div>
                <div className="flex flex-col flex-grow px-4 py-4 overflow-y-auto">
                    <nav className="flex-1 space-y-2">
                        <Link
                            href="/"
                            className="flex items-center px-4 py-3 text-sm font-medium rounded-lg sidebar-item"
                        >
                            <span className="fas fa-tachometer-alt mr-3"></span>
                            {' '}Dashboard
                        </Link>
                        <Link
                            href="/sensor-data"
                            className="flex items-center px-4 py-3 text-sm font-medium rounded-lg sidebar-item"
                        >
                            <span className="fas fa-chart-line mr-3"></span>
                            {' '}Data Sensor
                        </Link>
                        <Link
                            href="/action-history"
                            className="flex items-center px-4 py-3 text-sm font-medium rounded-lg sidebar-item active"
                        >
                            <span className="fas fa-history mr-3"></span>
                            {' '}Action History
                        </Link>
                        <Link
                            href="/profile"
                            className="flex items-center px-4 py-3 text-sm font-medium rounded-lg sidebar-item"
                        >
                            <span className="fas fa-user mr-3"></span>
                            {' '}Profile
                        </Link>
                    </nav>
                </div>
                <div className="p-4 border-t border-gray-200">
                    <div className="flex items-center">
                        <Image
                            className="w-10 h-10 rounded-full"
                            src="https://randomuser.me/api/portraits/women/44.jpg"
                            alt="User avatar"
                            width={40}
                            height={40}
                        />
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-700">Sarah Johnson</p>
                            <p className="text-xs text-gray-500">Administrator</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-1 flex flex-col">
                <header className="h-16 bg-white shadow-sm border-b border-gray-200 flex items-center justify-between px-6">
                    <h2 className="text-xl font-semibold text-gray-800">Action History</h2>
                    <Button 
                        type="primary" 
                        icon={<DownloadOutlined />} 
                        size="middle"
                        onClick={handleDownload}
                    >
                        Export Data
                    </Button>
                </header>

                <main className="flex-1 p-6 overflow-auto">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Filters</h3>
                        <form onSubmit={handleSubmit(fetchData)} className="space-y-4">
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

                            <div className="flex gap-4 pt-4">
                                <Button type="primary" htmlType="submit" loading={loading}>
                                    Apply Filters
                                </Button>
                                <Button type="default" onClick={handleReset}>
                                    Reset
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
                                    if (sorter && !Array.isArray(sorter)) {
                                        handleChangeSort({
                                            field: sorter.field as string,
                                            order: sorter.order || undefined
                                        });
                                    }
                                }}
                            />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default ActionHistoryPage;