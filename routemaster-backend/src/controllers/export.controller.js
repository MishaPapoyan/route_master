import db from '../models/index.js';
import { Parser } from 'json2csv';

export const exportDriversCSV = async (req, res) => {
    try {
        const drivers = await db.Driver.findAll({ raw: true });

        const parser = new Parser();
        const csv = parser.parse(drivers);

        res.header('Content-Type', 'text/csv');
        res.attachment('Drivers.csv');
        res.send(csv);
    } catch (err) {
        console.error('❌ Error exporting Drivers:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const exportLoadsCSV = async (req, res) => {
    try {
        const loads = await db.Load.findAll({ raw: true });

        const parser = new Parser();
        const csv = parser.parse(loads);

        res.header('Content-Type', 'text/csv');
        res.attachment('loads.csv');
        res.send(csv);
    } catch (err) {
        console.error('❌ Error exporting loads:', err);
        res.status(500).json({ message: 'Server error' });
    }
};
