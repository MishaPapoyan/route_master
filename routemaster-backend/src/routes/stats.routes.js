import express from "express";
import { getWeeklySummary } from '../controllers/stats.controller.js';
import { getTopBrokers } from '../controllers/stats.controller.js';
import { getAverageRate } from '../controllers/stats.controller.js';

const router = express.Router();

router.get('/weekly-summary', getWeeklySummary)
router.get('/top-brokers', getTopBrokers);
router.get('/avg-rate', getAverageRate);

export default router;