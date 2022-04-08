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
        type: Sequelize.BIGINT,
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
      },
      provinceId: {
        type: Sequelize.INTEGER,
      },
      cityregencyId: {
        type: Sequelize.INTEGER,
      },
      districtId: {
        type: Sequelize.INTEGER,
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
      invoiceId: {
        type: Sequelize.STRING,
      },
      typebayar: {
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
      noref: {
        type: Sequelize.STRING
      },
      statusbarang: {
        type: Sequelize.STRING
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
      ongkoskirim: {
        type: Sequelize.INTEGER
      },
      subsidi: {
        type: Sequelize.INTEGER
      },   

      provinceId: {
        type: Sequelize.INTEGER,
      },
      cityregencyId: {
        type: Sequelize.INTEGER,
      },
      districtId: {
        type: Sequelize.INTEGER,
      },
      provinsiname:{
        type: Sequelize.STRING,
      },
      cityname:{
        type: Sequelize.STRING,
      },
      districtname:{
        type: Sequelize.STRING,
      },
      memotransaksi: {
        type: Sequelize.TEXT
      },
      sudahbayar: {
        type: Sequelize.BIGINT,
      },
      kurangbayar: {
        type: Sequelize.BIGINT,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.STRING
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.STRING
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('transaksis');
  }
};