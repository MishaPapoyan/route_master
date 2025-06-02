import express from 'express';
import {findDriversForLoad, findLoadsForDriver} from '../controllers/match.controller.js';

const router = express.Router();

router.get('/drivers-for-load/:loadId', findDriversForLoad) // ✅ Correct path
router.get('/loads-for-driver/:driverId', findLoadsForDriver);


export default router;