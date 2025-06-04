import express from 'express';
import {
    getAllContactedLoads,
    createContactedLoad,
    updateContactedLoad,
    deleteContactedLoad
} from '../controllers/contactedLoad.controller.js';

const router = express.Router();

router.get('/', getAllContactedLoads);
router.post('/', createContactedLoad);
router.put('/:id', updateContactedLoad);       // ✅ NEW
router.delete('/:id', deleteContactedLoad);    // ✅ NEW

export default router;
