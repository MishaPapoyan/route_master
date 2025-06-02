import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLoads, deleteLoad, updateLoad } from '../../features/loads/loadSlice';
import LoadForm from './LoadForm';
import { FiPlus, FiRefreshCw, FiSearch, FiPhone } from 'react-icons/fi';
import Header from '../HomePage/Header';

const statusCycle = ['open', 'assigned', 'booked', 'cancelled'];

export default function LoadTable() {
    const dispatch = useDispatch();
    const { items, status, error } = useSelector(state => state.loads);
    const [isOpen, setIsOpen] = useState(false);
    const [editingLoad, setEditingLoad] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [filters, setFilters] = useState({ covered: false, notCovered: false });

    useEffect(() => {
        const load = async () => {
            setIsRefreshing(true);
            await dispatch(fetchLoads());
            setIsRefreshing(false);
        };
        load();
    }, [dispatch]);

    const toggleStatus = (load) => {
        const currentIndex = statusCycle.indexOf(load.status);
        const nextStatus = statusCycle[(currentIndex + 1) % statusCycle.length];
        dispatch(updateLoad({ id: load.id, loadData: { status: nextStatus } }));
    };

    const incrementCallCount = (load) => {
        const newCount = (load.call_count || 0) + 1;
        dispatch(updateLoad({ id: load.id, loadData: { call_count: newCount } }));
    };

    const filtered = items
        .filter(load =>
            ['origin', 'destination', 'broker', 'notes']
                .some(key => String(load[key] || '').toLowerCase().includes(searchQuery.toLowerCase()))
        )
        .filter(load => {
            if (filters.covered && !load.contacted) return false;
            if (filters.notCovered && load.contacted) return false;
            return true;
        });

    return (
        <div className="p-4 md:p-6">
            <Header />

            {status === 'loading' && !isRefreshing && (
                <div className="fixed inset-0 w-full bg-white/50 z-50 flex items-center justify-center">
                    <FiRefreshCw size={32} className="text-blue-600 animate-spin" />
                </div>
            )}

            {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
                    <p>Error: {error}</p>
                </div>
            )}

            <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
                <div className="flex flex-col md:flex-row justify-between items-center p-4 gap-4 border-b">
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        🚛 Load Management
                    </h2>

                    <div className="flex gap-3 w-full md:w-auto">
                        <div className="relative flex-1 max-w-md">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FiSearch className="text-gray-400" />
                            </div>
                            <input
                                type="search"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search loads..."
                                className="pl-10 w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <button
                            onClick={() => {
                                setEditingLoad(null);
                                setIsOpen(true);
                            }}
                            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-4 py-2 rounded-lg shadow-md"
                        >
                            <FiPlus size={18} />
                            Add Load
                        </button>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2 px-4 pt-4 pb-2">
                    {[
                        { label: 'Covered', key: 'covered' },
                        { label: 'Not Covered', key: 'notCovered' }
                    ].map(filter => (
                        <button
                            key={filter.key}
                            onClick={() => setFilters(prev => ({
                                ...prev,
                                [filter.key]: !prev[filter.key]
                            }))}
                            className={`px-3 py-1 rounded-full text-sm border transition-all \${filters[filter.key] ? 'bg-blue-600 text-white border-blue-600' : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-100'}`}
                        >
                            {filter.label}
                        </button>
                    ))}
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3">Origin → Destination</th>
                            <th className="px-4 py-3">Weight</th>
                            <th className="px-4 py-3">Rate</th>
                            <th className="px-4 py-3">Broker</th>
                            <th className="px-4 py-3">Calls</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3">Actions</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y">
                        {filtered.map(load => (
                            <tr key={load.id} className="hover:bg-gray-50">
                                <td className="px-4 py-2">{load.origin} → {load.destination}</td>
                                <td className="px-4 py-2">{load.weight} lbs</td>
                                <td className="px-4 py-2">${load.rate}</td>
                                <td className="px-4 py-2">{load.broker}</td>
                                <td className="px-4 py-2">
                                    <button
                                        onClick={() => incrementCallCount(load)}
                                        className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                                    >
                                        <FiPhone size={14} /> {load.call_count || 0}
                                    </button>
                                </td>
                                <td className="px-4 py-2 capitalize cursor-pointer text-indigo-600 hover:underline"
                                    onClick={() => toggleStatus(load)}
                                    title="Click to change status"
                                >
                                    {load.status || 'open'}
                                </td>
                                <td className="px-4 py-2 flex gap-2">
                                    <button
                                        onClick={() => {
                                            setEditingLoad(load);
                                            setIsOpen(true);
                                        }}
                                        className="text-blue-600 hover:underline"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => dispatch(deleteLoad(load.id))}
                                        className="text-red-500 hover:underline"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}

                        {!isRefreshing && filtered.length === 0 && (
                            <tr>
                                <td colSpan="7" className="text-center py-6 text-gray-400">
                                    No loads found.
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>

            {isOpen && (
                <LoadForm
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                    editingLoad={editingLoad}
                    setEditingLoad={setEditingLoad}
                />
            )}
        </div>
    );
}