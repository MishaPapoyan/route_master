import db from '../models/index.js';
import {Op} from "sequelize";

export const findDriversForLoad = async (req, res) => {
    const { loadId } = req.params;
    try {
        const load = await db.Load.findByPk(loadId);
        if (!load) return res.status(404).json({ message: 'Load not found' });
        const matchingDrivers = await db.Driver.findAll({
            where: {
                current_location: load.from_location,
                next_location: load.to_location,
                call_count: {
                    [db.Sequelize.Op.lte]: 3
                }
            }
        })
        res.status(200).json(matchingDrivers);
    } catch (err) {
        console.error('❌ Error finding matches:', err);
        res.status(500).json({ message: 'Server error' });
    }
}

export const findLoadsForDriver = async (req, res) => {
    const { driverId } = req.params;

    try {
        const driver = await db.Driver.findByPk(driverId);
        if (!driver) return res.status(404).json({ message: 'Driver not found' });

        const matchingLoads = await db.Driver.findAll({
            where: {
                from_location: driver.current_location,
                to_location: driver.next_location,
                status: 'open', // only show open loads
                rate: {
                    [Op.gte]: 1000 // optional: minimum rate (can be removed or customized)
                }
            }
        })
        res.status(200).json(matchingLoads);
    } catch (err) {
        console.error('❌ Error finding loads for driver:', err);
        res.status(500).json({ message: 'Server error' });
    }
};