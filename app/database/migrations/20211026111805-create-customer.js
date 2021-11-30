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
      email: {
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
      rw: {
        type: Sequelize.INTEGER
      },
      kelurahan: {
        type: Sequelize.STRING
      },
      postalcode: {
        type: Sequelize.STRING
      },
      jeniskelamin: {
        type: Sequelize.CHAR
      },
      city: {
        type: Sequelize.STRING
      },
      memoid: {
        type: Sequelize.INTEGER
      },
      districtId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "districts",
          key: "id"
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      },
      province: {
        allowNull: false,
        type: Sequelize.STRING,
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