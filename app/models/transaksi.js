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
      type: DataTypes.STRING,
    },
    statusbarang: {
      type: DataTypes.STRING
    },
    sudahbayar: {
      type: DataTypes.BIGINT,
    },
    kurangbayar: {
      type: DataTypes.BIGINT,
    },
    idtransaksi: {
      allowNull: false,
      type: DataTypes.INTEGER,
      uniqe:true
    },
    awb: {
      type: DataTypes.STRING
    },
    ongkoskirim: {
      type: DataTypes.INTEGER
    },
    typebayar: {
      type: DataTypes.INTEGER,
    },
    subsidi: {
      type: DataTypes.INTEGER
    },   
    so: {
      type: DataTypes.STRING
    },
    provinceId: {
      type: DataTypes.INTEGER,
    },
    cityregencyId: {
      type: DataTypes.INTEGER,
    },
    districtId: {
      type: DataTypes.INTEGER,
    },
    provinsiname:{
      type: DataTypes.STRING,
    },
    cityname:{
      type: DataTypes.STRING,
    },
    districtname:{
      type: DataTypes.STRING,
    },
    products: {
      type: DataTypes.STRING
    },
    expedisiName: {
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

    transaksi.hasOne(models.daexpedisis)
    transaksi.hasMany(models.buktibayars)
   // transaksi.hasOne(models.deliveryfods)
    // transaksi.belongsTo(models.expedisis, { foreginKey: "expedisiId"})   
    transaksi.belongsTo(models.auths, { foreginKey: "authId"})
    transaksi.belongsTo(models.customers, { foreginKey: "customerId"})
    transaksi.belongsTo(models.warehouses, { foreginKey: "warehouseId"})

    //transaksi.belongsTo(models.products, { foreginKey: "productId"})
    
   
  };

  return transaksi;
};