export function getDriverCallCounts(drivers) {
    return [...drivers]
        .sort((a, b) => b.call_count - a.call_count)
        .map(d => ({ name: d.name, call_count: d.call_count }));
}

export function getActiveDaysPerRoute(drivers) {
    const result = {};

    drivers.forEach(driver => {
        const route = driver.main_route || "Unknown";
        const day = new Date(driver.createdAt).toISOString().split("T")[0];

        if (!result[route]) result[route] = {};
        if (!result[route][day]) result[route][day] = 0;

        result[route][day]++;
    });

    return result;
}

export function getAverageRatePerDriverPerRoute(drivers) {
    const map = {};

    drivers.forEach(driver => {
        const { name, main_route, average_rate } = driver;
        if (!name || !main_route || !average_rate) return;

        if (!map[name]) map[name] = {};
        if (!map[name][main_route]) map[name][main_route] = [];

        map[name][main_route].push(Number(average_rate));
    });

    const result = {};
    for (const name in map) {
        result[name] = {};
        for (const route in map[name]) {
            const values = map[name][route];
            const avg = values.reduce((a, b) => a + b, 0) / values.length;
            result[name][route] = +avg.toFixed(2);
        }
    }

    return result;
}

export function getDriverSummaryStats(drivers) {
    const coveredCount = drivers.filter(d => d.covered).length;
    const total = drivers.length;
    const weekdays = {};

    drivers.forEach(d => {
        const day = new Date(d.createdAt).toLocaleDateString('en-US', { weekday: 'long' });
        weekdays[day] = (weekdays[day] || 0) + 1;
    });

    return {
        totalDrivers: total,
        coveredDrivers: coveredCount,
        uncoveredDrivers: total - coveredCount,
        coverageRate: ((coveredCount / total) * 100).toFixed(1) + '%',
        busiestWeekday: Object.entries(weekdays).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A"
    };
}
