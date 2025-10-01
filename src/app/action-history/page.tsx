import React from 'react'
import Link from 'next/link'

const ActionHistoryPage = () => {
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
                                className="flex items-center px-4 py-3 text-sm font-medium rounded-lg sidebar-item"
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
                                className="flex items-center px-4 py-3 text-sm font-medium rounded-lg sidebar-item active"
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
                        <h2 className="ml-4 text-lg font-medium text-gray-800">
                            Action History
                        </h2>
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
                    {/* Page Header */}
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-lg font-medium text-gray-900">Action History</h3>
                            <p className="text-sm text-gray-500">
                                Track and manage all system actions
                            </p>
                        </div>
                        <div>
                            <button className="ant-btn ant-btn-primary">
                                <i className="fas fa-download mr-2" /> Export
                            </button>
                        </div>
                    </div>
                    {/* Filters Section */}
                    <div className="bg-white p-6 rounded-xl card-shadow mb-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                            {/* Search Input */}
                            <div className="lg:col-span-1">
                                <label
                                    htmlFor="search-actions"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Search
                                </label>
                                <div className="ant-input-affix-wrapper">
                                    <span className="ant-input-prefix">
                                        <i className="fas fa-search text-gray-400" />
                                    </span>
                                    <input
                                        id="search-actions"
                                        className="ant-input"
                                        placeholder="Search actions..."
                                        type="text"
                                    />
                                </div>
                            </div>
                            {/* Date Range */}
                            <div className="lg:col-span-1">
                                <label
                                    htmlFor="date-start"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Date Range
                                </label>
                                <div className="flex space-x-2">
                                    <div className="relative flex-1">
                                        <input
                                            id="date-start"
                                            type="date"
                                            className="w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                                            defaultValue="2025-08-01"
                                        />
                                        <span className="absolute -top-2 left-2 bg-white px-1 text-xs text-gray-500">
                                            From
                                        </span>
                                    </div>
                                    <div className="relative flex-1">
                                        <input
                                            id="date-end"
                                            type="date"
                                            className="w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                                            defaultValue="2025-08-29"
                                        />
                                        <span className="absolute -top-2 left-2 bg-white px-1 text-xs text-gray-500">
                                            To
                                        </span>
                                    </div>
                                </div>
                            </div>
                            {/* Action Type Select */}
                            <div className="lg:col-span-1">
                                <label
                                    htmlFor="action-type"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Action Type
                                </label>
                                <select
                                    id="action-type"
                                    className="w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                >
                                    <option>All Action Types</option>
                                    <option>Device Control</option>
                                    <option>System Settings</option>
                                    <option>Security</option>
                                    <option>Automation</option>
                                </select>
                            </div>
                            {/* Status Filter */}
                            <div className="lg:col-span-1">
                                <label
                                    htmlFor="status-filter"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Status
                                </label>
                                <select
                                    id="status-filter"
                                    className="w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                >
                                    <option>All Status</option>
                                    <option>Success</option>
                                    <option>Failed</option>
                                    <option>Pending</option>
                                </select>
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                            <div className="text-sm text-gray-500">
                                Filter actions by search terms, date, type, and status
                            </div>
                            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                                <button className="ant-btn w-full sm:w-auto">
                                    <i className="fas fa-sync-alt mr-2" /> Reset Filters
                                </button>
                                <button className="ant-btn ant-btn-primary w-full sm:w-auto">
                                    <i className="fas fa-filter mr-2" /> Apply Filters
                                </button>
                            </div>
                        </div>
                    </div>
                    {/* Table Section */}
                    <div className="bg-white p-6 rounded-xl card-shadow">
                        <div className="ant-table">
                            <table className="w-full">
                                <thead className="ant-table-thead">
                                    <tr>
                                        <th className="ant-table-cell text-left">ID</th>
                                        <th className="ant-table-cell text-left">Device Name</th>
                                        <th className="ant-table-cell text-left">Action Name</th>
                                        <th className="ant-table-cell text-left">Timestamp</th>
                                        <th className="ant-table-cell text-left">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="ant-table-tbody">
                                    {/* Row 1 */}
                                    <tr className="ant-table-row">
                                        <td className="ant-table-cell">1</td>
                                        <td className="ant-table-cell">LED</td>
                                        <td className="ant-table-cell">Turn on Living Room Light</td>
                                        <td className="ant-table-cell">2023-06-15 09:30:22</td>
                                        <td className="ant-table-cell">
                                            <span className="ant-tag ant-tag-success">Success</span>
                                        </td>
                                    </tr>
                                    {/* Row 2 */}
                                    <tr className="ant-table-row">
                                        <td className="ant-table-cell">2</td>
                                        <td className="ant-table-cell">Air Condition</td>
                                        <td className="ant-table-cell">
                                            Adjust Thermostat Temperature
                                        </td>
                                        <td className="ant-table-cell">2023-06-15 10:15:45</td>
                                        <td className="ant-table-cell">
                                            <span className="ant-tag ant-tag-success">Success</span>
                                        </td>
                                    </tr>
                                    {/* Row 3 */}
                                    <tr className="ant-table-row">
                                        <td className="ant-table-cell">3</td>
                                        <td className="ant-table-cell">Fan</td>
                                        <td className="ant-table-cell">Lock Front Door</td>
                                        <td className="ant-table-cell">2023-06-15 11:02:18</td>
                                        <td className="ant-table-cell">
                                            <span className="ant-tag ant-tag-error">Failed</span>
                                        </td>
                                    </tr>
                                    {/* Row 4 */}
                                    <tr className="ant-table-row">
                                        <td className="ant-table-cell">4</td>
                                        <td className="ant-table-cell">LED</td>
                                        <td className="ant-table-cell">Start Coffee Maker</td>
                                        <td className="ant-table-cell">2023-06-15 12:45:30</td>
                                        <td className="ant-table-cell">
                                            <span className="ant-tag ant-tag-success">Success</span>
                                        </td>
                                    </tr>
                                    {/* Row 5 */}
                                    <tr className="ant-table-row">
                                        <td className="ant-table-cell">5</td>
                                        <td className="ant-table-cell">Air Condition</td>
                                        <td className="ant-table-cell">Close Garage Door</td>
                                        <td className="ant-table-cell">2023-06-15 15:20:11</td>
                                        <td className="ant-table-cell">
                                            <span className="ant-tag ant-tag-processing">Pending</span>
                                        </td>
                                    </tr>
                                    {/* Row 6 */}
                                    <tr className="ant-table-row">
                                        <td className="ant-table-cell">6</td>
                                        <td className="ant-table-cell">Fan</td>
                                        <td className="ant-table-cell">Activate Security System</td>
                                        <td className="ant-table-cell">2023-06-15 18:05:37</td>
                                        <td className="ant-table-cell">
                                            <span className="ant-tag ant-tag-success">Success</span>
                                        </td>
                                    </tr>
                                    {/* Row 7 */}
                                    <tr className="ant-table-row">
                                        <td className="ant-table-cell">7</td>
                                        <td className="ant-table-cell">LED</td>
                                        <td className="ant-table-cell">Turn off All Lights</td>
                                        <td className="ant-table-cell">2023-06-15 22:30:08</td>
                                        <td className="ant-table-cell">
                                            <span className="ant-tag ant-tag-error">Failed</span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        {/* Pagination */}
                        <div className="flex justify-between items-center mt-6">
                            <div className="text-gray-500 text-sm">
                                Showing 1 to 7 of 24 entries
                            </div>
                            <div className="flex items-center space-x-2">
                                <button className="ant-btn" disabled="">
                                    <i className="fas fa-chevron-left" />
                                </button>
                                <span className="px-3 py-1 bg-blue-500 text-white rounded">1</span>
                                <span className="px-3 py-1 text-gray-500">/ 4</span>
                                <button className="ant-btn">
                                    <i className="fas fa-chevron-right" />
                                </button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}

export default ActionHistoryPage