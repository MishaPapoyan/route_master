import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiPlus, FiEdit2, FiTrash2, FiX, FiTruck, FiDollarSign, FiMapPin, FiPackage, FiBriefcase } from 'react-icons/fi';
import { FaWeightHanging } from 'react-icons/fa';

// InfoRow Component
const InfoRow = ({ label, value, icon }) => {
    if (value == null || value === '') return null;

    const icons = {
        broker: <FiBriefcase className="text-blue-500" />,
        rate: <FiDollarSign className="text-green-500" />,
        from: <FiMapPin className="text-orange-500" />,
        to: <FiMapPin className="text-purple-500" />,
        weight: <FaWeightHanging className="text-amber-500" />,
        company: <FiBriefcase className="text-indigo-500" />,
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start text-sm text-gray-600 mb-2"
        >
            <span className="mr-2 mt-0.5">{icons[icon] || <FiPackage className="text-gray-400" />}</span>
            <div>
                <span className="font-medium text-gray-700">{label}:</span> {value}
            </div>
        </motion.div>
    );
};

export default InfoRow