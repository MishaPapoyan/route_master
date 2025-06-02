import express from 'express';
import { exportDriversCSV, exportLoadsCSV } from '../controllers/export.controller.js';

const router = express.Router();

router.get('/drivers', exportDriversCSV);
router.get('/loads', exportLoadsCSV);

export default router;
