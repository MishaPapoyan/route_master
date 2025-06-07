'use strict';

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('do_not_call_list', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    company_name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    broker_name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    added_from: {
      type: Sequelize.ENUM('auto', 'manual'),
      defaultValue: 'auto'
    },
    createdAt: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.fn('NOW')
    },
    updatedAt: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.fn('NOW')
    }
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('do_not_call_list');
}
