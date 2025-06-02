import sequelize from '../config/db.config.js';
import createDriverModel from './driver.model.js';
import createLoadModel from './load.model.js';

const db = {};

// Core connection
db.sequelize = sequelize;

// Model definitions
db.Driver = createDriverModel(sequelize);
db.Load = createLoadModel(sequelize);

// Model associations
Object.values(db).forEach((model) => {
    if (model?.associate) {
        model.associate(db);
    }
});

// Connect function
export const connectToDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Connected to PostgreSQL successfully.');
        await sequelize.sync({ alter: true });
        console.log('📦 All models synced.');
    } catch (error) {
        console.error('❌ Unable to connect to the database:', error);
    }
};

export default db;
