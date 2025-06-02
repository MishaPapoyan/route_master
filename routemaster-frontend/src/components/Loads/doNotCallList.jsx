import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FiAlertTriangle, FiTrash2 } from 'react-icons/fi';
import {removeDoNotCall} from "../../features/loads/doNotCallListSlice.js";

export default function DoNotCallList() {
    const dispatch = useDispatch();
    const companies = useSelector(state => state.doNotCall.companies || []);

    if (companies.length === 0) {
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
                Do Not Call List
            </div>
            <ul className="divide-y divide-gray-200">
                {companies.map((company, index) => (
                    <li key={index} className="py-2 flex justify-between items-center">
                        <span className="text-gray-800 font-medium">{company}</span>
                        <button
                            onClick={() => dispatch(removeDoNotCall(company))}
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
