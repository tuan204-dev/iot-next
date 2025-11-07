'use client'
import { useDayCount } from '@/hook/action-history'
import { Table, Card } from 'antd'
import React, { useMemo } from 'react'
import type { ColumnsType } from 'antd/es/table'

interface DataType {
    key: string
    deviceId: number
    deviceName: string
    on: number
    off: number
    total: number
}

const CountDay = () => {
    const { deviceCount, isLoading } = useDayCount()

    // Map device IDs to names
    const getDeviceName = (deviceId: number): string => {
        const deviceNames: Record<number, string> = {
            3: 'LED',
            4: 'Fan',
            5: 'Air Conditioner',
            6: 'Bell'
        }
        return deviceNames[deviceId] || `Device ${deviceId}`
    }

    // Prepare data for table
    const tableData: DataType[] = useMemo(() => {
        if (!deviceCount) return []
        
        return deviceCount.map((device) => ({
            key: device.deviceId.toString(),
            deviceId: device.deviceId,
            deviceName: getDeviceName(device.deviceId),
            on: device.counts.on,
            off: device.counts.off,
            total: device.counts.on + device.counts.off
        }))
    }, [deviceCount])

    const columns: ColumnsType<DataType> = [
        {
            title: 'Device ID',
            dataIndex: 'deviceId',
            key: 'deviceId',
            align: 'center',
            width: 120,
        },
        {
            title: 'Device Name',
            dataIndex: 'deviceName',
            key: 'deviceName',
            width: 200,
        },
        {
            title: 'ON Count',
            dataIndex: 'on',
            key: 'on',
            align: 'center',
            width: 150,
            render: (value: number) => (
                <span className="text-green-600 font-semibold">{value}</span>
            )
        },
        {
            title: 'OFF Count',
            dataIndex: 'off',
            key: 'off',
            align: 'center',
            width: 150,
            render: (value: number) => (
                <span className="text-red-600 font-semibold">{value}</span>
            )
        },
        {
            title: 'Total Actions',
            dataIndex: 'total',
            key: 'total',
            align: 'center',
            width: 150,
            render: (value: number) => (
                <span className="text-blue-600 font-semibold">{value}</span>
            )
        },
    ]

    return (
        <div className="p-6 bg-gray-50 min-h-screen w-full">
            <Card 
                title={
                    <div className="flex items-center gap-2">
                        <i className="fas fa-chart-bar" />
                        <span>Device ON/OFF Count Today</span>
                    </div>
                }
                className="shadow-lg"
            >
                <Table
                    columns={columns}
                    dataSource={tableData}
                    loading={isLoading}
                    pagination={false}
                    bordered
                    size="middle"
                />
            </Card>
        </div>
    )
}

export default CountDay