import sequelize from '../config/db.config.js';
import createDriverModel from './driver.model.js';
import createLoadModel from './load.model.js';
import createDoNotCallModel from './doNotCall.model.js';

const db = {};

// Sequelize instance
db.sequelize = sequelize;

// Define models
db.Driver = createDriverModel(sequelize);
db.Load = createLoadModel(sequelize);
db.DoNotCallList = createDoNotCallModel(sequelize);

// Setup associations (if defined in models)
Object.values(db).forEach((model) => {
    if (model?.associate) {
        model.associate(db);
    }
});

// Export as default (for `import db from '../models'`)
export default db;

// Optional: named export for Sequelize instance
export const connectToDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Connected to PostgreSQL successfully.');
        await sequelize.sync({ alter: true }); // Consider changing to { force: false }
        console.log('📦 All models synced.');
    } catch (error) {
        console.error('❌ Unable to connect to the database:', error);
    }
};
