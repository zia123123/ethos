'use strict';

module.exports = (sequelize, DataTypes) => {

  const expedisi = sequelize.define('expedisis', {
    origin: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    index: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    tableName: "expedisis"
  });

  expedisi.associate = function(models) {
    expedisi.hasMany(models.warehouses,{ onDelete: 'cascade' },{ constraints: true}, { foreginKey: "expedisi"})
    expedisi.hasMany(models.transaksis,{ onDelete: 'cascade' },{ constraints: true}, { foreginKey: "expedisi"})
  };

  return expedisi;
};