'use strict';

module.exports = (sequelize, DataTypes) => {

  const pengajuanbiaya = sequelize.define('pengajuanbiaya', {
    namabank: {
      type:  DataTypes.STRING,
    },
    akun: {
      type:DataTypes.STRING,
    },
    superVisorId: {
      type: DataTypes.INTEGER,
    },
    supervisorName: {
      type:DataTypes.STRING,
    },
    nominal: {
      type:DataTypes.BIGINT,
    },
    status: {
      type: DataTypes.INTEGER,
    },
    platform: {
      type: DataTypes.STRING
    },
    tanggalapproval: {
      type: DataTypes.DATE,
    },
    tanggaltrf: {
      type: DataTypes.DATE,
    },
    disetujui: {
      type: DataTypes.STRING,
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.BOOLEAN,
    },
  
  }, {
    tableName: "pengajuanbiayas"
  });

  pengajuanbiaya.associate = function(models) {
    pengajuanbiaya.belongsTo(models.group, { foreginKey: "groupId"})
    pengajuanbiaya.belongsTo(models.auths, { foreginKey: "authId"})
    pengajuanbiaya.belongsTo(models.products, { foreginKey: "productId"})

   
  };
  return pengajuanbiaya;
};
