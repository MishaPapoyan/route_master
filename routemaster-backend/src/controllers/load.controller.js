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

// controllers/load.controller.js

export const createLoad = async (req, res) => {
    try {
        const { rigz_id, worked_with_us_before, company, broker, ...loadData } = req.body;

        // ✅ Validate rigz_id if present
        if (rigz_id) {
            const driver = await db.Driver.findOne({ where: { rigz_id: String(rigz_id) } });
            if (!driver) {
                return res.status(404).json({ message: '❌ Driver with this rigz_id not found' });
            }
            loadData.driverId = driver.id;
        }

        // ✅ Create the Load
        const newLoad = await db.Load.create({ ...loadData, rigz_id, worked_with_us_before, company, broker });

        // ✅ DNC check & insert
        if (worked_with_us_before === 'no' && company && broker) {
            const exists = await db.DoNotCallList.findOne({ where: { company_name: company, broker_name: broker } });
            if (!exists) {
                await db.DoNotCallList.create({
                    company_name: company,
                    broker_name: broker,
                    added_from: 'auto',
                });
                console.log(`🛑 DNC: ${company} (${broker}) added`);
            }
        }

        return res.status(201).json(newLoad);
    } catch (err) {
        console.error('❌ Error creating load:', err);
        return res.status(500).json({ message: 'Server error while creating load' });
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
export const updateCoveredStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { covered } = req.body;
        const load = await db.Load.findByPk(id);
        if (!load) return res.status(404).json({ message: 'Load not found' });

        load.covered = covered;
        await load.save();

        res.status(200).json(load);
    } catch (err) {
        console.error('❌ Error updating covered status:', err);
        res.status(500).json({ message: 'Failed to update covered status' });
    }
};