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
      allowNull: false,
      type: DataTypes.STRING,
    },
    createdAt: {
      allowNull: false,
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
  }, {
    tableName: "transaksis"
  });

  transaksi.associate = function(models) {

    transaksi.hasOne(models.daexpedisis)
    transaksi.hasOne(models.dfods)
    transaksi.hasMany(models.buktibayars)
    transaksi.hasOne(models.deliveryfods)
    transaksi.hasOne(models.returs)
    // transaksi.belongsTo(models.expedisis, { foreginKey: "expedisiId"})   
    transaksi.belongsTo(models.auths, { as: "auth", foreignKey: "authId"})
    transaksi.belongsTo(models.auths, { as: "authFinance", foreignKey: "authIDFinance"})
    transaksi.belongsTo(models.auths, { as: "authWarehouse", foreignKey: "authIDWarehouse"})
    transaksi.belongsTo(models.customers, { foreginKey: "customerId"})
    transaksi.belongsTo(models.warehouses, { foreginKey: "warehouseId"})
    transaksi.belongsTo(models.metodepembayarans, { foreignKey: "typebayar"})
    transaksi.belongsTo(models.leads, { foreignKey: "leadsId"})
    transaksi.belongsTo(models.nomorekenings, { foreignKey: "noreksId"})
    transaksi.belongsTo(models.group, { foreignKey: "idGroup"})
    // transaksi.hasOne(models.keranjangs)

    //transaksi.belongsTo(models.products, { foreginKey: "productId"})
    
   
  };

  return transaksi;
};