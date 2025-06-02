
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiPlus, FiEdit2, FiTrash2, FiX, FiTruck, FiDollarSign, FiMapPin, FiPackage, FiBriefcase } from 'react-icons/fi';
import { FaWeightHanging } from 'react-icons/fa';
import InfoRow from "./InfoRow.jsx";

const LoadCard = ({ load, onEdit, onDelete }) => {
    const statusColors = {
        pending: 'bg-yellow-100 text-yellow-800',
        active: 'bg-blue-100 text-blue-800',
        completed: 'bg-green-100 text-green-800',
        cancelled: 'bg-red-100 text-red-800',
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="border border-gray-200 rounded-xl shadow-sm p-5 bg-white hover:shadow-md transition-shadow"
        >
            <div className="flex justify-between items-center mb-3">
                <div className="font-semibold text-base flex items-center">
                    <FiTruck className="mr-2 text-gray-500" />
                    REF: {load.reference_id}
                </div>
                <div className={`text-xs px-3 py-1 rounded-full ${statusColors[load.status?.toLowerCase()] || 'bg-gray-100 text-gray-800'}`}>
                    {load.status || 'Unknown'}
                </div>
            </div>

            <div className="space-y-2 mb-4">
                <InfoRow label="Broker" value={load.broker_name} icon="broker" />
                <InfoRow label="Rate" value={`$${load.rate}`} icon="rate" />
                <InfoRow label="From" value={load.from_location} icon="from" />
                <InfoRow label="To" value={load.to_location} icon="to" />
                <InfoRow label="Weight" value={`${load.total_pounds} lbs`} icon="weight" />
                <InfoRow label="Company" value={load.company} icon="company" />
            </div>

            <div className="flex justify-end space-x-2">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onEdit(load)}
                    className="flex items-center px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
                >
                    <FiEdit2 className="mr-1" /> Details
                </motion.button>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onDelete(load.id)}
                    className="flex items-center px-3 py-1.5 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                >
                    <FiTrash2 className="mr-1" /> Delete
                </motion.button>
            </div>
        </motion.div>
    );
};
export default LoadCard;
