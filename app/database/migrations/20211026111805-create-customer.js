'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('customers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nama: {
        type: Sequelize.STRING
      },
      notelp: {
        type: Sequelize.STRING
      },
      notelp2: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      warehouseId: {
        type: Sequelize.INTEGER
      },
      idorigin: {
        type: Sequelize.STRING
      },
      pekerjaan: {
        type: Sequelize.STRING
      },
      alamat: {
        type: Sequelize.TEXT
      },
      rt: {
        type: Sequelize.INTEGER
      },
      authId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      rw: {
        type: Sequelize.INTEGER
      },
      postalcode: {
        type: Sequelize.STRING
      },
      kelurahan: {
        type: Sequelize.STRING
      },
      jeniskelamin: {
        type: Sequelize.STRING
      },
      memoid: {
        type: Sequelize.INTEGER
      },
      provinsiname:{
        type: Sequelize.STRING,
      },
      cityname:{
        type: Sequelize.STRING,
      },
      districtname:{
        type: Sequelize.STRING,
      },
      provinceId: {
        type: Sequelize.INTEGER,
      },
      destinations: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable('customers');
  }
};