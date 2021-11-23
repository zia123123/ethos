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
      nama: {
        type: Sequelize.STRING
      },
      notelp: {
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
      warehouseId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "warehouses",
          key: "id"
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      },
      expedisiId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "expedisis",
          key: "id"
        },
      },
      authId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "auths",
          key: "id"
        },
      },
       
      statustransaksiId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "statustranksasis",
          key: "id"
        },
      },
        
      discount: {
        type: Sequelize.INTEGER
      },
      totalharga: {
        type: Sequelize.INTEGER
      },
      typebayar: {
        type: Sequelize.INTEGER
      },
      memo: {
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