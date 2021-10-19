'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('mappingadvertisers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      advertiserId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "auths",
          key: "id"
        }
      },
      cserviceId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "auths",
          key: "id"
        }
      },
      start: {
        type: Sequelize.DATE
      },
      expired: {
        type: Sequelize.DATE
      },
      keterangan: {
        type: Sequelize.TEXT
      },
      is_active: {
        type: Sequelize.BOOLEAN
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
    await queryInterface.dropTable('mappingadvertisers');
  }
};