import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchContactedLoads,
    createContactedLoad,
    updateContactedLoad,
    deleteContactedLoad,
    updateContactedLoadClick
} from '../../features/loads/contactedLoadsSlice';
import { FiSearch, FiRefreshCw, FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import Header from '../HomePage/Header';
import { Formik, Form, Field } from 'formik';
import DoNotCallList from './doNotCallList.jsx';
import { addDoNotCall } from '../../features/loads/doNotCallListSlice';

export default function ContactedLoadsTable() {
    const dispatch = useDispatch();
    const { list: loads = [], loading, error } = useSelector(
        (state) => state.contactedLoads || {}
    );

    const [searchQuery, setSearchQuery] = useState('');
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingLoad, setEditingLoad] = useState(null);

    useEffect(() => {
        const load = async () => {
            setIsRefreshing(true);
            await dispatch(fetchContactedLoads());
            setIsRefreshing(false);
        };
        load();
    }, [dispatch]);

    const filtered = loads.filter((load) =>
        [
            'from_location',
            'to_location',
            'company',
            'broker',
            'contact_method',
            'notes',
            'worked_with_us_before',
        ].some((key) =>
            String(load[key] || '')
                .toLowerCase()
                .includes(searchQuery.toLowerCase())
        )
    );

    const handleSubmit = async (values) => {
        const payload = {
            ...values,
            contacted: true,
            contactedAt: new Date()
        };

        try {
            if (editingLoad) {
                await dispatch(updateContactedLoad({ id: editingLoad.id, loadData: payload })).unwrap();
            } else {
                await dispatch(createContactedLoad(payload)).unwrap();
            }

            if (payload.worked_with_us_before === 'no') {
                dispatch(addDoNotCall({ company: payload.company }));
            }

            await dispatch(fetchContactedLoads());
            setIsFormOpen(false);
            setEditingLoad(null);
        } catch (err) {
            console.error('❌ Failed to submit contacted load:', err);
        }
    };

    const totalCalls = loads.filter(l => l.contact_method === 'call').length;
    const totalEmails = loads.filter(l => l.contact_method === 'email').length;

    return (
        <div className="p-4 md:p-6">
            <Header />

            {loading && !isRefreshing && (
                <div className="fixed inset-0 w-full bg-white/50 z-50 flex items-center justify-center">
                    <FiRefreshCw size={32} className="text-blue-600 animate-spin" />
                </div>
            )}

            {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
                    <p>Error: {error}</p>
                </div>
            )}

            <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
                <div className="flex flex-wrap justify-between items-center p-4 gap-4 border-b">
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        📞 Contacted Loads
                    </h2>

                    <div className="flex flex-wrap gap-3 w-full md:w-auto">
                        <div className="relative flex-1 max-w-md">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FiSearch className="text-gray-400" />
                            </div>
                            <input
                                type="search"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search contacted loads..."
                                className="pl-10 w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <button
                            onClick={() => {
                                setIsFormOpen(true);
                                setEditingLoad(null);
                            }}
                            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow"
                        >
                            <FiPlus size={18} /> Add Contacted Load
                        </button>
                    </div>
                </div>

                {isFormOpen && (
                    <div className="px-6 py-4">
                        <Formik
                            initialValues={{
                                from_location: editingLoad?.from_location || '',
                                to_location: editingLoad?.to_location || '',
                                weight: editingLoad?.weight || '',
                                rate: editingLoad?.rate || '',
                                contact_method: editingLoad?.contact_method || 'call',
                                notes: editingLoad?.notes || '',
                                company: editingLoad?.company || 'N/A',
                                reference_id: editingLoad?.reference_id || '',
                                worked_with_us_before: editingLoad?.worked_with_us_before || 'no',
                            }}
                            enableReinitialize
                            onSubmit={handleSubmit}
                        >
                            <Form className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Field name="from_location" placeholder="Origin" className="border px-3 py-2 rounded" />
                                <Field name="to_location" placeholder="Destination" className="border px-3 py-2 rounded" />
                                <Field name="company" placeholder="Company" className="border px-3 py-2 rounded" />
                                <Field name="weight" placeholder="Weight (lbs)" className="border px-3 py-2 rounded" />
                                <Field name="rate" placeholder="Rate ($)" className="border px-3 py-2 rounded" />
                                <Field name="reference_id" placeholder="Reference ID" className="border px-3 py-2 rounded" />
                                <Field as="select" name="contact_method" className="border px-3 py-2 rounded">
                                    <option value="call">Call</option>
                                    <option value="email">Email</option>
                                </Field>
                                <Field as="select" name="worked_with_us_before" className="border px-3 py-2 rounded">
                                    <option value="yes">Yes</option>
                                    <option value="no">No</option>
                                </Field>
                                <Field
                                    name="notes"
                                    placeholder="Notes"
                                    className="border px-3 py-2 rounded col-span-2 md:col-span-3"
                                />
                                <div className="flex gap-3 col-span-2 md:col-span-3">
                                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                                        {editingLoad ? 'Update' : 'Save'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsFormOpen(false);
                                            setEditingLoad(null);
                                        }}
                                        className="bg-gray-300 px-4 py-2 rounded"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </Form>
                        </Formik>
                    </div>
                )}

                <div className="px-6 py-4">
                    <DoNotCallList />
                </div>

                {/* 📊 Contact Method Totals */}
                <div className="px-6 pt-2 pb-4 text-sm text-gray-700 flex gap-6">
                    <span>📦 Total Contacted: <strong>{loads.length}</strong></span>
                    <span>📞 Calls: <strong>{totalCalls}</strong></span>
                    <span>📧 Emails: <strong>{totalEmails}</strong></span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3">Origin → Destination</th>
                            <th className="px-4 py-3">Company</th>
                            <th className="px-4 py-3">Weight</th>
                            <th className="px-4 py-3">Rate</th>
                            <th className="px-4 py-3">Ref ID</th>
                            <th className="px-4 py-3">Contacted</th>
                            <th className="px-4 py-3">Method</th>
                            <th className="px-4 py-3">Notes</th>
                            <th className="px-4 py-3">Worked With Us</th>
                            <th className="px-4 py-3">Actions</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y">
                        {filtered.map((load) => (
                            <tr key={load.id} className="hover:bg-gray-50">
                                <td className="px-4 py-2">{load.from_location} → {load.to_location}</td>
                                <td className="px-4 py-2">{load.company}</td>
                                <td className="px-4 py-2">{load.weight} lbs</td>
                                <td className="px-4 py-2">${load.rate}</td>
                                <td className="px-4 py-2">{load.reference_id || '—'}</td>
                                <td className="px-4 py-2">{new Date(load.contactedAt).toLocaleDateString()}</td>
                                <td className="px-4 py-2 capitalize">{load.contact_method}</td>
                                <td className="px-4 py-2">{load.notes}</td>
                                <td className="px-4 py-2">{load.worked_with_us_before === 'yes' ? 'Yes' : 'No'}</td>
                                <td className="px-4 py-2 flex gap-2 flex-wrap">
                                    <button
                                        onClick={() => {
                                            setEditingLoad(load);
                                            setIsFormOpen(true);
                                        }}
                                        className="text-blue-600 hover:underline flex items-center gap-1"
                                    >
                                        <FiEdit2 /> Edit
                                    </button>
                                    <button
                                        onClick={() => dispatch(deleteContactedLoad(load.id))}
                                        className="text-red-600 hover:underline flex items-center gap-1"
                                    >
                                        <FiTrash2 /> Delete
                                    </button>
                                    <button
                                        onClick={() => dispatch(updateContactedLoadClick({ id: load.id, type: 'didnt_connect', change: 1 }))}
                                        onDoubleClick={() => dispatch(updateContactedLoadClick({ id: load.id, type: 'didnt_connect', change: -1 }))}
                                        className="bg-red-500 text-white px-2 py-1 rounded"
                                    >
                                        DC ({load.didnt_connect_count || 0})
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {!isRefreshing && filtered.length === 0 && (
                            <tr>
                                <td colSpan="10" className="text-center py-6 text-gray-400">
                                    No contacted loads found.
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
