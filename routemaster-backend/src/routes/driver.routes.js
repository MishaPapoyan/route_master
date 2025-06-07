import express from 'express';
import {
    getAllDrivers,
    createDriver,
    updateDriver,
    deleteDriver,
    updateCallStatus,
} from '../controllers/driver.controller.js';

const router = express.Router();

// GET all drivers
router.get('/', getAllDrivers);

// POST new driver
router.post('/', createDriver);

// PUT update driver
router.put('/:id', updateDriver);

// PUT call status update
router.put('/:id/click', updateCallStatus);

// DELETE driver
router.delete('/:id', deleteDriver);

export default router;
