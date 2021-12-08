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
    },
    financeId: {
      type: DataTypes.INTEGER
    },
    biayacod: {
      type: DataTypes.INTEGER,
      
    },
  }, {
    tableName: "dataexpedisis"
  });

  dataexpedisi.associate = function(models) {
    dataexpedisi.belongsTo(models.transaksis, { foreignKey: "transaksiId"})
  };

  return dataexpedisi;
};