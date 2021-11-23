'use strict';

module.exports = (sequelize, DataTypes) => {

  const transaksi = sequelize.define('transaksis', {
    nama: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    notelp: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    alamat: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    discount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    typebayar: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    totalharga: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    memo: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    
  }, {
    tableName: "transaksis"
  });

  transaksi.associate = function(models) {
    transaksi.belongsTo(models.warehouses, { foreignKey: "warehouseId"})
    transaksi.belongsTo(models.expedisis, { foreignKey: "expedisiId"})
    transaksi.belongsTo(models.districts, { foreignKey: "districtId"})
    transaksi.belongsTo(models.auths, { foreignKey: "authId"})
    transaksi.belongsTo(models.statustranksasis, { foreignKey: "statustransaksiId"})
    transaksi.hasMany(models.keranjangs, { foreginKey: "transaksi"})   
    transaksi.hasMany(models.dataexpedisis,{ foreginKey: "dataexpedisis"})   

  };

  return transaksi;
};

