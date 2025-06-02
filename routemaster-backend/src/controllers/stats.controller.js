import db from '../models/index.js';
import {Op, Sequelize} from 'sequelize';

export const getWeeklySummary = async (req, res) => {
    const oneWeekAgo  = new Date;
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    try {
        const totalLoads = await db.Load.count({
            where: {
                createdAt: { [Op.gte]: oneWeekAgo }
            }
        });
        const totalCalls = await db.Driver.sum('call_count', {
            where: {
                updatedAt: { [Op.gte]: oneWeekAgo }
            }
        });
        const assignedLoads = await db.Load.count({
            where: {
                status: 'assigned',
                updatedAt: { [Op.gte]: oneWeekAgo }
            }
        });
        const successRate = totalCalls > 0 ? (assignedLoads / totalCalls).toFixed(2) : "0.00";
        res.status(200).json({
            totalLoads,
            totalCalls,
            assignedLoads,
            successRate: parseFloat(successRate)
        });
    } catch (err) {
        console.error('❌ Error generating summary:', err);
        res.status(500).json({ message: 'Server error' });
    }
}
export const getTopBrokers = async (req, res) => {
    try {
        const topBrokers = await db.Load.findAll({
            attributes: [
                'broker_name',
                [Sequelize.fn("COUNT", Sequelize.col('broker_name')), 'load_count'],
            ],
            group: ['broker_name'],
            order: [[Sequelize.literal('load_count'), "DESC"]],
            limit: 5
        });
        res.status(200).json(topBrokers);
    } catch (err) {
        console.error('❌ Error fetching top brokers:', err);
        res.status(500).json({ message: 'Server error' });
    }
}

export const getAverageRate = async (req, res) => {
    const { from, to } = req.query;

    if (!from || !to) {
        return res.status(400).json({ message: 'Missing from or to query params' });
    }

    try {
        const result = await db.Load.findOne({
            attributes: [[db.Sequelize.fn('AVG', db.Sequelize.col('rate')), 'average_rate']],
            where: {
                from_location: from,
                to_location: to,
            },
            raw: true
        });

        const avgRate = parseFloat(result?.average_rate || 0).toFixed(2);

        res.status(200).json({
            route: `${from} → ${to}`,
            averageRate: avgRate
        });
    } catch (err) {
        console.error('❌ Error fetching average rate:', err);
        res.status(500).json({ message: 'Server error' });
    }
};
