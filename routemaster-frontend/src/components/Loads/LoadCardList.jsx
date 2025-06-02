import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLoads, deleteLoad } from '../../features/loads/loadSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiPlus, FiTruck } from 'react-icons/fi';
import LoadCard from "./LoadCard.jsx";
import LoadForm from "./LoadForm.jsx";
import Header from "../HomePage/Header.jsx";

const LoadCardList = () => {
    const dispatch = useDispatch();
    const { list: loads = [], loading, error } = useSelector(state => state.loads || {});
    const [searchTerm, setSearchTerm] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingLoad, setEditingLoad] = useState(null);

    useEffect(() => {
        dispatch(fetchLoads());
    }, [dispatch]);

    const filteredLoads = useMemo(() => {
        const lowerSearch = searchTerm.toLowerCase();
        return loads.filter(load =>
            [
                load.reference_id,
                load.broker_name,
                load.from_location,
                load.to_location,
                load.company,
                load.status,
                String(load.rate),
                String(load.total_pounds)
            ].some(val => val?.toString().toLowerCase().includes(lowerSearch))
        );
    }, [loads, searchTerm]);

    const handleDelete = (id) => {
            dispatch(deleteLoad(id));
    };

    const handleEdit = (load) => {
        setEditingLoad(load);
        setIsFormOpen(true);
    };

    const handleAdd = () => {
        setEditingLoad(null);
        setIsFormOpen(true);
    };

    const handleCloseForm = () => {
        setEditingLoad(null);
        setIsFormOpen(false);
    };

    return (
        <div className="p-6">
            <Header />
            <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="relative w-full sm:max-w-md"
                >
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search loads..."
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </motion.div>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleAdd}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-colors"
                >
                    <FiPlus className="mr-2" /> Add Load
                </motion.button>
            </div>

            {loading && (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            )}

            {error && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-4 bg-red-50 text-red-600 rounded-lg text-center"
                >
                    Error: {error}
                </motion.div>
            )}

            {!loading && !error && (
                filteredLoads.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="p-8 text-center bg-gray-50 rounded-xl"
                    >
                        <FiTruck className="mx-auto text-4xl text-gray-400 mb-3" />
                        <h3 className="text-lg font-medium text-gray-700">No loads found</h3>
                        <p className="text-gray-500 mt-1">Try adjusting your search or add a new load</p>
                    </motion.div>
                ) : (
                    <motion.div
                        layout
                        className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                    >
                        <AnimatePresence>
                            {filteredLoads.map(load => (
                                <LoadCard
                                    key={load.id}
                                    load={load}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                />
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )
            )}

            <AnimatePresence>
                {isFormOpen && (
                    <LoadForm isOpen={isFormOpen} onClose={handleCloseForm} editingLoad={editingLoad} />
                )}
            </AnimatePresence>
        </div>
    );
};

export default LoadCardList;
