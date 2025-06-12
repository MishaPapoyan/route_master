import React, { useEffect } from 'react';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { createDriver, updateDriver, fetchDrivers } from '../../features/drivers/driverSlice.js';
import { AnimatePresence, motion } from 'framer-motion';

function DriverForm({ isOpen, setIsOpen, setEditingDriver, editingDriver }) {
    const dispatch = useDispatch();

    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : 'auto';
        return () => { document.body.style.overflow = 'auto'; };
    }, [isOpen]);

    const handleClose = () => {
        setIsOpen(false);
        setEditingDriver(null);
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
                            <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <Formik
                            enableReinitialize
                            initialValues={{
                                name: editingDriver?.name || '',
                                phone_number: editingDriver?.phone_number || '',
                                rigz_id: editingDriver?.rigz_id || '',
                                current_location: editingDriver?.current_location || '',
                                next_location: editingDriver?.next_location || '',
                                nationality: editingDriver?.nationality || '',
                                call_count: editingDriver?.call_count || 0,
                                max_weight_capacity: editingDriver?.max_weight_capacity || '',
                                average_rate: editingDriver?.average_rate || '',
                                preferred_routes: Array.isArray(editingDriver?.preferred_routes)
                                    ? editingDriver.preferred_routes.join(', ')
                                    : editingDriver?.preferred_routes || '',
                                type: editingDriver?.type || '',
                                notes: editingDriver?.notes || '',
                                team_or_solo: editingDriver?.team_or_solo || 'solo',
                                total_feet: editingDriver?.total_feet || 53,
                                is_from_rigz: editingDriver?.is_from_rigz ?? true,
                            }}
                            validationSchema={Yup.object({
                                name: Yup.string().required("Required"),
                                phone_number: Yup.string().required("Required"),
                                rigz_id: Yup.string().required("Required"),
                                max_weight_capacity: Yup.number().required("Required"),
                                team_or_solo: Yup.string().oneOf(['solo', 'team']).required('Required'),
                                total_feet: Yup.string().oneOf(['26', '53']).required('Required'),
                            })}
                            onSubmit={async (values, { setSubmitting }) => {
                                try {
                                    values.preferred_routes = Array.isArray(values.preferred_routes)
                                        ? values.preferred_routes
                                        : values.preferred_routes.split(',').map(r => r.trim()).filter(Boolean);

                                    if (editingDriver) {
                                        await dispatch(updateDriver({ id: editingDriver.id, ...values })).unwrap();
                                    } else {
                                        await dispatch(createDriver(values)).unwrap();
                                    }

                                    await dispatch(fetchDrivers()).unwrap();
                                    setIsOpen(false);
                                } catch (err) {
                                    console.error("❌ Error:", err);
                                    alert(err?.message || "Error saving driver");
                                } finally {
                                    setSubmitting(false);
                                }
                            }}
                        >
                            {({ isSubmitting }) => (
                                <Form className="p-6 space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        <Field name="name" placeholder="Driver Name *" className="w-full border rounded-lg px-4 py-3" />
                                        <Field name="phone_number" placeholder="Phone Number *" className="w-full border rounded-lg px-4 py-3" />
                                        <Field name="rigz_id" placeholder="Rigz ID *" className="w-full border rounded-lg px-4 py-3" />
                                        <Field name="current_location" placeholder="Current Location" className="w-full border rounded-lg px-4 py-3" />
                                        <Field name="next_location" placeholder="Next Location" className="w-full border rounded-lg px-4 py-3" />
                                        <Field name="nationality" placeholder="Nationality" className="w-full border rounded-lg px-4 py-3" />
                                        <Field name="call_count" type="number" placeholder="Call Count" className="w-full border rounded-lg px-4 py-3" />
                                        <Field name="max_weight_capacity" type="number" placeholder="Max Weight (lbs)" className="w-full border rounded-lg px-4 py-3" />
                                        <Field name="average_rate" type="number" placeholder="Avg Rate ($)" className="w-full border rounded-lg px-4 py-3" />
                                        <Field name="type" placeholder="Truck Type" className="w-full border rounded-lg px-4 py-3" />
                                        <Field name="preferred_routes" placeholder="Preferred Routes (comma separated)" className="w-full border rounded-lg px-4 py-3" />

                                        <div>
                                            <label className="text-sm font-medium text-gray-700">Team</label>
                                            <Field as="select" name="team_or_solo" className="mt-1 w-full rounded border p-2">
                                                <option value="solo">Solo</option>
                                                <option value="team">Team</option>
                                            </Field>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-gray-700">Total Feet</label>
                                            <Field as="select" name="total_feet" className="mt-1 w-full rounded border p-2">
                                                <option value="53">53</option>
                                                <option value="26">26</option>
                                            </Field>
                                        </div>
                                        <div className="mt-3">
                                            <label className="inline-flex items-center">
                                                <Field type="checkbox" name="is_from_rigz" className="mr-2" />
                                                <span className="text-sm text-gray-700">Driver is from Rigz</span>
                                            </label>
                                        </div>
                                    </div>

                                    <div>
                                        <Field as="textarea" name="notes" placeholder="Additional notes..." rows="3" className="w-full border rounded-lg px-4 py-3 resize-none" />
                                    </div>

                                    <div className="flex justify-end space-x-3 pt-4">
                                        <button type="button" onClick={handleClose} className="px-6 py-2.5 border rounded-lg text-gray-700 hover:bg-gray-50">
                                            Cancel
                                        </button>
                                        <button type="submit" disabled={isSubmitting} className="px-6 py-2.5 rounded-lg text-white font-medium shadow-md bg-blue-600 hover:bg-blue-700">
                                            {isSubmitting ? 'Processing...' : 'Save Driver'}
                                        </button>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default DriverForm;
