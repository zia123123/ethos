'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('product_stocks', {
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
      quantity: {
        type: Sequelize.INTEGER
      },
      remark: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('product_stocks');
  }
};