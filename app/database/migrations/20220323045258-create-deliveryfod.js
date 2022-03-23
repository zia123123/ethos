'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('deliveryfods', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      authId: {
        allowNull: false,
        type: Sequelize.INTEGER,
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
    await queryInterface.dropTable('deliveryfods');
  }
};