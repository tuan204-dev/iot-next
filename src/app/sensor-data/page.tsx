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
            <main className="flex-1 p-8 overflow-auto bg-gradient-to-br from-purple-50 to-pink-50">
                {/* Filters Card */}
                <div className="bg-white rounded-2xl shadow-xl border border-purple-100 p-8 mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900">Search Filters</h3>
                            <p className="text-sm text-gray-500 mt-1">Filter and search through sensor records</p>
                        </div>
                        <div className="p-3 bg-gradient-to-br from-purple-400 to-pink-400 rounded-xl">
                            <SearchOutlined className="text-white text-2xl" />
                        </div>
                    </div>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div className="flex flex-wrap items-end gap-4">
                            <div className="flex-1 min-w-[200px]">
                                <label htmlFor="searchField" className="block text-sm font-semibold text-gray-700 mb-3">
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

                            <div className="flex-1 min-w-[200px]">
                                <label htmlFor="searchValue" className="block text-sm font-semibold text-gray-700 mb-3">
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

                            <Button 
                                type="primary" 
                                htmlType="submit" 
                                loading={loading}
                                size="large"
                                icon={<SearchOutlined />}
                            >
                                Apply Filters
                            </Button>
                            
                            <Button 
                                type="default" 
                                onClick={handleReset}
                                size="large"
                            >
                                Reset Filters
                            </Button>

                            <Button
                                type="primary"
                                icon={<DownloadOutlined />}
                                size="large"
                                onClick={handleDownload}
                                className="bg-gradient-to-r from-green-500 to-emerald-600 border-none hover:from-green-600 hover:to-emerald-700"
                            >
                                Export CSV
                            </Button>
                        </div>
                    </form>
                </div>

                {/* Data Table Card */}
                <div className="bg-white rounded-2xl shadow-xl border border-purple-100">
                    <div className="p-8 border-b border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900">Sensor Records</h3>
                                <p className="text-sm text-gray-500 mt-2">
                                    Showing historical sensor data records
                                </p>
                            </div>
                            <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl px-6 py-3">
                                <p className="text-sm font-medium text-purple-600">Total Records</p>
                                <p className="text-3xl font-bold text-purple-900">{data.pagination.total}</p>
                            </div>
                        </div>
                    </div>

                    <div className='p-6'>
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
                                showSizeChanger: true,
                                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                            }}
                            onChange={(__, _, sorter) => {
                                handleChangeSort(sorter);
                            }}
                            className="sensor-data-table"
                            size="middle"
                            bordered
                            scroll={{ x: 'max-content' }}
                        />
                    </div>
                </div>
            </main>
        </div>
    );
}