'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('dfods', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      transaksiId: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      awbpengembalian: {
        type: Sequelize.STRING
      },
      expedisipengembalian: {
        type: Sequelize.STRING
      },
      awbpengiriman: {
        type: Sequelize.STRING
      },
      expedisipengiriman: {
        type: Sequelize.STRING
      },
      typedfod: {
        type: Sequelize.INTEGER
      },
      biayapengembalian: {
        type: Sequelize.INTEGER
      },
      biayapengiriman: {
        type: Sequelize.INTEGER
      },
      evidance: {
        type: Sequelize.STRING
      },
      // evidance2: {
      //   type: Sequelize.STRING
      // },
      // evidance3: {
      //   type: Sequelize.STRING
      // },
      // evidance4: {
      //   type: Sequelize.STRING
      // },
      keterangan: {
        type: Sequelize.TEXT
      },
      kondisibarang: {
        type: Sequelize.BOOLEAN
      },
      state: {
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
    await queryInterface.dropTable('dfods');
  }
};