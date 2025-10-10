'use client'

import { Select } from 'antd'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { memo, useState, useEffect } from 'react'
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

dayjs.extend(relativeTime);

export interface SensorDataTrendItem {
    time: number;
    temperature: number;
    humidity: number;
    light: number;
}

const SensorDataTrend = () => {
    const [selectedMetric, setSelectedMetric] = useState<'temperature' | 'humidity' | 'light'>('light');
    const [data, setData] = useState([
        { time: '00:00', temperature: 65, humidity: 60, light: 50 },
        { time: '04:00', temperature: 68, humidity: 65, light: 80 },
        { time: '08:00', temperature: 50, humidity: 45, light: 350 },
        { time: '12:00', temperature: 45, humidity: 50, light: 800 },
        { time: '16:00', temperature: 42, humidity: 55, light: 600 },
        { time: '20:00', temperature: 48, humidity: 52, light: 280 },
        { time: '24:00', temperature: 62, humidity: 58, light: 100 }
    ]);

    useEffect(() => {
        const interval = setInterval(() => {
            const newDataPoint = {
                time: dayjs().format('HH:mm'),
                temperature: Math.floor(Math.random() * 30) + 30, // 30-60°C
                humidity: Math.floor(Math.random() * 40) + 40,    // 40-80%
                light: Math.floor(Math.random() * 800) + 50       // 50-850 Lux
            };

            setData(prevData => {
                const newData = [...prevData, newDataPoint];
                // Giữ tối đa 20 điểm dữ liệu
                return newData.length > 20 ? newData.slice(1) : newData;
            });
        }, 2000);

        return () => clearInterval(interval);
    }, []);

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
                        data={data.slice(0, 30)}
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
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#fff',
                                border: '1px solid #e5e7eb',
                                borderRadius: '8px',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                fontSize: '12px'
                            }}
                            labelStyle={{ color: '#374151', fontWeight: '500' }}
                        />
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