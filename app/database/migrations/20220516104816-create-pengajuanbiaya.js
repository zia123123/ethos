'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('pengajuanbiayas', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      namabank: {
        type: Sequelize.STRING
      },
      akun: {
        type: Sequelize.STRING
      },
      superVisorId: {
        type: Sequelize.INTEGER
      },
      supervisorName: {
        type: Sequelize.STRING
      },
      nominal: {
        type: Sequelize.BIGINT
      },
      status: {
        type: Sequelize.INTEGER
      },
      tanggalapproval: {
        type: Sequelize.DATE
      },
      tanggaltrf: {
        type: Sequelize.DATE
      },
      disetujui: {
        type: Sequelize.STRING
      },
      authId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "auths",
          key: "id"
        }
      },
      groupId: {
        type: Sequelize.INTEGER,
      },
      productId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "products",
          key: "id"
        }
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
    await queryInterface.dropTable('pengajuanbiayas');
  }
};