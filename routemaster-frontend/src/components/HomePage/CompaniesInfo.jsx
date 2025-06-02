import React from 'react';
import { motion } from 'framer-motion';

function CompaniesInfo({ data, title, primaryColor }) {
    // Animation variants
    const cardVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 10
            }
        }
    };

    const itemVariants = {
        hidden: { x: -10, opacity: 0 },
        visible: {
            x: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 120
            }
        }
    };

    // Determine colors based on primaryColor prop
    const bgGradientFrom = primaryColor === 'blue' ? 'from-blue-50' : 'from-indigo-50';
    const bgGradientTo = primaryColor === 'blue' ? 'to-indigo-50' : 'to-blue-50';
    const borderColor = primaryColor === 'blue' ? 'border-blue-100' : 'border-indigo-100';
    const iconBgColor = primaryColor === 'blue' ? 'bg-blue-100' : 'bg-indigo-100';
    const iconTextColor = primaryColor === 'blue' ? 'text-blue-600' : 'text-indigo-600';
    const titleColor = primaryColor === 'blue' ? 'text-blue-800' : 'text-indigo-800';
    const mcDotPotColor = primaryColor === 'blue' ? 'text-blue-600' : 'text-indigo-600';


    return (
        <motion.div
            className={`w-full ${bgGradientFrom} ${bgGradientTo} p-6 rounded-xl shadow-lg border ${borderColor}`}
            variants={cardVariants}
            whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
        >
            <motion.div className="flex items-center mb-4" variants={itemVariants}>
                <motion.div
                    className={`${iconBgColor} p-3 rounded-full mr-4`}
                    whileHover={{ rotate: 10 }}
                >
                    {/* SVG Icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 ${iconTextColor}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 0 011-1h2a1 0 011 1v5m-4 0h4" />
                    </svg>
                </motion.div>
                <h3 className={`text-xl font-bold ${titleColor}`}>{title}</h3>
            </motion.div>

            <div className="space-y-4">
                <motion.div
                    className="bg-white p-4 rounded-lg shadow-sm"
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                >
                    <p className="text-sm font-medium text-gray-500">Company Name</p>
                    <p className="text-lg font-semibold text-gray-800">{data.companyName}</p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> {/* Changed to 1 column on small, 2 on medium+ */}
                    <motion.div
                        className="bg-white p-4 rounded-lg shadow-sm"
                        variants={itemVariants}
                        whileHover={{ scale: 1.02 }}
                    >
                        <p className="text-sm font-medium text-gray-500">MC Number</p>
                        <p className={`text-lg font-semibold ${mcDotPotColor}`}>{data.mc}</p>
                    </motion.div>

                    <motion.div
                        className="bg-white p-4 rounded-lg shadow-sm"
                        variants={itemVariants}
                        whileHover={{ scale: 1.02 }}
                    >
                        <p className="text-sm font-medium text-gray-500">DOT Number</p>
                        <p className={`text-lg font-semibold ${mcDotPotColor}`}>{data.dot}</p>
                    </motion.div>
                </div>

                <motion.div
                    className="bg-white p-4 rounded-lg shadow-sm"
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                >
                    <p className="text-sm font-medium text-gray-500">POT Number</p>
                    <p className={`text-lg font-semibold ${mcDotPotColor}`}>{data.POT}</p>
                </motion.div>
            </div>
        </motion.div>
    );
}

export default CompaniesInfo;