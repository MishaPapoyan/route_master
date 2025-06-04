import db from '../models/index.js';
const Load = db.Load;

export const getAllLoads = async (req, res) => {
    try {
        const loads = await Load.findAll({ include: ['driver'] });
        res.status(200).json(loads);
    } catch (err) {
        console.error('❌ Error fetching loads:', err);
        res.status(500).json({ message: 'Server error while fetching loads' });
    }
};

export const createLoad = async (req, res) => {
    try {
        const { rigz_id } = req.body;

        if (rigz_id) {
            const driver = await db.Driver.findOne({ where: { rigz_id: String(rigz_id) } });
            if (!driver) {
                return res.status(404).json({ message: 'Driver with given rigz_id not found' });
            }
        }

        const newLoad = await db.Load.create(req.body);
        res.status(201).json(newLoad);
    } catch (err) {
        console.error('❌ Error creating load:', err);
        res.status(500).json({ message: 'Server error while creating load' });
    }
};


export const updateLoad = async (req, res) => {
    try {
        const load = await Load.findByPk(req.params.id);
        if (!load) return res.status(404).json({ message: 'Load not found' });

        await load.update(req.body);
        res.status(200).json(load);
    } catch (err) {
        console.error('❌ Error updating load:', err);
        res.status(500).json({ message: 'Server error while updating load' });
    }
};

export const deleteLoad = async (req, res) => {
    try {
        const load = await Load.findByPk(req.params.id);
        if (!load) return res.status(404).json({ message: 'Load not found' });

        await load.destroy();
        res.status(200).json({ message: 'Load deleted successfully' });
    } catch (err) {
        console.error('❌ Error deleting load:', err);
        res.status(500).json({ message: 'Server error while deleting load' });
    }
};

export const updateLoadStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const validStatuses = ['open', 'assigned', 'booked', 'cancelled'];

    if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
    }

    try {
        const load = await Load.findByPk(id);
        if (!load) return res.status(404).json({ message: 'Load not found' });

        load.status = status;
        if (status === 'assigned') load.assignedAt = new Date();
        if (status === 'booked') load.completedAt = new Date();

        await load.save();
        res.status(200).json({ message: 'Status updated', load });
    } catch (err) {
        console.error('❌ Error updating load status:', err);
        res.status(500).json({ message: 'Server error' });
    }
};


export const markLoadContacted = async (req, res) => {
    const { id } = req.params;
    const { method, notes } = req.body;
    const validMethods = ['call', 'email'];

    if (!validMethods.includes(method)) {
        return res.status(400).json({ message: 'Invalid contact method' });
    }

    try {
        const load = await Load.findByPk(id);
        if (!load) return res.status(404).json({ message: 'Load not found' });

        load.contacted = true;
        load.contact_method = method;
        load.contactedAt = new Date();
        if (notes) load.notes = notes;

        await load.save();
        res.status(200).json({ message: 'Load marked as contacted', load });
    } catch (err) {
        console.error('❌ Error marking load contacted:', err);
        res.status(500).json({ message: 'Server error' });
    }
};



export const updateLoadClick = async (req, res) => {
    const { id } = req.params;
    const { type, change = 1 } = req.body;

    try {
        const load = await db.Load.findByPk(id);
        if (!load) return res.status(404).json({ message: 'Load not found' });

        if (type === 'didnt_connect') {
            load.didnt_connect_count = Math.max(0, (load.didnt_connect_count || 0) + change);
        } else {
            return res.status(400).json({ message: 'Invalid update type' });
        }

        await load.save();
        res.status(200).json(load);
    } catch (err) {
        console.error('❌ Error updating load click:', err);
        res.status(500).json({ message: 'Server error while updating load click' });
    }
};
