'use client'

import { Select } from 'antd'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { memo } from 'react'
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

dayjs.extend(relativeTime);

const SensorDataTrend = () => {
    return (
        <div className="mt-8">
            <div className="bg-white rounded-xl p-6 card-shadow">
                <div className="flex items-center justify-between mb-3">
                    <div>
                        <h3 className="text-lg font-medium text-gray-900">
                            Sensor Data Trends
                        </h3>
                        <p className="text-sm text-gray-500">Last 24 hours</p>
                    </div>
                    <div className="flex space-x-2">
                        <Select
                            options={[
                                { value: 'day', label: 'Day' },
                                { value: 'week', label: 'Week' },
                                { value: 'month', label: 'Month' },
                            ]}
                            defaultValue={"day"}
                            size='large'
                        />
                    </div>
                </div>
                <div className="h-[500px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={[
                                { time: '00:00', temperature: 65, humidity: 60, light: 50 },
                                { time: '04:00', temperature: 68, humidity: 65, light: 80 },
                                { time: '08:00', temperature: 50, humidity: 45, light: 350 },
                                { time: '12:00', temperature: 45, humidity: 50, light: 800 },
                                { time: '16:00', temperature: 42, humidity: 55, light: 600 },
                                { time: '20:00', temperature: 48, humidity: 52, light: 280 },
                                { time: '24:00', temperature: 62, humidity: 58, light: 100 }
                            ]}
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
                            <Legend
                                wrapperStyle={{
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    paddingBottom: '30px'
                                }}
                                iconType="rect"
                                align="right"
                                verticalAlign="top"
                                layout="horizontal"
                            />
                            <Line
                                type="monotone"
                                dataKey="temperature"
                                stroke="#5B9BD5"
                                strokeWidth={3}
                                dot={false}
                                activeDot={{ r: 5, fill: '#5B9BD5', strokeWidth: 0 }}
                                name="Temperature (°C)"
                            />
                            <Line
                                type="monotone"
                                dataKey="humidity"
                                stroke="#70AD47"
                                strokeWidth={3}
                                dot={false}
                                activeDot={{ r: 5, fill: '#70AD47', strokeWidth: 0 }}
                                name="Humidity (%)"
                            />
                            <Line
                                type="monotone"
                                dataKey="light"
                                stroke="#FFC000"
                                strokeWidth={3}
                                dot={false}
                                activeDot={{ r: 5, fill: '#FFC000', strokeWidth: 0 }}
                                name="Light (Lux)"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    )
}

export default memo(SensorDataTrend)