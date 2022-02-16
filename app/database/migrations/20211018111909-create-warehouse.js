'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('warehouses', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      provinceId: {
        type: Sequelize.INTEGER,
      },
      cityregencyId: {
        type: Sequelize.INTEGER,
      },
      districtId: {
        type: Sequelize.INTEGER,
      },
      city: {
        type: Sequelize.STRING
      },
      
      statusGudang: {
        type: Sequelize.BOOLEAN
      },
      internal: {
        type: Sequelize.BOOLEAN
      },
      address: {
        type: Sequelize.TEXT
      },
      expedition_data: {
        type: Sequelize.STRING
      },
      postalcode: {
        type: Sequelize.STRING
      },
      address_line_two: {
        type: Sequelize.TEXT
      },
      village: {
        type: Sequelize.STRING
      },
      provinceId: {
        type: Sequelize.INTEGER,
      },
      cityregencyId: {
        type: Sequelize.INTEGER,
      },
      districtId: {
        type: Sequelize.INTEGER,
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
    await queryInterface.dropTable('warehouses');
  }
};