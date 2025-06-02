module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('loads', 'driver_rigz_id', {
      type: Sequelize.STRING,
      references: {
        model: 'drivers',
        key: 'rigz_id',
      },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.removeColumn('loads', 'driver_rigz_id');
  },
};