'use client'

import { IRecentSensorData } from '@/types'
import { Select } from 'antd'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { memo, useState, useEffect, FC } from 'react'
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

dayjs.extend(relativeTime);

// Custom tooltip component
interface TooltipProps {
    active?: boolean;
    payload?: Array<{
        payload: {
            time: string;
            temperature: number;
            humidity: number;
            light: number;
        };
    }>;
    label?: string;
    selectedMetric?: 'temperature' | 'humidity' | 'light';
}

const CustomTooltip = ({ active, payload, label, selectedMetric }: TooltipProps) => {
    if (active && payload?.length) {
        const data = payload[0].payload;
        
        const getMetricInfo = () => {
            switch (selectedMetric) {
                case 'temperature':
                    return {
                        value: data.temperature,
                        unit: '°C',
                        color: 'text-purple-600',
                        bgColor: 'bg-purple-600',
                        label: 'Temperature'
                    };
                case 'humidity':
                    return {
                        value: data.humidity,
                        unit: '%',
                        color: 'text-cyan-600',
                        bgColor: 'bg-cyan-600',
                        label: 'Humidity'
                    };
                case 'light':
                    return {
                        value: data.light,
                        unit: ' Lux',
                        color: 'text-amber-600',
                        bgColor: 'bg-amber-600',
                        label: 'Light'
                    };
                default:
                    return {
                        value: 0,
                        unit: '',
                        color: 'text-gray-600',
                        bgColor: 'bg-gray-600',
                        label: 'Unknown'
                    };
            }
        };

        const metricInfo = getMetricInfo();
        
        return (
            <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
                <p className="text-gray-700 font-medium mb-2">{`Time: ${label}`}</p>
                <p className={metricInfo.color}>
                    <span className={`inline-block w-3 h-3 ${metricInfo.bgColor} rounded-full mr-2`}></span>
                    {metricInfo.label}: {metricInfo.value}{metricInfo.unit}
                </p>
            </div>
        );
    }
    return null;
};

export interface SensorDataTrendItem {
    time: number;
    temperature: number;
    humidity: number;
    light: number;
}

interface SensorDataTrendProps {
    recentSensorData: IRecentSensorData
}

const SensorDataTrend:FC<SensorDataTrendProps> = ({ recentSensorData }) => {
    const [selectedMetric, setSelectedMetric] = useState<'temperature' | 'humidity' | 'light'>('light');
    const [data, setData] = useState<Array<{time: string; temperature: number; humidity: number; light: number}>>([]);

    useEffect(() => {
        // Tạo một map để dễ dàng tra cứu dữ liệu theo timestamp
        const temperatureMap = new Map(recentSensorData.temperature.map(item => [item.timestamp, item.value]));
        const humidityMap = new Map(recentSensorData.humidity.map(item => [item.timestamp, item.value]));
        const lightMap = new Map(recentSensorData.light.map(item => [item.timestamp, item.value]));

        // Lấy tất cả timestamps và sắp xếp theo thời gian
        const allTimestamps = Array.from(new Set([
            ...recentSensorData.temperature.map(item => item.timestamp),
            ...recentSensorData.humidity.map(item => item.timestamp),
            ...recentSensorData.light.map(item => item.timestamp)
        ])).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

        // Tạo dữ liệu cho chart
        const chartData = allTimestamps.map(timestamp => ({
            time: dayjs(timestamp).format('HH:mm'),
            temperature: temperatureMap.get(timestamp) || 0,
            humidity: humidityMap.get(timestamp) || 0,
            light: lightMap.get(timestamp) || 0
        }));

        // Chỉ giữ 20 điểm dữ liệu mới nhất
        setData(chartData.slice(-20));
    }, [recentSensorData]);

    const getMetricConfig = () => {
        switch (selectedMetric) {
            case 'temperature':
                return {
                    stroke: '#8b5cf6',
                    name: 'Temperature (°C)',
                    dataKey: 'temperature',
                    gradientId: 'colorTemp'
                };
            case 'humidity':
                return {
                    stroke: '#06b6d4',
                    name: 'Humidity (%)',
                    dataKey: 'humidity',
                    gradientId: 'colorHumidity'
                };
            case 'light':
                return {
                    stroke: '#f59e0b',
                    name: 'Light (Lux)',
                    dataKey: 'light',
                    gradientId: 'colorLight'
                };
        }
    };

    const metricConfig = getMetricConfig();
    return (
        <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                        Sensor Analytics
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                        Real-time data visualization
                    </p>
                </div>
                <div className="flex space-x-2">
                    <Select
                        value={selectedMetric}
                        onChange={(value) => setSelectedMetric(value)}
                        options={[{
                            value: 'light', label: 'Light',
                        }, {
                            value: 'temperature', label: 'Temperature',
                        }, {
                            value: 'humidity', label: 'Humidity',
                        }]}
                        size='large'
                        className="w-48"
                    />
                </div>
            </div>
            <div className="flex-1">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={data}
                        margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                    >
                        <defs>
                            <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorHumidity" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorLight" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis
                            dataKey="time"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: '#9CA3AF', fontWeight: 500 }}
                            tickMargin={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: '#9CA3AF', fontWeight: 500 }}
                            tickMargin={10}
                            domain={[0, 'dataMax + 50']}
                        />
                        <Tooltip content={<CustomTooltip selectedMetric={selectedMetric} />} />
                        <Line
                            type="monotone"
                            dataKey={metricConfig.dataKey}
                            stroke={metricConfig.stroke}
                            strokeWidth={3}
                            fill={`url(#${metricConfig.gradientId})`}
                            dot={{ fill: metricConfig.stroke, r: 4 }}
                            activeDot={{ r: 6, fill: metricConfig.stroke }}
                            name={metricConfig.name}
                            isAnimationActive={false}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}

export default memo(SensorDataTrend)