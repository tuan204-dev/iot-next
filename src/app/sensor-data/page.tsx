/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { SENSOR_LIMITS } from '@/constants';
import { getSensorData } from '@/servers';
import { downloadSensorDataCSV } from '@/servers/sensor-data';
import { IPaginatedResponse, ISensorData } from '@/types';
import { DownloadOutlined, SearchOutlined } from '@ant-design/icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input, Select, Table, Tag, Tooltip } from 'antd';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { MdOutlineContentCopy } from "react-icons/md";
import toast from 'react-hot-toast';

type FilterFormData = {
    searchField?: string;
    searchValue?: string;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
    page?: number;
    size?: number;
};

const filterSchema = z.object({
    searchField: z.string().optional(),
    searchValue: z.string().optional(),
    sortBy: z.string().optional(),
    sortOrder: z.enum(['ASC', 'DESC']).optional(),
    page: z.number().min(1).default(1),
    size: z.number().min(1).max(100).default(10),
});

export default function SensorDataPage() {
    const [data, setData] = useState<IPaginatedResponse<ISensorData>>({
        data: [],
        pagination: {
            total: 0,
            page: 1,
            size: 10,
            totalPages: 0
        }
    });
    const [loading, setLoading] = useState(false);
    const { control, handleSubmit, reset, formState: { errors }, setValue, getValues } = useForm<FilterFormData>({
        resolver: zodResolver(filterSchema),
        defaultValues: {
            searchField: 'all',
            searchValue: '',
        }
    });

    const fetchData = async (filter: FilterFormData) => {
        setLoading(true);
        try {
            const cleanedFilter = { ...filter };
            
            // Remove empty values
            Object.keys(cleanedFilter).forEach(key => {
                if (cleanedFilter[key as keyof FilterFormData] === undefined || 
                    cleanedFilter[key as keyof FilterFormData] === null || 
                    cleanedFilter[key as keyof FilterFormData] === '') {
                    delete cleanedFilter[key as keyof FilterFormData];
                }
            });

            const data = await getSensorData(cleanedFilter);
            setData(data);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData({});
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
        
        const blob = await downloadSensorDataCSV(value);
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'sensor_data.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    }

    const columns: ColumnsType<ISensorData> = [
        {
            title: 'Id',
            dataIndex: 'id',
            key: 'id',
            render: (id: number) => id || 'N/A',
            sorter: true,
        },
        {
            title: 'Sensor',
            dataIndex: 'sensor_id',
            key: 'sensorName',
            render: (_, record) => record?.sensor?.name || 'Unknown Sensor',
            sorter: true,
        },
        {
            title: 'Value',
            dataIndex: 'value',
            key: 'value',
            render: (value: number) => value?.toFixed(2) || 'N/A',
            sorter: true,
        },
        {
            title: 'Unit',
            dataIndex: 'unit',
            key: 'unit',
            render: (unit: string) => unit || '°C',
            sorter: true,
        },
        {
            title: 'Status',
            dataIndex: 'value',
            key: 'status',
            render: (value: number, record: ISensorData) => {
                let isWarning = false;

                switch (record.unit) {
                    case '°C':
                        isWarning = value < SENSOR_LIMITS.TEMPERATURE.MIN || value > SENSOR_LIMITS.TEMPERATURE.MAX;
                        break;
                    case '%':
                        isWarning = value < SENSOR_LIMITS.HUMIDITY.MIN || value > SENSOR_LIMITS.HUMIDITY.MAX;
                        break;
                    case 'lx':
                        isWarning = value < SENSOR_LIMITS.LIGHT.MIN || value > SENSOR_LIMITS.LIGHT.MAX;
                        break;
                    default:
                        isWarning = value > 30 || value < 10;
                }

                const statusText = isWarning ? 'Warning' : 'Normal';
                const color = isWarning ? 'warning' : 'success';
                return <Tag color={color}>{statusText}</Tag>;
            },
        },
        {
            title: 'Timestamp',
            dataIndex: 'timestamp',
            key: 'timestamp',
            render: (timestamp: number) =>
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

    const handleCopy = (record: ISensorData) => {
        const textToCopy = record.timestamp ? dayjs(record.timestamp).format('DD/MM/YYYY HH:mm:ss') : 'N/A';
        navigator.clipboard.writeText(textToCopy).then(() => {
            toast.success('Time copied to clipboard');
        }).catch(() => {
            toast.error('Failed to copy');
        });
    }

    const onSubmit = (data: FilterFormData) => {
        data.page = 1;
        fetchData(data);
    }

    return (
        <div className="flex-1 flex flex-col">
            <main className="flex-1 p-6 overflow-auto bg-gray-50">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Filters</h3>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="searchField" className="block text-sm font-medium text-gray-700 mb-2">
                                    Search Field
                                </label>
                                <Controller
                                    name="searchField"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            id="searchField"
                                            placeholder="Select field to search"
                                            style={{ width: '100%' }}
                                            allowClear
                                            options={[
                                                { value: 'all', label: 'All' },
                                                { value: 'id', label: 'ID' },
                                                { value: 'name', label: 'Name' },
                                                { value: 'temp', label: 'Temp (°C)' },
                                                { value: 'humidity', label: 'Humidity (%)' },
                                                { value: 'light', label: 'Light (lx)' },
                                                { value: 'time', label: 'Time' }
                                            ]}
                                            defaultValue={'all'}
                                        />
                                    )}
                                />
                                {errors.searchField && (
                                    <span className="text-red-500 text-sm">{errors.searchField.message}</span>
                                )}
                            </div>

                            <div>
                                <label htmlFor="searchValue" className="block text-sm font-medium text-gray-700 mb-2">
                                    Search Value
                                </label>
                                <Controller
                                    name="searchValue"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            id="searchValue"
                                            placeholder="Enter search value"
                                            prefix={<SearchOutlined />}
                                        />
                                    )}
                                />
                                {errors.searchValue && (
                                    <span className="text-red-500 text-sm">{errors.searchValue.message}</span>
                                )}
                            </div>
                        </div>

                        <div className='flex justify-between items-center'>
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
                        <h3 className="text-lg font-medium text-gray-900">Sensor Data</h3>
                        <p className="text-sm text-gray-500 mt-1">
                            Total: {data.pagination.total} records
                        </p>
                    </div>

                    <div className='p-5'>
                        <Table
                            columns={columns}
                            dataSource={data.data}
                            rowKey={(record) => `${record.sensor.id}-${record.timestamp}`}
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