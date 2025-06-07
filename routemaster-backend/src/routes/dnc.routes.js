import express from 'express';
import { getAllDNC, addDNC, deleteDNC } from '../controllers/dnc.controller.js';

const router = express.Router();

router.get('/', getAllDNC);
router.post('/', addDNC);
router.delete('/:id', deleteDNC);

export default router;
