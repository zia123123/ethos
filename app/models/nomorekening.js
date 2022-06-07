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
    nama: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdBy:{
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    tableName: "nomorekenings"
  });

  nomorekening.associate = function(models) {
    // metodepembayaran.hasMany(models.customers,{ onDelete: 'cascade' },{ constraints: true}, { foreginKey: "cityregency"})   
    nomorekening.belongsTo(models.auths, { foreginKey: "authId"})   
    //nomorekening.hasMany(models.mappingnoreks,{ onDelete: 'cascade' },{ constraints: true}, { foreginKey: "nomorekening"})

  };

  return nomorekening;
};

