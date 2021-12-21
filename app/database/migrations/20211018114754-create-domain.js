'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('domains', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },

      url: {
        type: Sequelize.STRING
      },
      type: {
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


      nameproduct: {
        type: Sequelize.STRING
      },
      biayaiklan: {
        type: Sequelize.BIGINT
      },
      status: {
        type: Sequelize.BOOLEAN
      },

      // buktisaldo: {
      //   type: Sequelize.STRING
      // },
      // buktitagihan: {
      //   type: Sequelize.STRING
      // },
      // nBuktiSaldo: {
      //   type: Sequelize.STRING
      // },
      // nBuktiTagihan: {
      //   type: Sequelize.STRING
      // },




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
    await queryInterface.dropTable('domains');
  }
};