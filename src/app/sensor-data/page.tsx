'use client'
import Link from 'next/link';
import { InputNumber, Select, Button, Table, Tag, DatePicker } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import dayjs from 'dayjs';
import { useEffect, useState, useCallback } from 'react';
import { IPaginatedResponse, ISensorData, ISensor } from '@/types';
import { getSensorData } from '@/servers';
import { getAllSensors } from '@/servers/sensor';
import { UNITS } from '@/constants';
import { ColumnsType } from 'antd/es/table';

type FilterFormData = {
    sensorIds?: number[];
    unit?: string;
    startValue?: number;
    endValue?: number;
    startDate?: number;
    endDate?: number;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
};

const filterSchema = z.object({
    sensorIds: z.array(z.number()).optional(),
    unit: z.string().optional(),
    startValue: z.number().optional(),
    endValue: z.number().optional(),
    startDate: z.number().optional(),
    endDate: z.number().optional(),
    sortBy: z.string().optional(),
    sortOrder: z.enum(['ASC', 'DESC']).optional(),
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
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [currentFilters, setCurrentFilters] = useState<FilterFormData>({});

    console.log('currentPage', currentPage)

    const { control, handleSubmit, reset, formState: { errors }, watch, setValue } = useForm<FilterFormData>({
        resolver: zodResolver(filterSchema),
    });

    console.log('watch', watch());

    const fetchData = useCallback(async (filters: FilterFormData = {}, page = 1, size = 10) => {
        setLoading(true);
        try {
            const params = {
                ...filters,
                sensorIds: filters.sensorIds?.map(id => id.toString()),
                page,
                size,
            };
            const res = await getSensorData(params);
            setData(res);
        } catch (error) {
            console.error('Error fetching sensor data:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchSensors = useCallback(async () => {
        try {
            const sensors = await getAllSensors();

            setSensors(sensors);
        } catch (error) {
            console.error('Error fetching sensors:', error);
        }
    }, []);

    useEffect(() => {
        fetchData();
        fetchSensors();
    }, [fetchData, fetchSensors]);

    const onSubmit = async (formData: FilterFormData) => {
        setCurrentFilters(formData);
        setCurrentPage(1);
        setLoading(true);
        console.log('formData', formData)
        try {
            const params = {
                ...formData,
                sensorIds: formData.sensorIds?.map(id => id.toString()),
                page: 1,
                size: pageSize
            };
            const res = await getSensorData(params);
            setData(res);
        } catch (error) {
            console.error('Error filtering sensor data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        reset();
        setCurrentFilters({});
        setCurrentPage(1);
        fetchData({}, 1, pageSize);
    };

    const handlePageChange = (page: number, size?: number) => {
        setCurrentPage(page);
        if (size && size !== pageSize) {
            setPageSize(size);
        }
        fetchData(currentFilters, page, size || pageSize);
    };

    const handleChangeSort = async ({ field, order }: any) => {
        console.log('field', field)
        setValue('sortBy', field);
        setValue('sortOrder', order === 'ascend' ? 'ASC' : order === 'descend' ? 'DESC' : undefined);
        await onSubmit(watch());
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
            render: (value: number) => {
                const isWarning = value > 30 || value < 10;
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
                            <i className="fas fa-tachometer-alt mr-3" />
                            Dashboard
                        </Link>
                        <Link
                            href="/sensor-data"
                            className="flex items-center px-4 py-3 text-sm font-medium rounded-lg sidebar-item active"
                        >
                            <i className="fas fa-chart-line mr-3" />
                            Data Sensor
                        </Link>
                        <Link
                            href="/action-history"
                            className="flex items-center px-4 py-3 text-sm font-medium rounded-lg sidebar-item"
                        >
                            <i className="fas fa-history mr-3" />
                            Action History
                        </Link>
                        <Link
                            href="/profile"
                            className="flex items-center px-4 py-3 text-sm font-medium rounded-lg sidebar-item"
                        >
                            <i className="fas fa-user mr-3" />
                            Profile
                        </Link>
                    </nav>
                </div>
                <div className="p-4 border-t border-gray-200">
                    <div className="flex items-center">
                        <img
                            className="w-10 h-10 rounded-full"
                            src="https://randomuser.me/api/portraits/women/44.jpg"
                            alt="User avatar"
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
                    <h2 className="text-xl font-semibold text-gray-800">Sensor Data</h2>
                    <Button 
                        type="primary" 
                        icon={<DownloadOutlined />} 
                        size="middle"
                    >
                        Export Data
                    </Button>
                </header>

                <main className="flex-1 p-6 overflow-auto">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Filters</h3>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                                        Start Value
                                    </label>
                                    <Controller
                                        name="startValue"
                                        control={control}
                                        render={({ field }) => (
                                            <InputNumber
                                                {...field}
                                                placeholder="Enter minimum value"
                                                style={{ width: '100%' }}
                                            />
                                        )}
                                    />
                                    {errors.startValue && (
                                        <span className="text-red-500 text-sm">{errors.startValue.message}</span>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        End Value
                                    </label>
                                    <Controller
                                        name="endValue"
                                        control={control}
                                        render={({ field }) => (
                                            <InputNumber
                                                {...field}
                                                placeholder="Enter maximum value"
                                                style={{ width: '100%' }}
                                            />
                                        )}
                                    />
                                    {errors.endValue && (
                                        <span className="text-red-500 text-sm">{errors.endValue.message}</span>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Start Date
                                    </label>
                                    <Controller
                                        name="startDate"
                                        control={control}
                                        render={({ field }) => (
                                            <DatePicker
                                                {...field}
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
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        End Date
                                    </label>
                                    <Controller
                                        name="endDate"
                                        control={control}
                                        render={({ field }) => (
                                            <DatePicker
                                                {...field}
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
                                    current: currentPage,
                                    pageSize: pageSize,
                                    total: data.pagination.total,
                                    showSizeChanger: true,
                                    showQuickJumper: true,
                                    onChange: handlePageChange,
                                    onShowSizeChange: handlePageChange,
                                }}
                                onChange={(__, _, sorter) => {
                                    handleChangeSort(sorter);
                                }}
                            />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}