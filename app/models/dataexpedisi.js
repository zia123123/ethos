'use strict';

module.exports = (sequelize, DataTypes) => {

  const dataexpedisi = sequelize.define('dataexpedisis', {
    ongkoskirim: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    subsidi: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    biayatambahan: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    norekening: {
      type: DataTypes.STRING,
      allowNull: false,
    },
   
    financeId: {
      type: DataTypes.INTEGER
    },
    nomorinvoice: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    biayacod: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    tableName: "dataexpedisis"
  });

  dataexpedisi.associate = function(models) {
    dataexpedisi.belongsTo(models.transaksis, { foreignKey: "transaksiId"})
  };

  return dataexpedisi;
};