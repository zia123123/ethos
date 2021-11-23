'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('warehouses', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      expedisiId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "expedisis",
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
      city: {
        type: Sequelize.STRING
      },
      address: {
        type: Sequelize.TEXT
      },
      expedition_data: {
        type: Sequelize.STRING
      },
      postalcode: {
        type: Sequelize.STRING
      },
      address_line_two: {
        type: Sequelize.TEXT
      },
      village: {
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
    await queryInterface.dropTable('warehouses');
  }
};