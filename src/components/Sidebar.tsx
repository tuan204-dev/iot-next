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
            <div className="flex flex-col w-64 bg-gradient-to-b from-purple-900 via-purple-800 to-indigo-900 text-white">
                <div className="flex items-center justify-center h-20 px-4 border-b border-purple-700">
                    <h1 className="text-2xl !font-bold tracking-wider !m-0">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-300">
                            IOT PTIT
                        </span>
                    </h1>
                </div>
                <div className="flex flex-col flex-grow px-4 py-6 overflow-y-auto">
                    <nav className="flex-1 space-y-2">
                        {menu.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-300 ${
                                    item.active 
                                        ? 'bg-white/20 text-white shadow-lg transform scale-105' 
                                        : 'text-purple-200 hover:bg-white/10 hover:text-white'
                                }`}
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