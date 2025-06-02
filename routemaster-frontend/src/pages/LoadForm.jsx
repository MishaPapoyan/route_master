import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { createLoad, updateLoad } from '../../features/loads/loadSlice';

export default function LoadForm({ isOpen, setIsOpen, editingLoad, setEditingLoad }) {
    const dispatch = useDispatch();

    if (!isOpen) return null;

    const initialValues = editingLoad || {
        reference_id: '',
        company: '',
        broker_name: '',
        email: '',
        call_count: 1,
        rate: '',
        worked_with_us_before: false,
        from_location: '',
        to_location: '',
        total_pounds: '',
        pickup_places: [],
        delivery_places: [],
        pickup_time: '',
        delivery_time: '',
        pickup_count: 1,
        delivery_count: 1,
        total_distance: '',
        fcfs: false,
        type: 'Van',
        comments: '',
        price_bought: '',
        price_sold: '',
        notes: '',
        rigz_id: '',
    };

    const validationSchema = Yup.object({
        from_location: Yup.string().required('From is required'),
        to_location: Yup.string().required('To is required'),
        rate: Yup.number().required('Rate is required'),
        price_bought: Yup.number().required('Price bought is required'),
        price_sold: Yup.number().required('Price sold is required'),
        rigz_id: Yup.string().required('Rigz ID is required'),
    });

    const handleSubmit = async (values) => {
        const cleanValues = {
            ...values,
            rigz_id: String(values.rigz_id),
            call_count: Number(values.call_count) || 1,
            rate: Number(values.rate),
            price_bought: Number(values.price_bought),
            price_sold: Number(values.price_sold),
            total_pounds: Number(values.total_pounds) || 0,
            pickup_count: Number(values.pickup_count),
            delivery_count: Number(values.delivery_count),
            total_distance: Number(values.total_distance) || 0,
            pickup_places: Array.isArray(values.pickup_places) ? values.pickup_places : [values.from_location],
            delivery_places: Array.isArray(values.delivery_places) ? values.delivery_places : [values.to_location],
        };

        if (editingLoad) {
            await dispatch(updateLoad({ id: editingLoad.id, loadData: cleanValues }));
        } else {
            await dispatch(createLoad(cleanValues));
        }

        setIsOpen(false);
        setEditingLoad(null);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">{editingLoad ? 'Edit Load' : 'Add New Load'}</h2>

                <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                    <Form className="space-y-4">
                        <FieldGroup label="Rigz ID" name="rigz_id" />
                        <FieldGroup label="Reference ID" name="reference_id" />
                        <FieldGroup label="Company" name="company" />
                        <FieldGroup label="Broker Name" name="broker_name" />
                        <FieldGroup label="Email" name="email" />
                        <FieldGroup label="Rate ($)" name="rate" type="number" />
                        <FieldGroup label="Price Bought ($)" name="price_bought" type="number" />
                        <FieldGroup label="Price Sold ($)" name="price_sold" type="number" />
                        <FieldGroup label="From Location" name="from_location" />
                        <FieldGroup label="To Location" name="to_location" />
                        <FieldGroup label="Total Pounds" name="total_pounds" type="number" />
                        <FieldGroup label="Total Distance (miles)" name="total_distance" type="number" />
                        <FieldGroup label="Pickup Time" name="pickup_time" />
                        <FieldGroup label="Delivery Time" name="delivery_time" />
                        <FieldGroup label="Notes" name="notes" as="textarea" />
                        <div>
                            <label className="block font-medium">Load Type</label>
                            <Field as="select" name="type" className="input">
                                <option value="Van">Van</option>
                                <option value="Dry">Dry</option>
                                <option value="Reefer">Reefer</option>
                                <option value="Van or Reefer">Van or Reefer</option>
                            </Field>
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsOpen(false);
                                    setEditingLoad(null);
                                }}
                                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                {editingLoad ? 'Update' : 'Create'}
                            </button>
                        </div>
                    </Form>
                </Formik>
            </div>
        </div>
    );
}

function FieldGroup({ label, name, type = 'text', as = 'input' }) {
    return (
        <div>
            <label className="block font-medium">{label}</label>
            <Field name={name} type={type} as={as} className="input w-full border px-3 py-2 rounded-md" />
            <ErrorMessage name={name} component="div" className="text-red-500 text-sm" />
        </div>
    );
}
