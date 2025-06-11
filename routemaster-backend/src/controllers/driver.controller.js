import { Sequelize } from 'sequelize';
import db from '../models/index.js';
const Driver = db.Driver;

export const getAllDrivers = async (req, res) => {
    try {
        const drivers = await Driver.findAll({ raw: true });
        console.log("📦 DRIVERS FROM DB:", drivers);  // Add this
        res.status(200).json(drivers);
    } catch (err) {
        console.error('❌ Error fetching Drivers:', err);
        res.status(500).json({
            message: 'Server error while fetching Drivers',
            error: err.message,
        });
    }
};

export const createDriver = async (req, res) => {
    try {
        const today = new Date('2025-06-09T15:05:00+04:00').toISOString().split('T')[0]; // Current date
        const { phone_number, rigz_id } = req.body;

        const existing = await Driver.findOne({
            where: {
                phone_number,
                created_date: today,
            },
        });

        if (existing) {
            return res.status(400).json({ message: 'Driver already added today.' });
        }

        const newDriver = await Driver.create({
            ...req.body,
            created_date: today,
        });

        res.status(201).json(newDriver);
    } catch (err) {
        console.error('❌ Error creating driver:', err);
        res.status(500).json({ message: 'Server error while creating driver', error: err.message });
    }
};

export const updateDriver = async (req, res) => {
    const { id } = req.params;
    let updates = req.body;

    if (!updates) {
        return res.status(400).json({ message: 'No update data provided' });
    }

    if (updates.preferred_routes !== undefined) {
        if (typeof updates.preferred_routes === 'string') {
            updates.preferred_routes = updates.preferred_routes
                .split(',')
                .map(route => route.trim())
                .filter(route => route.length > 0);
        } else if (!Array.isArray(updates.preferred_routes)) {
            updates.preferred_routes = [];
        }
    }

    try {
        const driver = await Driver.findByPk(id);
        if (!driver) return res.status(404).json({ message: 'Driver not found' });

        await driver.update(updates);
        const updatedDriver = await Driver.findByPk(id);
        res.status(200).json(updatedDriver);
    } catch (err) {
        console.error('❌ Error updating driver:', err);
        res.status(500).json({ message: 'Error updating driver', error: err.message });
    }
};

export const deleteDriver = async (req, res) => {
    const driverId = req.params.id;
    try {
        const driver = await Driver.findByPk(driverId);
        if (!driver) {
            return res.status(404).json({ message: 'Driver not found' });
        }
        await driver.destroy();
        res.status(200).json({ message: 'Driver deleted successfully', driver });
    } catch (err) {
        console.error('❌ Error deleting driver:', err);
        res.status(500).json({ message: 'Server error while deleting driver' });
    }
};

export const updateCallStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { type, change = 1 } = req.body;

        const driver = await Driver.findByPk(id);
        if (!driver) {
            return res.status(404).json({ message: 'Driver not found' });
        }

        switch (type) {
            case 'call':
                driver.call_count = (driver.call_count || 0) + change;
                break;
            case 'connect':
                driver.connect_count = (driver.connect_count || 0) + change;
                driver.status = 'connect';
                break;
            case 'didnt_connect':
                driver.didnt_connect_count = (driver.didnt_connect_count || 0) + change;
                driver.status = "didn't connect";
                break;
            default:
                return res.status(400).json({ message: 'Invalid update type' });
        }

        await driver.save();
        const updatedDriver = await Driver.findByPk(id);
        res.status(200).json(updatedDriver);
    } catch (err) {
        console.error('❌ Error updating driver interaction:', err);
        res.status(500).json({ message: 'Server error while updating call status' });
    }
};