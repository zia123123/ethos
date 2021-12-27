'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('tagihans', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      namaproduct: {
        type: Sequelize.STRING
      },
      pembayaran: {
        type: Sequelize.STRING
      },
      domain: {
        type: Sequelize.STRING
      },
      namabank: {
        type: Sequelize.STRING
      },
      totaltagihan: {
        type: Sequelize.INTEGER
      },
      norekening: {
        type: Sequelize.STRING
      },
      buktitagihan: {
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
    await queryInterface.dropTable('tagihans');
  }
};