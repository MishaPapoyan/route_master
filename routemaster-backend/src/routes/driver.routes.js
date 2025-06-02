import express from 'express';
import {
    getAllDrivers,
    createDriver,
    updateDriver,
    deleteDriver,
    updateCallStatus,
} from '../controllers/driver.controller.js';

const router = express.Router();

router.get('/', getAllDrivers);
router.post('/', createDriver);
router.put('/:id', updateDriver); // ✅ handles "covered" updates
router.delete('/:id', deleteDriver);
router.put('/:id/click', updateCallStatus);

export default router;
