import React, { useEffect } from 'react'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import { useDispatch } from 'react-redux'
import { createDriver, updateDriver } from '../../features/drivers/driverSlice.js'
import {  AnimatePresence } from 'framer-motion'
import { motion } from 'framer-motion';
import { fetchDrivers } from '../../features/drivers/driverSlice.js';

function DriverForm({ isOpen, setIsOpen, setEditingDriver, editingDriver }) {
    const dispatch = useDispatch()

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'auto'
        }
        return () => {
            document.body.style.overflow = 'auto'
        }
    }, [isOpen])

    const handleClose = () => {
        setIsOpen(false)
        setEditingDriver(null)
    }

    const handleSubmit = async (values) => {
        try {
            setIsSubmitting(true);
            if (editingDriver) {
                await dispatch(updateDriver({ id: editingDriver.id, ...values }));
            } else {
                await dispatch(createDriver(values));
            }
            dispatch(fetchDrivers());
            setIsOpen(false);
        } catch (err) {
            console.error("❌ Error submitting driver:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4"
                >
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        transition={{ type: 'spring', damping: 25 }}
                        className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
                    >
                        <div className="sticky top-0 bg-white z-10 border-b border-gray-100 p-6 flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-gray-800">
                                {editingDriver ? "Edit Driver" : "Add New Driver"}
                            </h2>
                            <button
                                onClick={handleClose}
                                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <Formik
                            enableReinitialize
                            initialValues={{
                                name: editingDriver?.name || "",
                                phone_number: editingDriver?.phone_number || "",
                                rigz_id: editingDriver?.rigz_id || "",
                                current_location: editingDriver?.current_location || "",
                                next_location: editingDriver?.next_location || "",
                                nationality: editingDriver?.nationality || "",
                                call_count: editingDriver?.call_count || "",
                                max_weight_capacity: editingDriver?.max_weight_capacity || "",
                                average_rate: editingDriver?.average_rate || "",
                                preferred_routes: editingDriver?.preferred_routes?.join(', ') || "",
                                type: editingDriver?.type || "",
                                notes: editingDriver?.notes || ""
                            }}
                            validationSchema={Yup.object({
                                name: Yup.string().required("Required"),
                                phone_number: Yup.string().required("Required"),
                                rigz_id: Yup.string().required("Required")
                            })}
                            onSubmit={async (values, { setSubmitting }) => {
                                console.log(values);
                                try {
                                    if (editingDriver) {
                                        console.log(editingDriver.id);
                                        const res = await dispatch(updateDriver({ id: editingDriver.id, ...values }));
                                        console.log(res)
                                    } else {
                                        await dispatch(createDriver(values));
                                    }
                                    dispatch(fetchDrivers());
                                    setIsOpen(false);
                                } catch (err) {
                                    console.error("❌ Error:", err);
                                } finally {
                                    setSubmitting(false);
                                }
                            }}                        >
                            {({ isSubmitting, errors, touched }) => (
                                <Form className="p-6 space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        <div>
                                            <Field
                                                name="name"
                                                placeholder="Driver Name *"
                                                className={`w-full border ${errors.name && touched.name ? 'border-red-300' : 'border-gray-200'} rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                                            />
                                            {errors.name && touched.name && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: -5 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="text-red-500 text-xs mt-1"
                                                >
                                                    {errors.name}
                                                </motion.div>
                                            )}
                                        </div>

                                        <div>
                                            <Field
                                                name="phone_number"
                                                placeholder="Phone Number *"
                                                className={`w-full border ${errors.phone_number && touched.phone_number ? 'border-red-300' : 'border-gray-200'} rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                                            />
                                            {errors.phone_number && touched.phone_number && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: -5 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="text-red-500 text-xs mt-1"
                                                >
                                                    {errors.phone_number}
                                                </motion.div>
                                            )}
                                        </div>

                                        <div>
                                            <Field
                                                name="rigz_id"
                                                placeholder="Rigz ID *"
                                                className={`w-full border ${errors.rigz_id && touched.rigz_id ? 'border-red-300' : 'border-gray-200'} rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                                            />
                                            {errors.rigz_id && touched.rigz_id && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: -5 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="text-red-500 text-xs mt-1"
                                                >
                                                    {errors.rigz_id}
                                                </motion.div>
                                            )}
                                        </div>

                                        <Field
                                            name="current_location"
                                            placeholder="Current Location"
                                            className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        />
                                        <Field
                                            name="next_location"
                                            placeholder="Next Location"
                                            className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        />
                                        <Field
                                            name="nationality"
                                            placeholder="Nationality"
                                            className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        />
                                        <Field
                                            name="call_count"
                                            placeholder="Call Count"
                                            type="number"
                                            className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        />
                                        <Field
                                            name="max_weight_capacity"
                                            placeholder="Max Weight (lbs)"
                                            type="number"
                                            className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        />
                                        <Field
                                            name="average_rate"
                                            placeholder="Avg Rate ($)"
                                            type="number"
                                            className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        />
                                        <Field
                                            name="type"
                                            placeholder="Truck Type (van, dry, VR)"
                                            className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        />
                                        <div className="md:col-span-2">
                                            <Field
                                                name="preferred_routes"
                                                placeholder="Preferred Routes (comma separated)"
                                                className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <Field
                                            as="textarea"
                                            name="notes"
                                            placeholder="Additional notes about the driver..."
                                            rows="3"
                                            className="w-full border border-gray-200 rounded-lg px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        />
                                    </div>

                                    <div className="flex justify-end space-x-3 pt-4">
                                        <button
                                            type="button"
                                            onClick={handleClose}
                                            className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className={`px-6 py-2.5 rounded-lg text-white font-medium transition-all ${isSubmitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} shadow-md hover:shadow-lg`}
                                        >
                                            {isSubmitting ? (
                                                <span className="flex items-center justify-center">
                                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Processing...
                                                </span>
                                            ) : (
                                                <span>Save Driver</span>
                                            )}
                                        </button>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default DriverForm