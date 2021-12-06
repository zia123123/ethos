'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('mappingnoreks', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      keterangan: {
        type: Sequelize.STRING
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
      nomorekeningId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "nomorekenings",
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
    await queryInterface.dropTable('mappingnoreks');
  }
};