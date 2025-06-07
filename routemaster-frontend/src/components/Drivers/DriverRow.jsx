import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { updateDriverClick, updateDriver, fetchDrivers, deleteDriver } from "../../features/drivers/driverSlice.js";
import { motion } from "framer-motion";
import { FiEdit2, FiTrash2, FiCheck, FiX, FiPhone, FiPhoneOff } from "react-icons/fi";

export default function DriverRow({ driver, onDelete, onEdit, onCellClick }) {
    const [covered, setIsCovered] = useState(driver.covered || false);
    const [localCallCount, setLocalCallCount] = useState(driver.call_count || 0);
    const [localDidntConnectCount, setLocalDidntConnectCount] = useState(driver.didnt_connect_count || 0);
    const [isHovered, setIsHovered] = useState(false);
    const [selectedNote, setSelectedNote] = useState(null);

    const callClickTimeoutRef = useRef(null);
    const dcClickTimeoutRef = useRef(null);
    const dispatch = useDispatch();

    const createdAt = new Date(driver.createdAt);
    const date = createdAt.toLocaleDateString();
    const time = createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const handleCallClick = async () => {
        if (callClickTimeoutRef.current) {
            clearTimeout(callClickTimeoutRef.current);
            callClickTimeoutRef.current = null;
            setLocalCallCount(prev => Math.max(0, prev - 1));
            await dispatch(updateDriverClick({ id: driver.id, type: 'call', change: -1 }));
        } else {
            callClickTimeoutRef.current = setTimeout(async () => {
                setLocalCallCount(prev => prev + 1);
                await dispatch(updateDriverClick({ id: driver.id, type: 'call', change: 1 }));
                callClickTimeoutRef.current = null;
            }, 250);
        }
        await dispatch(fetchDrivers());
    };

    const handleDCClick = async () => {
        if (dcClickTimeoutRef.current) {
            clearTimeout(dcClickTimeoutRef.current);
            dcClickTimeoutRef.current = null;
            setLocalDidntConnectCount(prev => Math.max(0, prev - 1));
            await dispatch(updateDriverClick({ id: driver.id, type: 'didnt_connect', change: -1 }));
        } else {
            dcClickTimeoutRef.current = setTimeout(async () => {
                setLocalDidntConnectCount(prev => prev + 1);
                await dispatch(updateDriverClick({ id: driver.id, type: 'didnt_connect', change: 1 }));
                dcClickTimeoutRef.current = null;
            }, 250);
        }
        await dispatch(fetchDrivers());
    };

    const handleConnectClick = async () => {
        await dispatch(updateDriverClick({ id: driver.id, type: 'connect', change: 1 }));
        await dispatch(fetchDrivers());
    };

    useEffect(() => {
        setIsCovered(driver.covered || false);
        setLocalCallCount(driver.call_count || 0);
        setLocalDidntConnectCount(driver.didnt_connect_count || 0);
    }, [driver]);

    const toggleCovered = async () => {
        const newVal = !covered;
        setIsCovered(newVal);
        await dispatch(updateDriver({ id: driver.id, covered: newVal }));
        await dispatch(fetchDrivers());
    };

    const handleDelete = async () => {
        await dispatch(deleteDriver(driver.id));
        await dispatch(fetchDrivers());
    };

    return (
        <motion.tr
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className={`border-b text-sm ${covered ? 'bg-red-500' : 'hover:bg-gray-50'}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <td
                onClick={() => onCellClick('name', driver.name)}
                className="px-4 py-3 font-medium text-gray-800 cursor-pointer hover:text-blue-600"
            >
                {driver.name}
            </td>

            <td
                onClick={() => onCellClick('phone_number', driver.phone_number)}
                className="px-4 py-3 cursor-pointer text-blue-600 hover:underline"
            >
                {driver.phone_number}
            </td>

            <td
                onClick={() => driver.current_location && onCellClick('current_location', driver.current_location)}
                className="px-4 py-3 cursor-pointer"
            >
                <span className="inline-block px-2 py-1 rounded-full text-blue-800 text-xs">
                    {driver.current_location || '-'}
                </span>
            </td>

            <td
                onClick={() => driver.next_location && onCellClick('next_location', driver.next_location)}
                className="px-4 py-3 cursor-pointer"
            >
                <span className="inline-block px-2 py-1 rounded-full bg-purple-100 text-purple-800 text-xs">
                    {driver.next_location || '-'}
                </span>
            </td>

            <td className="px-4 py-3 text-center">
                <motion.div
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCallClick}
                    className={`cursor-pointer inline-flex items-center justify-center w-8 h-8 rounded-full ${localCallCount > 0 ? 'bg-green-100 text-green-600' : 'text-gray-500'}`}
                >
                    <FiPhone size={14} />
                    {localCallCount > 0 && (
                        <span className="ml-1 text-xs font-medium">{localCallCount}</span>
                    )}
                </motion.div>
            </td>

            <td
                onClick={() => driver.rigz_id && onCellClick('rigz_id', driver.rigz_id)}
                className="px-4 py-3 font-mono text-sm text-gray-600 cursor-pointer"
            >
                {driver.rigz_id || '-'}
            </td>

            <td className="px-4 py-3 text-center">
                {driver.max_weight_capacity ? (
                    <span className="px-2 py-1 text-orange-800 rounded-md text-xs">
                        {driver.max_weight_capacity} lbs
                    </span>
                ) : '-'}
            </td>

            <td className="px-4 py-3 text-center">
                {driver.average_rate ? (
                    <span className="font-medium text-green-600">
                        ${driver.average_rate}
                    </span>
                ) : '-'}
            </td>

            <td className="px-4 py-3 max-w-xs truncate">
                {(driver.preferred_routes || []).map((route, i) => (
                    <span
                        key={i}
                        onClick={() => onCellClick('main_route', route)}
                        className="inline-block mr-1 mb-1 px-2 py-0.5 text-gray-700 rounded-md text-xs cursor-pointer hover:bg-gray-200"
                    >
                        {route}
                    </span>
                ))}
            </td>

            <td
                onClick={() => driver.nationality && onCellClick('nationality', driver.nationality)}
                className="px-4 py-3 text-xs uppercase tracking-wider text-gray-500 cursor-pointer"
            >
                {driver.nationality || '-'}
            </td>

            <td
                onClick={() => onCellClick('createdAt', date)}
                className="px-4 py-3 text-xs text-gray-500 cursor-pointer hover:text-blue-600 transition-colors"
            >
                {date}
            </td>

            <td
                onClick={() => onCellClick('createdAt', time)}
                className="px-4 py-3 text-xs text-gray-500 cursor-pointer hover:text-blue-600 transition-colors"
            >
                {time}
            </td>

            <td
                className="px-4 py-3 max-w-xs truncate text-xs text-gray-500 cursor-pointer hover:text-blue-600"
                onClick={() => setSelectedNote(driver.notes)}
                title="Click to view full note"
            >
                {driver.notes ? `${driver.notes.slice(0, 5)}${driver.notes.length > 40 ? '...' : ''}` : '-'}
            </td>

            <td className="px-4 py-3 text-center">
                {driver.status === 'connect' ? (
                    <motion.div
                        whileTap={{ scale: 0.9 }}
                        onClick={handleConnectClick}
                        className="cursor-pointer inline-flex items-center justify-center w-8 h-8 rounded-full text-green-600"
                    >
                        <FiCheck size={16} />
                    </motion.div>
                ) : (
                    <motion.div
                        whileTap={{ scale: 0.9 }}
                        onClick={handleDCClick}
                        className="cursor-pointer inline-flex flex-col items-center justify-center"
                    >
                        <div className="text-xs text-gray-400 mb-1">+{localDidntConnectCount}</div>
                        <div className="w-8 h-8 rounded-full text-red-600 flex items-center justify-center">
                            <FiPhoneOff size={14} />
                        </div>
                    </motion.div>
                )}
            </td>

            <td className="px-4 py-3">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isHovered || covered ? 1 : 0.5 }}
                    className="flex space-x-2 justify-end"
                >
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onEdit(driver)}
                        className="p-2 rounded-full text-blue-600 hover:bg-blue-200 transition-colors"
                    >
                        <FiEdit2 size={16} />
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onDelete(driver.id)}
                        className="p-2 rounded-full text-red-600 hover:bg-red-200 transition-colors"
                    >
                        <FiTrash2 size={16} />
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={toggleCovered}
                        className={`p-2 rounded-full ${covered ? 'text-red-600' : 'text-gray-600'} hover:bg-gray-200 transition-colors`}
                    >
                        {covered ? <FiX size={16} /> : <FiCheck size={16} />}
                    </motion.button>
                </motion.div>
            </td>

            {selectedNote && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg max-w-md w-full shadow-lg text-gray-800 relative">
                        <button
                            onClick={() => setSelectedNote(null)}
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                        >
                            ✕
                        </button>
                        <h3 className="text-lg font-bold mb-2">Driver Note</h3>
                        <p className="text-sm">{selectedNote}</p>
                    </div>
                </div>
            )}
        </motion.tr>
    );
}