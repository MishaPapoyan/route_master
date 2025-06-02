export default function DriverTableHeader({ setSortConfig, sortConfig }) {
    const handleSort = (key) => {
        setSortConfig(prev => ({
            key,
            direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    const renderHeader = (label, key, alignRight = false) => (
        <th
            onClick={() => handleSort(key)}
            className={`py-4 px-4 text-sm font-medium text-gray-700 cursor-pointer hover:underline ${alignRight ? 'text-right' : 'text-left'}`}
        >
            {label} {sortConfig.key === key ? (sortConfig.direction === 'asc' ? '⬆️' : '⬇️') : ''}
        </th>
    );

    return (
        <thead className="bg-gray-100">
        <tr>
            {renderHeader("Name", "name")}
            {renderHeader("Phone", "phone_number")}
            {renderHeader("Current Location", "current_location")}
            {renderHeader("Next Location", "next_location")}
            {renderHeader("Call Count", "call_count")}
            {renderHeader("Rigz ID", "rigz_id")}
            {renderHeader("Max Weight", "max_weight_capacity")}
            {renderHeader("Avg Rate", "average_rate")}
            {renderHeader("Preferred Routes", "preferred_routes")}
            {renderHeader("Nationality", "nationality")}
            {renderHeader("Date", "createdAt")}
            {renderHeader("Time", "createdAt")}
            {renderHeader("Notes", "notes")}
            {renderHeader("Status", "status", true)}
            {renderHeader("Actions", "actions", true)}
        </tr>
        </thead>
    );
}
