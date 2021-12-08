'use strict';

module.exports = (sequelize, DataTypes) => {

  const transaksi = sequelize.define('transaksis', {
    nama: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pembayaran: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    discount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    memotransaksi: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.CHAR,
      allowNull: false,
    },
    logstatus: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    invoiceId: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    buktibayar: {
      type: DataTypes.STRING,
      //allowNull: false,
    },
    idtransaksi: {
      allowNull: false,
      type: DataTypes.INTEGER,
      uniqe:true
    },
    awb: {
      type: DataTypes.STRING
    },
    so: {
      type: DataTypes.STRING
    },
    products: {
      type: DataTypes.STRING
    },
    expedisiId: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    // linkdomain: {
    //   type: DataTypes.STRING
    // },
    // linkPhotoProduct: {
    //   type: DataTypes.STRING
    // },
    // discountProduct: {
    //   type: DataTypes.STRING
    // },
  }, {
    tableName: "transaksis"
  });

  transaksi.associate = function(models) {
    // transaksi.belongsTo(models.expedisis, { foreginKey: "expedisiId"})   
    transaksi.belongsTo(models.provinces, { foreginKey: "provinceId"})   
    transaksi.belongsTo(models.districts, { foreginKey: "districtId"})   
    transaksi.belongsTo(models.cityregencies, { foreginKey: "cityregencyId"})
    transaksi.belongsTo(models.auths, { foreginKey: "authId"})
    transaksi.belongsTo(models.customers, { foreginKey: "customerId"})
    transaksi.belongsTo(models.warehouses, { foreginKey: "warehouseId"})
    //transaksi.hasMany(models.keranjangs,{ onDelete: 'cascade' },{ constraints: true}, { foreginKey: "transaksi"})

    //transaksi.belongsTo(models.products, { foreginKey: "productId"})
    
   
  };

  return transaksi;
};