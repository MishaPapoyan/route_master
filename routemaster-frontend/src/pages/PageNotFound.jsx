import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

function PageNotFound() {
    const navigate = useNavigate();

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="min-h-screen bg-gray-100 flex items-center justify-center p-4"
        >
            <div className="text-center">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
                    className="text-8xl md:text-9xl font-bold text-blue-600"
                >
                    404
                </motion.div>
                <h1 className="mt-4 text-2xl md:text-3xl font-semibold text-gray-800">
                    Page Not Found
                </h1>
                <p className="mt-2 text-gray-600 max-w-md mx-auto">
                    Oops! The page you're looking for doesn't exist or has been moved.
                </p>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/')}
                    className="mt-6 inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 transition-colors"
                >
                    Back to Home
                </motion.button>
            </div>
        </motion.div>
    );
}

export default PageNotFound;