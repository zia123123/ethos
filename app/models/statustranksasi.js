'use strict';

module.exports = (sequelize, DataTypes) => {

  const statustranksasi = sequelize.define('statustranksasis', {
    nama: {
      type: DataTypes.STRING,
      allowNull: false,
    },
 
  }, {
    tableName: "statustranksasis"
  });

  statustranksasi.associate = function(models) {
    statustranksasi.hasMany(models.transaksis,{ onDelete: 'cascade' },{ constraints: true}, { foreginKey: "statustransaksi"})   
  };

  return statustranksasi;
};

