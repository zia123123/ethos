'use strict';

module.exports = (sequelize, DataTypes) => {

  const typepelanggan = sequelize.define('typepelanggans', {
    nama: {
      type: DataTypes.STRING,
      allowNull: false,
    },
 
  }, {
    tableName: "typepelanggans"
  });

  typepelanggan.associate = function(models) {
    //typepelanggan.hasMany(models.customers,{ onDelete: 'cascade' },{ constraints: true}, { foreginKey: "cityregency"})   
  };

  return typepelanggan;
};

