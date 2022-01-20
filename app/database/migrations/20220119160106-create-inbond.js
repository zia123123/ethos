'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('inbonds', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nopo: {
        type: Sequelize.STRING
      },
      totalharga: {
        type: Sequelize.INTEGER
      },
      supplierId: {
        type: Sequelize.INTEGER,
      },
      totalterbayar: {
        type: Sequelize.INTEGER
      },

      totalbarangpesan: {
        type: Sequelize.INTEGER
      },
      totalbarangsampai: {
        type: Sequelize.INTEGER
      },

      status: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('inbonds');
  }
};