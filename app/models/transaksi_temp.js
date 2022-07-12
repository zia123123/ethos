'use strict';

module.exports = (sequelize, DataTypes) => {

  const transaksi = sequelize.define('transaksis_temp', {
    nama: {
      type: DataTypes.STRING,
    },
    pembayaran: {
      type: DataTypes.INTEGER,
    },
    discount: {
      type: DataTypes.INTEGER,
    },
    memotransaksi: {
      type: DataTypes.TEXT,
    },
    status: {
      type: DataTypes.CHAR,
    },
    logstatus: {
      type: DataTypes.STRING,
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
      type: DataTypes.BIGINT,
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
    groupname:{
      type: DataTypes.STRING,
    },
    products: {
      type: DataTypes.STRING
    },
    idGroup: {
      type: DataTypes.INTEGER
    },
    updateFinance: {
      type: DataTypes.STRING
    },
    expedisiName: {
      type: DataTypes.STRING,
    },
    tanggalAWB: {
      type: 'DATETIME',
    },
    tanggalVerifikasi: {
      type: 'DATETIME',
    },
    memoCancel: {
      type: DataTypes.STRING
    },
    orderNumber: {
      type: DataTypes.STRING,
    },
    biayatambahan: {
      type: DataTypes.INTEGER,
    },
    biayacod: {
      type: DataTypes.INTEGER,
    },
    subsidicod: {
      type: DataTypes.INTEGER,
    },
    totalharga: {
      type: DataTypes.BIGINT
    },
    packingKayu: {
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
    tableName: "transaksis_temp"
  });

  transaksi.associate = function(models) {

    // transaksi.hasOne(models.daexpedisis)
    // transaksi.hasOne(models.dfods)
    // transaksi.hasMany(models.buktibayars)
    // transaksi.hasOne(models.deliveryfods)
    // transaksi.hasOne(models.returs)
    // transaksi.belongsTo(models.expedisis, { foreginKey: "expedisiId"})   
    transaksi.belongsTo(models.auths, { as: "auth", foreignKey: "authId"})
    transaksi.belongsTo(models.auths, { as: "authFinance", foreignKey: "authIDFinance"})
    transaksi.belongsTo(models.auths, { as: "authWarehouse", foreignKey: "authIDWarehouse"})
    transaksi.belongsTo(models.customers, { foreginKey: "customerId"})
    transaksi.belongsTo(models.warehouses, { foreginKey: "warehouseId"})
    transaksi.belongsTo(models.metodepembayarans, { foreignKey: "typebayar"})
    transaksi.belongsTo(models.leads, { foreignKey: "leadsId"})
    transaksi.belongsTo(models.nomorekenings, { foreignKey: "noreksId"})
    transaksi.belongsTo(models.ratecard, { foreignKey: "ratecardId"})
    transaksi.belongsTo(models.group, { foreignKey: "idGroup"})
    transaksi.belongsTo(models.ekpedisi, { foreignKey: "expedisiId"})
    // transaksi.hasOne(models.keranjangs)

    //transaksi.belongsTo(models.products, { foreginKey: "productId"})
    
   
  };

  return transaksi;
};