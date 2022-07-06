'use strict';
module.exports = (sequelize, DataTypes) => {

  const deliveryfod = sequelize.define('deliveryfods', {
    awbpengembalian: {
      type: DataTypes.STRING
    },
    expedisipengembalian: {
      type: DataTypes.STRING
    },
    awbpengiriman: {
      type: DataTypes.STRING
    },
    expedisipengiriman: {
      type: DataTypes.STRING
    },
    kondisibarang: {
      type: DataTypes.BOOLEAN
    },
    typedfod: {
      type: DataTypes.INTEGER
    },
    biayapengembalian: {
      type: DataTypes.INTEGER
    },
    biayapengiriman: {
      type: DataTypes.INTEGER
    },
    biayapengiriman: {
      type: DataTypes.INTEGER
    },
    evidance: {
      type: DataTypes.STRING
    },
    authId: {
     
      type: DataTypes.INTEGER,
    },
    keterangan: {
      type: DataTypes.TEXT
    },
    state: {
      type: DataTypes.INTEGER
    },
    products: {
      type: DataTypes.TEXT
    },
    tanggal_spv: {
      type: 'DATETIME',
    },
    tanggal_cc: {
      type: 'DATETIME',
    },
  }, {
    tableName: "deliveryfods"
  });
  deliveryfod.associate = function(models) {
    deliveryfod.belongsTo(models.transaksis, { foreignKey: "transaksisId"})
    deliveryfod.belongsTo(models.auths, { as: "authSpv", foreignKey: "spvAuthId"})
    deliveryfod.belongsTo(models.auths, { as: "authCC", foreignKey: "ccAuthId"})
  };

  return deliveryfod;
};
  