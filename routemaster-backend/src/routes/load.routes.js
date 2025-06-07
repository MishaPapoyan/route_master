import express from 'express';
import {
    getAllLoads,
    createLoad,
    updateLoad,
    deleteLoad,
    markLoadContacted,
    updateLoadStatus,
    updateLoadClick, updateCoveredStatus, // ✅ NEW
} from '../controllers/load.controller.js';

const router = express.Router();

router.get('/', getAllLoads);
router.post('/', createLoad);
router.put('/:id', updateLoad);
router.delete('/:id', deleteLoad);
router.put('/:id/contact', markLoadContacted);
router.put('/:id/status', updateLoadStatus);
router.put('/:id/click', updateLoadClick); // ✅ NEW
router.put('/:id/covered', updateCoveredStatus);

export default router;
