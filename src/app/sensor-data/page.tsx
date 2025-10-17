/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { UNITS, SENSOR_LIMITS } from '@/constants';
import { getSensorData } from '@/servers';
import { getAllSensors } from '@/servers/sensor';
import { downloadSensorDataCSV } from '@/servers/sensor-data';
import { IPaginatedResponse, ISensor, ISensorData } from '@/types';
import { DownloadOutlined, SearchOutlined } from '@ant-design/icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, DatePicker, Input, InputNumber, Select, Table, Tag, Tooltip } from 'antd';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useCallback, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { MdOutlineContentCopy } from "react-icons/md";
import toast from 'react-hot-toast';

type FilterFormData = {
    query?: string;
    sensorIds?: number[];
    unit?: string;
    value?: number;
    startValue?: number;
    endValue?: number;
    date?: number;
    startDate?: number;
    endDate?: number;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
    page?: number;
    size?: number;
};

const filterSchema = z.object({
    query: z.string().optional(),
    sensorIds: z.array(z.number()).optional(),
    unit: z.string().optional(),
    value: z.number().optional(),
    startValue: z.number().optional(),
    endValue: z.number().optional(),
    date: z.number().optional(),
    startDate: z.number().optional(),
    endDate: z.number().optional(),
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
    const [sensors, setSensors] = useState<ISensor[]>([]);

    const { control, handleSubmit, reset, formState: { errors }, setValue, getValues } = useForm<FilterFormData>({
        resolver: zodResolver(filterSchema),
    });

    const fetchSensors = useCallback(async () => {
        try {
            const sensors = await getAllSensors();

            setSensors(sensors);
        } catch (error) {
            console.error('Error fetching sensors:', error);
        }
    }, []);

    const fetchData = async (filter: FilterFormData) => {
        setLoading(true);
        try {
            const cleanedFilter = { ...filter };
            
            // Convert date to startDate and endDate with 1 second buffer
            if (cleanedFilter.date) {
                cleanedFilter.startDate = cleanedFilter.date - 1000; // Lùi 1 giây
                cleanedFilter.endDate = cleanedFilter.date + 1000; // Thêm 1 giây
                delete cleanedFilter.date; // Remove date field
            }
            
            // Convert value to startValue and endValue with same value
            if (cleanedFilter.value !== undefined && cleanedFilter.value !== null) {
                cleanedFilter.startValue = cleanedFilter.value;
                cleanedFilter.endValue = cleanedFilter.value;
                delete cleanedFilter.value; // Remove value field
            }
            
            Object.keys(cleanedFilter).forEach(key => {
                if (cleanedFilter[key as keyof FilterFormData] === undefined || cleanedFilter[key as keyof FilterFormData] === null) {
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
        fetchSensors();
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
        
        // Convert date to startDate and endDate with 1 second buffer for download
        if (value.date) {
            value.startDate = value.date - 1000; // Lùi 1 giây
            value.endDate = value.date + 1000; // Thêm 1 giây
            delete value.date; // Remove date field
        }
        
        // Convert value to startValue and endValue with same value for download
        if (value.value !== undefined && value.value !== null) {
            value.startValue = value.value;
            value.endValue = value.value;
            delete value.value; // Remove value field
        }
        
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
        const textToCopy = record.timestamp ? dayjs(record.timestamp).format('YYYY-MM-DD HH:mm:ss') : 'N/A';
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
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Search
                                </label>
                                <Controller
                                    name="query"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            placeholder="Search..."
                                            prefix={<SearchOutlined />}
                                        />
                                    )}
                                />
                                {errors.query && (
                                    <span className="text-red-500 text-sm">{errors.query.message}</span>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Sensors
                                </label>
                                <Controller
                                    name="sensorIds"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            mode="multiple"
                                            placeholder="Select sensors"
                                            style={{ width: '100%' }}
                                            options={sensors.map(sensor => ({
                                                value: sensor.id,
                                                label: sensor.name
                                            }))}
                                        />
                                    )}
                                />
                                {errors.sensorIds && (
                                    <span className="text-red-500 text-sm">{errors.sensorIds.message}</span>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Unit
                                </label>
                                <Controller
                                    name="unit"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            placeholder="Select unit"
                                            style={{ width: '100%' }}
                                            allowClear
                                            options={Object.values(UNITS).map(unit => ({
                                                value: unit,
                                                label: unit
                                            }))}
                                        />
                                    )}
                                />
                                {errors.unit && (
                                    <span className="text-red-500 text-sm">{errors.unit.message}</span>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Value
                                </label>
                                <Controller
                                    name="value"
                                    control={control}
                                    render={({ field }) => (
                                        <InputNumber
                                            {...field}
                                            placeholder="Enter value"
                                            style={{ width: '100%' }}
                                        />
                                    )}
                                />
                                {errors.value && (
                                    <span className="text-red-500 text-sm">{errors.value.message}</span>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Date
                                </label>
                                <Controller
                                    name="date"
                                    control={control}
                                    render={({ field }) => (
                                        <DatePicker
                                            {...field}
                                            showTime
                                            placeholder="Select date"
                                            style={{ width: '100%' }}
                                            value={field.value ? dayjs(field.value) : null}
                                            onChange={(date) => field.onChange(date ? date.valueOf() : undefined)}
                                        />
                                    )}
                                />
                                {errors.date && (
                                    <span className="text-red-500 text-sm">{errors.date.message}</span>
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