import db from '../models/index.js';

const { DoNotCallList } = db; // ✅ Access from default export

export const getAllDNC = async (req, res) => {
    try {
        const list = await DoNotCallList.findAll();
        res.status(200).json(list);
    } catch (err) {
        console.error('❌ Failed to fetch DNC list:', err);
        res.status(500).json({ message: 'Server error fetching Do Not Call list' });
    }
};

export const addDNC = async (req, res) => {
    try {
        const { company_name, broker_name, added_from = 'auto' } = req.body;

        if (!company_name || !broker_name) {
            return res.status(400).json({ message: 'Missing company or broker' });
        }

        const exists = await DoNotCallList.findOne({ where: { company_name, broker_name } });
        if (exists) return res.status(409).json({ message: 'Already in DNC' });

        const entry = await DoNotCallList.create({ company_name, broker_name, added_from });
        res.status(201).json(entry);
    } catch (error) {
        console.error('❌ Failed to add DNC:', error);
        res.status(500).json({ message: 'Failed to add to DNC list' });
    }
};

export const deleteDNC = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("id -------------", id);
        const deleted = await DoNotCallList.destroy({ where: { id } });

        if (!deleted) {
            return res.status(404).json({ message: 'DNC entry not found' });
        }

        res.status(204).end();
    } catch (err) {
        console.error('❌ Failed to delete DNC entry:', err);
        res.status(500).json({ message: 'Server error deleting DNC entry' });
    }
};
