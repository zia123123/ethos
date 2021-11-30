'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('transaksis', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      notelp1: {
        type: Sequelize.STRING
      },
      notelp2: {
        type: Sequelize.STRING
      },
      alamat: {
        type: Sequelize.TEXT
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
      authId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "auths",
          key: "id"
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      },
      expedisisId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "expedisis",
          key: "id"
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      },
      pembayaran: {
        type: Sequelize.INTEGER
      },
      status: {
        type: Sequelize.CHAR
      },
      logstatus: {
        type: Sequelize.STRING
      },
      products: {
        type: Sequelize.TEXT
      },
      gudang: {
        type: Sequelize.INTEGER
      },
      discount: {
        type: Sequelize.INTEGER
      },
      memotransaksi: {
        type: Sequelize.TEXT
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
    await queryInterface.dropTable('transaksis');
  }
};