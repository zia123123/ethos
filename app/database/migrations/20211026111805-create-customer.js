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
      provinceId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "provinces",
          key: "id"
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      },
      cityregencyId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "cityregencies",
          key: "id"
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
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