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
    };

    const handleConnectClick = async () => {
        await dispatch(updateDriverClick({ id: driver.id, type: 'connect', change: 1 }));
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
            <td className="px-4 py-3 font-medium text-gray-800 cursor-pointer" onClick={() => onCellClick('name', driver.name)}>
                {driver.name}
            </td>
            <td className="px-4 py-3 text-blue-600 hover:underline cursor-pointer" onClick={() => onCellClick('phone_number', driver.phone_number)}>
                {driver.phone_number}
            </td>
            <td className="px-4 py-3">{driver.current_location}</td>
            <td className="px-4 py-3">{driver.next_location}</td>

            <td className="px-4 py-3 text-center">
                <button type="button" onClick={handleCallClick}>
                    <motion.div
                        whileTap={{ scale: 0.95 }}
                        className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${localCallCount > 0 ? 'bg-green-100 text-green-800' : 'text-gray-500'}`}
                    >
                        <FiPhone size={14} />
                        {localCallCount > 0 && <span className="ml-1 text-xs font-medium">{localCallCount}</span>}
                    </motion.div>
                </button>
            </td>

            <td className="px-4 py-3">{driver.rigz_id}</td>
            <td className="px-4 py-3 text-orange-700">{driver.max_weight_capacity} lbs</td>
            <td className="px-4 py-3 text-green-600">${driver.average_rate}</td>
            <td className="px-4 py-3">{(driver.preferred_routes || []).join(', ')}</td>
            <td className="px-4 py-3">{driver.nationality}</td>
            <td className="px-4 py-3 text-gray-500">{date}</td>
            <td className="px-4 py-3 text-gray-500">{time}</td>
            <td className="px-4 py-3 text-gray-500 cursor-pointer" onClick={() => setSelectedNote(driver.notes)}>
                {driver.notes ? `${driver.notes.slice(0, 20)}...` : '-'}
            </td>

            <td className="px-4 py-3 text-center">
                {driver.status === 'connect' ? (
                    <button type="button" onClick={handleConnectClick}>
                        <motion.div whileTap={{ scale: 0.9 }} className="inline-flex items-center justify-center w-8 h-8 rounded-full text-green-600">
                            <FiCheck size={16} />
                        </motion.div>
                    </button>
                ) : (
                    <button type="button" onClick={handleDCClick}>
                        <motion.div whileTap={{ scale: 0.9 }} className="inline-flex flex-col items-center justify-center">
                            <div className="text-xs text-gray-400 mb-1">+{localDidntConnectCount}</div>
                            <div className="w-8 h-8 rounded-full text-red-600 flex items-center justify-center">
                                <FiPhoneOff size={14} />
                            </div>
                        </motion.div>
                    </button>
                )}
            </td>

            <td className="px-4 py-3">
                <div className="flex space-x-2 justify-end">
                    <button type="button" onClick={() => onEdit(driver)}>
                        <FiEdit2 size={16} className="text-blue-600 hover:text-blue-800" />
                    </button>
                    <button type="button" onClick={() => onDelete(driver.id)}>
                        <FiTrash2 size={16} className="text-red-600 hover:text-red-800" />
                    </button>
                    <button type="button" onClick={toggleCovered}>
                        {covered ? (
                            <FiX size={16} className="text-red-600 hover:text-red-800" />
                        ) : (
                            <FiCheck size={16} className="text-gray-600 hover:text-green-600" />
                        )}
                    </button>
                </div>
            </td>
        </motion.tr>
    );
}
