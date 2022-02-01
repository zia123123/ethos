'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('keranjangs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      productId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "products",
          key: "id"
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      },
      transaksiId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      customerId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      csId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      namaproduct: {
        type: Sequelize.STRING
      },
      price: {
        type: Sequelize.INTEGER
      },
      jumlahproduct: {
        type: Sequelize.INTEGER
      },
      weight: {
        type: Sequelize.INTEGER
      },
      linkdomain: {
        type: Sequelize.STRING
      },
      linkphoto: {
        type: Sequelize.STRING
      },
      discount: {
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
    await queryInterface.dropTable('keranjangs');
  }
};