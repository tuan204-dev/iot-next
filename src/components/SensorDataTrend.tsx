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
                        color: 'text-blue-600',
                        bgColor: 'bg-blue-600',
                        label: 'Temperature'
                    };
                case 'humidity':
                    return {
                        value: data.humidity,
                        unit: '%',
                        color: 'text-green-600',
                        bgColor: 'bg-green-600',
                        label: 'Humidity'
                    };
                case 'light':
                    return {
                        value: data.light,
                        unit: ' Lux',
                        color: 'text-yellow-600',
                        bgColor: 'bg-yellow-600',
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
                    stroke: '#5B9BD5',
                    name: 'Temperature (°C)',
                    dataKey: 'temperature'
                };
            case 'humidity':
                return {
                    stroke: '#70AD47',
                    name: 'Humidity (%)',
                    dataKey: 'humidity'
                };
            case 'light':
                return {
                    stroke: '#FFC000',
                    name: 'Light (Lux)',
                    dataKey: 'light'
                };
        }
    };

    const metricConfig = getMetricConfig();
    return (
        <div className="bg-white rounded-xl p-6 card-shadow flex flex-col h-full">
            <div className="flex items-center justify-between mb-3">
                <div>
                    <h3 className="text-lg font-medium text-gray-900">
                        Sensor Data Trends
                    </h3>
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
                    />
                </div>
            </div>
            <div className="flex-1">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={data}
                        margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                    >
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
                            dot={false}
                            activeDot={{ r: 5, fill: metricConfig.stroke, strokeWidth: 0 }}
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