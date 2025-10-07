'use client'
import { SensorData } from '@/app/page'
import React, { useEffect, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'

const RealtimeData = () => {
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

    return (
        <>
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
        </>
    )
}

export default RealtimeData