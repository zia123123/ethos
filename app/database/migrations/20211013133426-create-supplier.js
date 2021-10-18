'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('suppliers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      address_line_one: {
        type: Sequelize.TEXT
      },
      address_line_two: {
        type: Sequelize.TEXT
      },
      district: {
        type: Sequelize.STRING
      },
      sub_district: {
        type: Sequelize.STRING
      },
      phone: {
        type: Sequelize.STRING
      },
      bank_account_no: {
        type: Sequelize.STRING
      },
      name_of_director: {
        type: Sequelize.STRING
      },
      is_active: {
        type: Sequelize.BOOLEAN
      },
      bank_name: {
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
    await queryInterface.dropTable('suppliers');
  }
};