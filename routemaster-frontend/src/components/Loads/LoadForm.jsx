import { motion } from 'framer-motion';
import {  FiX,  } from 'react-icons/fi';
import {useEffect} from "react";
import {useFormik} from "formik";
import * as Yup from 'yup'
import {useDispatch} from "react-redux";
import {createLoad, updateLoad} from "../../features/loads/loadSlice.js";


const LoadForm = ({ isOpen, onClose, editingLoad }) => {
    const dispatch = useDispatch();

    const initialValues = {
        reference_id: '',
        company: '',
        broker_name: '',
        email: '',
        call_count: 0,
        rate: '',
        worked_with_us_before: false,
        from_location: '',
        to_location: '',
        total_pounds: '',
        pickup_places: '',
        delivery_places: '',
        pickup_count: 1,
        delivery_count: 1,
        total_distance: '',
        fcfs: false,
        type: '',
        comments: '',
        price_bought: '',
        price_sold: '',
        nationality: '',
        notes: '',
        rigz_id: ''
    };

    const formik = useFormik({
        initialValues,
        validationSchema: Yup.object({
            reference_id: Yup.string().required('Required'),
            broker_name: Yup.string().required('Required'),
            rate: Yup.number().required('Required')
        }),
        onSubmit: async (values) => {
            const data = {
                ...values,rigz_id: Number(values.rigz_id),
                pickup_places: values.pickup_places.split(',').map(p => p.trim()),
                delivery_places: values.delivery_places.split(',').map(p => p.trim())
            };
            console.log(data);

            if (editingLoad) {
                await dispatch(updateLoad({ id: editingLoad.id, loadData: data }));
            } else {
                await dispatch(createLoad(data));
            }
            onClose();
        },
        enableReinitialize: true
    });

    useEffect(() => {
        if (editingLoad) {
            formik.setValues({
                ...initialValues,
                ...editingLoad,
                pickup_places: editingLoad.pickup_places?.join(', ') || '',
                delivery_places: editingLoad.delivery_places?.join(', ') || ''
            });
        } else {
            formik.resetForm();
        }
    }, [editingLoad]);

    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center p-4"
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto w-full max-w-3xl"
            >
                <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
                    <h2 className="text-xl font-bold">
                        {editingLoad ? 'Edit Load' : 'Add New Load'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-full hover:bg-gray-100"
                    >
                        <FiX className="text-gray-500" />
                    </button>
                </div>

                <form onSubmit={formik.handleSubmit} className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.keys(initialValues).map((key) => (
                            <div key={key} className="mb-3">
                                <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                                    {key.replace(/_/g, ' ')}
                                </label>
                                {typeof initialValues[key] === 'boolean' ? (
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            name={key}
                                            checked={formik.values[key]}
                                            onChange={formik.handleChange}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        />
                                    </div>
                                ) : (
                                    <>
                                        <input
                                            type={key.includes('rate') || key.includes('price') ? 'number' : 'text'}
                                            name={key}
                                            value={formik.values[key]}
                                            onChange={formik.handleChange}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        />
                                        {formik.touched[key] && formik.errors[key] && (
                                            <p className="mt-1 text-sm text-red-600">{formik.errors[key]}</p>
                                        )}
                                    </>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 flex justify-end space-x-3">
                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Cancel
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            type="submit"
                            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            {editingLoad ? 'Update Load' : 'Create Load'}
                        </motion.button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
};

export default LoadForm