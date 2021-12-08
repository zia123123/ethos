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
      idtransaksi: {
        allowNull: false,
        type: Sequelize.INTEGER,
        uniqe:true
      },
      customerId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "customers",
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
      expedisiName: {
        allowNull: false,
        type: Sequelize.STRING,
        // references: {
        //   model: "expedisis",
        //   key: "id"
        // },
        // onDelete: 'cascade',
        // onUpdate: 'cascade'
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

      // productId: {
      //   allowNull: false,
      //   type: Sequelize.INTEGER,
      //   references: {
      //     model: "products",
      //     key: "id"
      //   },
      //   onDelete: 'cascade',
      //   onUpdate: 'cascade'
      // },
      // namaproduct: {
      //   type: Sequelize.STRING
      // },
      // jumlahproduct: {
      //   type: Sequelize.STRING
      // },
      // linkdomain: {
      //   type: Sequelize.STRING
      // },
      // linkPhotoProduct: {
      //   type: Sequelize.STRING
      // },
      // discountProduct: {
      //   type: Sequelize.STRING
      // },
      invoiceId: {
        type: Sequelize.INTEGER,
      },
      awb: {
        type: Sequelize.STRING
      },
      so: {
        type: Sequelize.STRING
      },
      jumlahproduct: {
        type: Sequelize.INTEGER
      },
      pembayaran: {
        type: Sequelize.INTEGER
      },
      status: {
        type: Sequelize.CHAR
      },
      logstatus: {
        type: Sequelize.STRING
      },
      products: {
        type: Sequelize.STRING(1000)
      },
      discount: {
        type: Sequelize.INTEGER
      },
      memotransaksi: {
        type: Sequelize.TEXT
      },
      buktibayar: {
        type: Sequelize.STRING,
        
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