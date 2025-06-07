import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FiAlertTriangle, FiTrash2 } from 'react-icons/fi';
import { deleteDoNotCall } from '../../features/loads/doNotCallListSlice.js';

export default function DoNotCallList() {
    const dispatch = useDispatch();
    const companies = useSelector(state => state.doNotCall.companies || []);

    if (!companies.length) {
        return (
            <div className="bg-green-50 p-4 rounded-lg text-green-700 text-center border border-green-200">
                ✅ You're working with all companies. No entries in Do Not Call List.
            </div>
        );
    }

    return (
        <div className="bg-white shadow-md rounded-xl p-6 border border-red-100 space-y-4">
            <div className="flex items-center gap-2 text-red-600 text-lg font-semibold">
                <FiAlertTriangle className="text-2xl" />
                Do Not Call List ( {companies.length} )
            </div>

            <ul className="divide-y divide-gray-200">
                {companies.map((entry, index) => (
                    <li key={index} className="py-2 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                        <div>
                            <span className="text-gray-800 font-medium">{entry.company_name}</span>
                            <span className="ml-2 text-gray-500 text-sm">({entry.broker_name})</span>
                            {entry.added_from === 'manual' && (
                                <span className="ml-2 text-xs text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
                                    manual
                                </span>
                            )}
                        </div>
                        <button
                            onClick={() => dispatch(deleteDoNotCall(entry.id))}
                            className="text-red-500 hover:text-red-700 flex items-center gap-1"
                        >
                            <FiTrash2 /> Remove
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
