'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useMemo } from 'react'

const Sidebar = () => {
    const pathname = usePathname();

    const menu = useMemo(() => [
        {
            name: 'Dashboard',
            href: '/',
            icon: <i className="fas fa-tachometer-alt mr-3" />,
            active: pathname === '/',
        },
        {
            name: 'Data Sensor',
            href: '/sensor-data',
            icon: <i className="fas fa-chart-line mr-3" />,
            active: pathname === '/sensor-data',
        },
        {
            name: 'Action History',
            href: '/action-history',
            icon: <i className="fas fa-history mr-3" />,
            active: pathname === '/action-history',
        },
        {
            name: 'Profile',
            href: '/profile',
            icon: <i className="fas fa-user mr-3" />,
            active: pathname === '/profile',
        },
    ], [pathname]);

    return (
        <div className="hidden md:flex md:flex-shrink-0">
            <div className="flex flex-col w-64 bg-white border-r border-gray-200">
                <div className="flex items-center justify-center h-16 px-4 border-b border-gray-200">
                    <h1 className="text-xl !font-bold text-blue-600 !m-0">IOT PTIT</h1>
                </div>
                <div className="flex flex-col flex-grow px-4 py-4 overflow-y-auto">
                    <nav className="flex-1 space-y-2">
                        {menu.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg sidebar-item ${item.active ? 'active' : ''}`}
                            >
                                {item.icon}
                                {item.name}
                            </Link>
                        ))}
                    </nav>
                </div>
            </div>
        </div>
    )
}
export default Sidebar