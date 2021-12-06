'use strict';

module.exports = (sequelize, DataTypes) => {
  const auth = sequelize.define('auths', {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nik: {
      type: DataTypes.STRING,
    },
    noktp: {
      type: DataTypes.STRING,
    },
    alamat: {
      type: DataTypes.TEXT,
    },
    notelp: {
      type: DataTypes.STRING,
    },
    tempatlahir: {
      type: DataTypes.STRING,
    },
    jeniskelamin: {
      type: DataTypes.CHAR,
    },
    statuskawin: {
      type: DataTypes.CHAR,
    },
    statuskaryawan: {
      type: DataTypes.STRING,
    },
    tanggalmasuk: {
      type: DataTypes.DATE,
    },
    tanggalkeluar: {
      type: DataTypes.DATE,
    },
    posisi: {
      type: DataTypes.STRING,
    },
    level: {
      type: DataTypes.STRING,
    },
    namabank: {
      type: DataTypes.STRING,
    },
    norekening: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    firstname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  }, {
    tableName: "auths"
  });

  auth.associate = function(models) {
    auth.hasMany(models.domains,{ onDelete: 'cascade' },{ constraints: true}, { foreginKey: "auth"})
    auth.hasMany(models.mappingadvertisers,{ onDelete: 'cascade' },{ constraints: true}, { foreginKey: "auth"})
    auth.hasMany(models.mapgroupcs,{ onDelete: 'cascade' },{ constraints: true}, { foreginKey: "auth"})
    auth.hasMany(models.transaksis,{ onDelete: 'cascade' },{ constraints: true}, { foreginKey: "auth"})
    auth.hasMany(models.nomorekenings,{ onDelete: 'cascade' },{ constraints: true}, { foreginKey: "auth"})
    auth.hasMany(models.mappingnoreks,{ onDelete: 'cascade' },{ constraints: true}, { foreginKey: "auth"})

  };

  return auth;
};