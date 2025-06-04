import { ContactedLoad } from '../models/index.js';

export const updateContactedLoad = async (req, res) => {
    try {
        const { id } = req.params;
        const [updated] = await ContactedLoad.update(req.body, { where: { id } });
        if (updated) {
            const updatedLoad = await ContactedLoad.findByPk(id);
            return res.json(updatedLoad);
        }
        res.status(404).json({ message: 'Contacted load not found' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating contacted load', error });
    }
};

export const deleteContactedLoad = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await ContactedLoad.destroy({ where: { id } });
        if (deleted) {
            return res.json({ message: 'Contacted load deleted', id });
        }
        res.status(404).json({ message: 'Contacted load not found' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting contacted load', error });
    }
};
