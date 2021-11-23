'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('dataexpedisis', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ongkoskirim: {
        type: Sequelize.INTEGER
      },
      subsidi: {
        type: Sequelize.INTEGER
      },
      transaksiId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "transaksis",
          key: "id"
        },
      },
      biayatambahan: {
        type: Sequelize.INTEGER
      },
      norekening: {
        type: Sequelize.STRING
      },
      biayacod: {
        type: Sequelize.INTEGER
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
    await queryInterface.dropTable('dataexpedisis');
  }
};