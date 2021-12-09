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
      ongkoskirim: {
        type: Sequelize.INTEGER
      },
      subsidi: {
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
      norekening: {
        type: Sequelize.STRING
      },
      biayacod: {
        type: Sequelize.INTEGER
      },
      financeId: {
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