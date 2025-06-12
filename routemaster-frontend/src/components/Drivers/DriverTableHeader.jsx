import React from 'react';

export default function DriverTableHeader({ sortKey, sortDirection, onSort }) {
    const headers = [
        'name',
        'phone_number',
        'current_location',
        'next_location',
        'call_count',
        'rigz_id',
        'max_weight_capacity',
        'average_rate',
        'preferred_routes',
        'type', // ✅ ADD THIS
        'total_feet',
        'nationality',
        'createdAt',
        'notes',
        'status',
    ];


    const getDisplayName = (key) => {
        const map = {
            name: 'Name',
            type: 'type',
            total_feet: 'total_feet',
            phone_number: 'Phone',
            current_location: 'Current Location',
            next_location: 'Next Location',
            call_count: 'Call Count',
            rigz_id: 'Rigz ID',
            max_weight_capacity: 'Max Weight',
            average_rate: 'Avg Rate',
            preferred_routes: 'Preferred Routes',
            nationality: 'Nationality',
            createdAt: 'Date',
            notes: 'Notes',
            status: 'Status',
        };
        return map[key] || key;
    };

    const getArrow = (key) => {
        if (sortKey !== key) return '';
        return sortDirection === 'asc' ? '⬆️' : '⬇️';
    };

    return (
        <thead>
        <tr>
            {headers.map((header) => (
                <th
                    key={header}
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-blue-700"
                    onClick={() => onSort(header)}
                >
                    {getDisplayName(header)} {getArrow(header)}
                </th>
            ))}
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
            </th>
        </tr>
        </thead>
    );
}
