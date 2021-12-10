'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('daexpedisis', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },

      transaksisId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "transaksis",
          key: "id"
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      },
      buktibayar: {
        type: Sequelize.STRING
      },
      biayatambahan: {
        type: Sequelize.INTEGER
      },
      namabank: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('daexpedisis');
  }
};