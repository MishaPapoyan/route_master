import React from 'react';

const DriverTableHeader = () => {
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
        'nationality',
        'createdAt',
        'createdAt',
        'notes',
        'status',
    ];

    const getDisplayName = (key) => {
        const map = {
            name: 'Name',
            phone_number: 'Phone',
            current_location: 'Current Location',
            next_location: 'Next Location',
            call_count: 'Call Count',
            rigz_id: 'Rigz ID',
            max_weight_capacity: 'Max Weight',
            average_rate: 'Avg Rate',
            preferred_routes: 'Preferred Routes',
            nationality: 'Nationality',
            createdAt: 'Date', // Used for both Date and Time
            notes: 'Notes',
            status: 'Status',
        };
        return map[key] || key;
    };

    return (
        <thead>
        <tr>
            {headers.map((header, index) => (
                <th
                    key={index}
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                    {getDisplayName(header)}
                </th>
            ))}
        </tr>
        </thead>
    );
};

export default DriverTableHeader;