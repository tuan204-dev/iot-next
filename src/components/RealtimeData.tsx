'use client'
import { SensorData } from '@/app/page'
import { SENSOR_LIMITS } from '@/constants';
import { IRecentSensorData } from '@/types';
import React, { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast';
import { io, Socket } from 'socket.io-client'

interface RealtimeDataProps {
    setRecentSensorData: React.Dispatch<React.SetStateAction<IRecentSensorData>>;
}

const quantityRender = 150;

const RealtimeData: React.FC<RealtimeDataProps> = ({ setRecentSensorData }) => {
    // WebSocket and sensor states
    // const [isConnected, setIsConnected] = useState(false);
    const [sensorData, setSensorData] = useState<SensorData>({
        temperature: 0,
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
            console.log('Connected to sensor data stream');
        });

        newSocket.on('disconnect', () => {
            console.log('Disconnected from sensor data stream');
        });

        // Sensor data events
        newSocket.on('sensor_data', (data: SensorData) => {
            const now = new Date().toISOString();
            
            setRecentSensorData(prev => {
                const result: IRecentSensorData = {
                    light: prev.light || [],
                    humidity: prev.humidity || [],
                    temperature: prev.temperature || []
                };

                // Only update arrays that have new data
                if (data.light !== undefined && data.light !== null) {
                    result.light = [{ timestamp: now, value: data.light }, ...prev.light.slice(0, quantityRender - 1)];
                }
                if (data.humidity !== undefined && data.humidity !== null) {
                    result.humidity = [{ timestamp: now, value: data.humidity }, ...prev.humidity.slice(0, quantityRender - 1)];
                }
                if (data.temperature !== undefined && data.temperature !== null) {
                    result.temperature = [{ timestamp: now, value: data.temperature }, ...prev.temperature.slice(0, quantityRender - 1)];
                }

                return result;
            });

            setSensorData(data);
            setLastUpdated(new Date().toLocaleTimeString());
            // Animate all cards
            animateCard(tempCardRef);
            animateCard(humidityCardRef);
            animateCard(lightCardRef);

            if (data.temperature > SENSOR_LIMITS.TEMPERATURE.MAX || data.temperature < SENSOR_LIMITS.TEMPERATURE.MIN) {
                toast.error(`Temperature out of range: ${data.temperature}°C`, { duration: 4000 });
            }

            if (data.humidity > SENSOR_LIMITS.HUMIDITY.MAX || data.humidity < SENSOR_LIMITS.HUMIDITY.MIN) {
                toast.error(`Humidity out of range: ${data.humidity}%`, { duration: 4000 });
            }

            if (data.light > SENSOR_LIMITS.LIGHT.MAX || data.light < SENSOR_LIMITS.LIGHT.MIN) {
                toast.error(`Light level out of range: ${data.light} Lux`, { duration: 4000 });
            }
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
    }, [setRecentSensorData]);

    return (
        <>
            {/* Temperature card */}
            <div ref={tempCardRef} className="bg-white/30 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/20 transition-all duration-300 hover:transform hover:scale-105" id="temperature-card">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-semibold text-purple-600 uppercase tracking-wide">
                            Temperature
                        </p>
                        <p className="mt-3 text-4xl font-bold text-gray-900">
                            <span id="temperature-value">{sensorData.temperature}</span> <span className="text-2xl">°C</span>
                        </p>
                    </div>
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-400 text-white shadow-lg">
                        <i className="fas fa-thermometer-half text-3xl" />
                    </div>
                </div>
                <div className="mt-4">
                    <div className="flex items-center text-sm text-gray-600 font-medium">
                        <i className="fas fa-clock mr-1" />
                        <span id="temperature-time">
                            {lastUpdated ? `Last updated: ${lastUpdated}` : 'Waiting for data...'}
                        </span>
                    </div>
                </div>
            </div>
            {/* Humidity card */}
            <div ref={humidityCardRef} className="bg-white/30 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/20 transition-all duration-300 hover:transform hover:scale-105" id="humidity-card">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-semibold text-purple-600 uppercase tracking-wide">
                            Humidity
                        </p>
                        <p className="mt-3 text-4xl font-bold text-gray-900">
                            <span id="humidity-value">{sensorData.humidity}</span> <span className="text-2xl">%</span>
                        </p>
                    </div>
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-400 to-cyan-400 text-white shadow-lg">
                        <i className="fas fa-tint text-3xl" />
                    </div>
                </div>
                <div className="mt-4">
                    <div className="flex items-center text-sm text-gray-600 font-medium">
                        <i className="fas fa-clock mr-1" />
                        <span id="humidity-time">
                            {lastUpdated ? `Last updated: ${lastUpdated}` : 'Waiting for data...'}
                        </span>
                    </div>
                </div>
            </div>
            {/* Light card */}
            <div ref={lightCardRef} className="bg-white/30 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/20 transition-all duration-300 hover:transform hover:scale-105" id="light-card">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-semibold text-purple-600 uppercase tracking-wide">
                            Light
                        </p>
                        <p className="mt-3 text-4xl font-bold text-gray-900">
                            <span id="light-value">{sensorData.light}</span> <span className="text-2xl">Lux</span>
                        </p>
                    </div>
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-400 text-white shadow-lg">
                        <i className="fas fa-lightbulb text-3xl" />
                    </div>
                </div>
                <div className="mt-4">
                    <div className="flex items-center text-sm text-gray-600 font-medium">
                        <i className="fas fa-clock mr-1" />
                        <span id="light-time">
                            {lastUpdated ? `Last updated: ${lastUpdated}` : 'Waiting for data...'}
                        </span>
                    </div>
                </div>
            </div>
        </>
    )
}

export default RealtimeData