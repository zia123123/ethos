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
    // statusbarang: {
    //   type: DataTypes.STRING
    // },
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
    totalharga: {
      type: DataTypes.INTEGER
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
    // transaksi.belongsTo(models.expedisis, { foreginKey: "expedisiId"})   
    transaksi.belongsTo(models.provinces, { foreginKey: "provinceId"})   
    transaksi.belongsTo(models.districts, { foreginKey: "districtId"})   
    transaksi.belongsTo(models.cityregencies, { foreginKey: "cityregencyId"})
    transaksi.belongsTo(models.auths, { foreginKey: "authId"})
    transaksi.belongsTo(models.customers, { foreginKey: "customerId"})
    transaksi.belongsTo(models.warehouses, { foreginKey: "warehouseId"})

    //transaksi.belongsTo(models.products, { foreginKey: "productId"})
    
   
  };

  return transaksi;
};