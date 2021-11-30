'use strict';

module.exports = (sequelize, DataTypes) => {

  const transaksi = sequelize.define('transaksis', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    notelp1: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    notelp2: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    alamat: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    pembayaran: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    gudang: {
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
    products: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    tableName: "transaksis"
  });

  transaksi.associate = function(models) {
    transaksi.belongsTo(models.expedisis, { foreginKey: "expedisisId"})   
    transaksi.belongsTo(models.districts, { foreginKey: "districtId"})   
    transaksi.belongsTo(models.auths, { foreginKey: "authId"})   

  };

  return transaksi;
};