import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import Header from "../HomePage/Header.jsx";

// Reusable card
function StatCard({ label, value, color = 'gray' }) {
    return (
        <div className={`bg-white shadow rounded-lg p-4 border-t-4 border-${color}-500`}>
            <h3 className="text-sm text-gray-500 font-medium">{label}</h3>
            <p className={`text-2xl font-bold text-${color}-600 mt-1`}>{value}</p>
        </div>
    );
}

// Driver Stats Table
function DriverStatsTable({ drivers }) {
    if (!drivers.length) return null;

    const getMostActiveDay = (createdDates) => {
        const counts = {};
        createdDates.forEach(date => {
            const day = new Date(date).toLocaleDateString('en-US', { weekday: 'long' });
            counts[day] = (counts[day] || 0) + 1;
        });
        return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';
    };

    return (
        <div className="overflow-x-auto mt-10">
            <h2 className="text-xl font-semibold mb-2 text-gray-800">📋 Driver Stats (Top 15)</h2>
            <table className="min-w-full bg-white border border-gray-200 text-sm">
                <thead className="bg-gray-50 text-gray-700">
                <tr>
                    <th className="px-4 py-2 text-left">Name</th>
                    <th className="px-4 py-2">Phone</th>
                    <th className="px-4 py-2">Route</th>
                    <th className="px-4 py-2">Calls</th>
                    <th className="px-4 py-2">Avg Rate</th>
                    <th className="px-4 py-2">Weight</th>
                    <th className="px-4 py-2">Team</th>
                    <th className="px-4 py-2">Feet</th>
                    <th className="px-4 py-2">Nationality</th>
                    <th className="px-4 py-2">Most Active Day</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                {drivers.slice(0, 15).map(driver => (
                    <tr key={driver.id} className="hover:bg-gray-50">
                        <td className="px-4 py-2">{driver.name}</td>
                        <td className="px-4 py-2">{driver.phone_number}</td>
                        <td className="px-4 py-2">{driver.main_route || '—'}</td>
                        <td className="px-4 py-2 text-center">{driver.call_count || 0}</td>
                        <td className="px-4 py-2 text-center">${driver.average_rate || 0}</td>
                        <td className="px-4 py-2 text-center">{driver.max_weight_capacity || '—'}</td>
                        <td className="px-4 py-2 text-center">{driver.team_or_solo || '—'}</td>
                        <td className="px-4 py-2 text-center">{driver.total_feet || '—'}</td>
                        <td className="px-4 py-2 text-center">{driver.nationality || '—'}</td>
                        <td className="px-4 py-2 text-center">
                            {getMostActiveDay([driver.createdAt])}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default function Dashboard() {
    const { list: loads = [] } = useSelector(state => state.loads || {});
    const { list: drivers = [] } = useSelector(state => state.drivers || {});
    const [timeframe, setTimeframe] = useState('daily');

    const now = new Date();

    const filteredLoads = useMemo(() => {
        return loads.filter(load => {
            const createdAt = new Date(load.createdAt);
            if (timeframe === 'daily') return createdAt.toDateString() === now.toDateString();
            if (timeframe === 'weekly') {
                const sevenDaysAgo = new Date();
                sevenDaysAgo.setDate(now.getDate() - 7);
                return createdAt >= sevenDaysAgo;
            }
            if (timeframe === 'monthly') return createdAt.getMonth() === now.getMonth();
            return true;
        });
    }, [loads, timeframe]);

    const totalLoads = filteredLoads.length;
    const totalCovered = filteredLoads.filter(l => l.contacted).length;
    const totalCalls = filteredLoads.reduce((sum, l) => sum + (l.call_count || 0), 0);
    const totalProfit = filteredLoads.reduce((sum, l) =>
        sum + ((parseFloat(l.price_bought) || 0) - (parseFloat(l.price_sold) || 0)), 0);
    const avgProfit = totalLoads > 0 ? totalProfit / totalLoads : 0;
    const avgCalls = totalLoads > 0 ? totalCalls / totalLoads : 0;

    const statusCounts = filteredLoads.reduce((acc, l) => {
        const s = l.status || 'open';
        acc[s] = (acc[s] || 0) + 1;
        return acc;
    }, {});

    const companies = new Set(filteredLoads.map(l => l.company).filter(Boolean));

    const brokerCount = filteredLoads.reduce((acc, l) => {
        const broker = l.broker_name || 'Unknown';
        acc[broker] = (acc[broker] || 0) + 1;
        return acc;
    }, {});
    const mostFrequentBroker = Object.entries(brokerCount)
        .sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

    // Drivers sorted by call_count
    const topDrivers = [...drivers].sort((a, b) => (b.call_count || 0) - (a.call_count || 0));

    return (
        <div className="p-6 space-y-6">
            <Header />
            <h1 className="text-3xl font-bold text-gray-800">📊 Load Dashboard</h1>

            <div className="flex gap-2 mb-6">
                {['daily', 'weekly', 'monthly'].map(key => (
                    <button
                        key={key}
                        onClick={() => setTimeframe(key)}
                        className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
                            timeframe === key
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'
                        }`}
                    >
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                <StatCard label="Total Loads" value={totalLoads} color="blue" />
                <StatCard label="Covered Loads" value={totalCovered} color="red" />
                <StatCard label="Total Calls" value={totalCalls} color="green" />
                <StatCard label="Total Profit" value={`$${totalProfit.toFixed(2)}`} color="emerald" />
                <StatCard label="Avg Profit per Load" value={`$${avgProfit.toFixed(2)}`} color="amber" />
                <StatCard label="Avg Calls per Load" value={avgCalls.toFixed(2)} color="purple" />
                <StatCard label="Open Loads" value={statusCounts.open || 0} color="gray" />
                <StatCard label="Assigned Loads" value={statusCounts.assigned || 0} color="orange" />
                <StatCard label="Booked Loads" value={statusCounts.booked || 0} color="cyan" />
                <StatCard label="Cancelled Loads" value={statusCounts.cancelled || 0} color="pink" />
                <StatCard label="Unique Companies" value={companies.size} color="fuchsia" />
                <StatCard label="Top Broker" value={mostFrequentBroker} color="teal" />
            </div>

            <DriverStatsTable drivers={topDrivers} />
        </div>
    );
}
