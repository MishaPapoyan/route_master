import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import driverRoutes from './routes/driver.routes.js';
import loadRoutes from './routes/load.routes.js';
import matchRoutes from './routes/match.routes.js';
import statsRoutes from './routes/stats.routes.js';
import exportRoutes from './routes/export.routes.js';
import dncRoutes from './routes/dnc.routes.js'; // ✅ NEW

import { connectToDatabase } from './models/index.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/drivers', driverRoutes);
app.use('/api/loads', loadRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/export', exportRoutes);
app.use('/api/dnc', dncRoutes); // ✅ REGISTER DNC ROUTES

// Start Server
const startServer = async () => {
    await connectToDatabase();
    app.listen(PORT, () => {
        console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
};

startServer();
