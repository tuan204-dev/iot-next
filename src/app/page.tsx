'use client'
import { Button, Select, Switch } from 'antd'
import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { triggerDevice } from '@/servers'
import { io, Socket } from 'socket.io-client'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import relativeTime from 'dayjs/plugin/relativeTime';
import dayjs from 'dayjs';

dayjs.extend(relativeTime);

export interface SensorData {
    temp: number
    humidity: number
    light: number
}

const HomePage = () => {
    // Device control states
    const [isSwitchingLed, setIsSwitchingLed] = useState(false);
    const [isSwitchingFan, setIsSwitchingFan] = useState(false);
    const [isSwitchingAirConditioner, setIsSwitchingAirConditioner] = useState(false);

    const [isLedOn, setIsLedOn] = useState(false);
    const [isFanOn, setIsFanOn] = useState(false);
    const [isAirConditionerOn, setIsAirConditionerOn] = useState(false);

    const [lastChangeLed, setLastChangeLed] = useState<Date | null>(null);
    const [lastChangeFan, setLastChangeFan] = useState<Date | null>(null);
    const [lastChangeAirConditioner, setLastChangeAirConditioner] = useState<Date | null>(null);

    // WebSocket and sensor states
    const [isConnected, setIsConnected] = useState(false);
    const [sensorData, setSensorData] = useState<SensorData>({
        temp: 0,
        humidity: 0,
        light: 0
    });
    const [lastUpdated, setLastUpdated] = useState<string>('');

    const socketRef = useRef<Socket | null>(null);
    const tempCardRef = useRef<HTMLDivElement>(null);
    const humidityCardRef = useRef<HTMLDivElement>(null);
    const lightCardRef = useRef<HTMLDivElement>(null);

    // Add animation to card when data updates
    const animateCard = (cardRef: React.RefObject<HTMLDivElement | null>) => {
        if (cardRef.current) {
            cardRef.current.classList.add('updated');
            setTimeout(() => {
                if (cardRef.current) {
                    cardRef.current.classList.remove('updated');
                }
            }, 2000);
        }
    };

    // WebSocket connection setup
    useEffect(() => {
        // Connect to WebSocket server
        const newSocket = io('http://localhost:8000/realtime');
        socketRef.current = newSocket;

        // Connection events
        newSocket.on('connect', () => {
            setIsConnected(true);
        });

        newSocket.on('disconnect', () => {
            setIsConnected(false);
        });

        // Sensor data events
        newSocket.on('sensor_data', (data: SensorData) => {
            setSensorData(data);
            setLastUpdated(new Date().toLocaleTimeString());
            // Animate all cards
            animateCard(tempCardRef);
            animateCard(humidityCardRef);
            animateCard(lightCardRef);
        });

        newSocket.on('temperature', (data: { value: number; unit: string }) => {
            setSensorData(prev => ({
                ...prev,
                temp: data.value
            }));
            setLastUpdated(new Date().toLocaleTimeString());
            animateCard(tempCardRef);
        });

        newSocket.on('humidity', (data: { value: number; unit: string }) => {
            setSensorData(prev => ({
                ...prev,
                humidity: data.value
            }));
            setLastUpdated(new Date().toLocaleTimeString());
            animateCard(humidityCardRef);
        });

        newSocket.on('light', (data: { value: number; unit: string }) => {
            setSensorData(prev => ({
                ...prev,
                light: data.value
            }));
            setLastUpdated(new Date().toLocaleTimeString());
            animateCard(lightCardRef);
        });

        // Cleanup on unmount
        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, []);

    const handleSwitchLed = async (isTurnOn: boolean) => {
        try {
            setIsSwitchingLed(true);
            if (!isTurnOn) {
                await triggerDevice({
                    actionId: 2,
                    actuatorId: 3
                })

                setIsLedOn(false);
            } else {
                await triggerDevice({
                    actionId: 1,
                    actuatorId: 3
                })

                setIsLedOn(true);
            }
            setLastChangeLed(new Date());
        } finally {
            setIsSwitchingLed(false);
        }
    }

    const handleSwitchFan = async (isTurnOn: boolean) => {
        try {
            setIsSwitchingFan(true);
            if (!isTurnOn) {
                await triggerDevice({
                    actionId: 4,
                    actuatorId: 4
                })

                setIsFanOn(false);
            } else {
                await triggerDevice({
                    actionId: 3,
                    actuatorId: 4
                })

                setIsFanOn(true);
            }
            setLastChangeFan(new Date());
        } finally {
            setIsSwitchingFan(false);
        }
    }

    const handleSwitchAirConditioner = async (isTurnOn: boolean) => {
        try {
            setIsSwitchingAirConditioner(true);
            if (!isTurnOn) {
                await triggerDevice({
                    actionId: 6,
                    actuatorId: 5
                })

                setIsAirConditionerOn(false);
            } else {
                await triggerDevice({
                    actionId: 5,
                    actuatorId: 5
                })

                setIsAirConditionerOn(true);
            }
            setLastChangeAirConditioner(new Date());
        } finally {
            setIsSwitchingAirConditioner(false);
        }
    }


    return (
        <div className="flex h-screen overflow-hidden">
            {/* Sidebar */}
            <div className="hidden md:flex md:flex-shrink-0">
                <div className="flex flex-col w-64 bg-white border-r border-gray-200">
                    <div className="flex items-center justify-center h-16 px-4 border-b border-gray-200">
                        <h1 className="text-xl font-bold text-blue-600">SensorDash</h1>
                    </div>
                    <div className="flex flex-col flex-grow px-4 py-4 overflow-y-auto">
                        <nav className="flex-1 space-y-2">
                            <Link
                                href="/"
                                className="flex items-center px-4 py-3 text-sm font-medium rounded-lg sidebar-item active"
                            >
                                <i className="fas fa-tachometer-alt mr-3" />
                                Dashboard
                            </Link>
                            <Link
                                href="/sensor-data"
                                className="flex items-center px-4 py-3 text-sm font-medium rounded-lg sidebar-item"
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
                                <p className="text-xs text-gray-500">Admin</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Main content */}
            <div className="flex flex-col flex-1 overflow-hidden">
                {/* Top navigation */}
                <header className="flex items-center justify-between h-16 px-6 bg-white border-b border-gray-200">
                    <div className="flex items-center">
                        <button className="md:hidden text-gray-500 focus:outline-none">
                            <i className="fas fa-bars" />
                        </button>
                        <h2 className="ml-4 text-lg font-medium text-gray-800">Dashboard</h2>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button className="p-1 text-gray-500 rounded-full focus:outline-none">
                            <i className="fas fa-bell" />
                        </button>
                        <button className="p-1 text-gray-500 rounded-full focus:outline-none">
                            <i className="fas fa-cog" />
                        </button>
                    </div>
                </header>
                {/* Main content area */}
                <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
                    {/* Cards grid */}
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {/* Temperature card */}
                        <div ref={tempCardRef} className="bg-white rounded-xl p-6 card-shadow" id="temperature-card">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Temperature</p>
                                    <p className="mt-1 text-3xl font-semibold text-gray-900">
                                        <span id="temperature-value">{sensorData.temp}</span> <span className="text-xl">°C</span>
                                    </p>
                                </div>
                                <div className="p-3 rounded-full bg-blue-50 text-blue-600">
                                    <i className="fas fa-thermometer-half text-xl" />
                                </div>
                            </div>
                            <div className="mt-4">
                                <div className="flex items-center text-sm text-gray-500">
                                    <i className="fas fa-clock mr-1" />
                                    <span id="temperature-time">
                                        {lastUpdated ? `Last updated: ${lastUpdated}` : 'Waiting for data...'}
                                    </span>
                                </div>
                            </div>
                        </div>
                        {/* Humidity card */}
                        <div ref={humidityCardRef} className="bg-white rounded-xl p-6 card-shadow" id="humidity-card">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Humidity</p>
                                    <p className="mt-1 text-3xl font-semibold text-gray-900">
                                        <span id="humidity-value">{sensorData.humidity}</span> <span className="text-xl">%</span>
                                    </p>
                                </div>
                                <div className="p-3 rounded-full bg-blue-50 text-blue-600">
                                    <i className="fas fa-tint text-xl" />
                                </div>
                            </div>
                            <div className="mt-4">
                                <div className="flex items-center text-sm text-gray-500">
                                    <i className="fas fa-clock mr-1" />
                                    <span id="humidity-time">
                                        {lastUpdated ? `Last updated: ${lastUpdated}` : 'Waiting for data...'}
                                    </span>
                                </div>
                            </div>
                        </div>
                        {/* Light card */}
                        <div ref={lightCardRef} className="bg-white rounded-xl p-6 card-shadow" id="light-card">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Light</p>
                                    <p className="mt-1 text-3xl font-semibold text-gray-900">
                                        <span id="light-value">{sensorData.light}</span> <span className="text-xl">Lux</span>
                                    </p>
                                </div>
                                <div className="p-3 rounded-full bg-blue-50 text-blue-600">
                                    <i className="fas fa-lightbulb text-xl" />
                                </div>
                            </div>
                            <div className="mt-4">
                                <div className="flex items-center text-sm text-gray-500">
                                    <i className="fas fa-clock mr-1" />
                                    <span id="light-time">
                                        {lastUpdated ? `Last updated: ${lastUpdated}` : 'Waiting for data...'}
                                    </span>
                                </div>
                            </div>
                        </div>
                        {/* Lamp control card */}
                        <div className="bg-white rounded-xl p-6 card-shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Led</p>
                                    <p className="mt-1 text-lg font-semibold text-gray-900">
                                        Led Room
                                    </p>
                                </div>
                                <Switch checked={isLedOn} onChange={handleSwitchLed} loading={isSwitchingLed} />
                            </div>
                            <div className="mt-4">
                                {lastChangeLed &&
                                    <div className="flex items-center text-sm text-gray-500">
                                        <i className="fas fa-clock mr-1" />
                                        <span>Last changed: {dayjs(lastChangeLed).fromNow()}</span>
                                    </div>
                                }
                            </div>
                        </div>
                        {/* Fan control card */}
                        <div className="bg-white rounded-xl p-6 card-shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Fan</p>
                                    <p className="mt-1 text-lg font-semibold text-gray-900">
                                        Bedroom
                                    </p>
                                </div>
                                <Switch checked={isFanOn} onChange={handleSwitchFan} loading={isSwitchingFan} />
                            </div>
                            <div className="mt-4">
                                {lastChangeFan && (
                                    <div className="flex items-center text-sm text-gray-500">
                                        <i className="fas fa-clock mr-1" />
                                        <span>Last changed: {dayjs(lastChangeFan).fromNow()}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        {/* Air control card */}
                        <div className="bg-white rounded-xl p-6 card-shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Air Purifier</p>
                                    <p className="mt-1 text-lg font-semibold text-gray-900">Office</p>
                                </div>
                                <Switch checked={isAirConditionerOn} onChange={handleSwitchAirConditioner} loading={isSwitchingAirConditioner} />
                            </div>
                            <div className="mt-4">
                                {lastChangeAirConditioner && (
                                    <div className="flex items-center text-sm text-gray-500">
                                        <i className="fas fa-clock mr-1" />
                                        <span>Last changed: {dayjs(lastChangeAirConditioner).fromNow()}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    {/* Chart section */}
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
                </main>
            </div>
        </div>
    )
}

export default HomePage