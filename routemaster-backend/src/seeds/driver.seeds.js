// src/seeds/driver.seeds.js
import dotenv from 'dotenv';
dotenv.config(); // 👈 MUST be first

import db from '../models/index.js';

const seedDrivers = async () => {
  try {
    await db.sequelize.sync();
    await db.Driver.bulkCreate([
      {
        name: 'Artur Vardanyan',
        phone_number: '+15555555551',
        call_count: 1,
        current_location: 'Atlanta, GA',
        next_location: 'Los Angeles, CA',
        is_from_rigz: false,
        nationality: 'Armenian',
        notes: 'Prefers East Coast loads',
      },
      // Add more Drivers here...
    ]);
    console.log('✅ Seeded Drivers!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
};

seedDrivers();
