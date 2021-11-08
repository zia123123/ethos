'use strict';

module.exports = (sequelize, DataTypes) => {

  const nomorekening = sequelize.define('nomorekenings', {
    nomor: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nama_bank: {
      type: DataTypes.STRING,
      allowNull: false,
    },
 
  }, {
    tableName: "nomorekenings"
  });

  nomorekening.associate = function(models) {
    // metodepembayaran.hasMany(models.customers,{ onDelete: 'cascade' },{ constraints: true}, { foreginKey: "cityregency"})   
  };

  return nomorekening;
};

