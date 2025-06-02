import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import driverRoutes from './routes/driver.routes.js';
import loadRoutes from './routes/load.routes.js';
import matchRoutes from './routes/match.routes.js';
import statsRoutes from './routes/stats.routes.js';
import exportRoutes from './routes/export.routes.js';
import { connectToDatabase } from './models/index.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ===== Middleware =====
app.use(cors());
app.use(express.json()); // Needed to parse JSON bodies

// ===== Routes =====
app.use('/api/Drivers', driverRoutes);
app.use('/api/loads', loadRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/export', exportRoutes);

// ===== Health Check =====
app.get('/', (req, res) => {
    res.send('✅ RouteMaster Backend is running');
});

// ===== Database & Server Start =====
connectToDatabase()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('❌ Failed to connect to database:', err);
        process.exit(1);
    });

// ===== Error Handling (Optional) =====
process.on('unhandledRejection', (reason) => {
    console.error('🛑 Unhandled Rejection:', reason);
});

process.on('uncaughtException', (err) => {
    console.error('🛑 Uncaught Exception:', err);
});
