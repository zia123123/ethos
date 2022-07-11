'use strict';
module.exports = (sequelize, DataTypes) => {

  const deliveryfod = sequelize.define('deliveryfods', {
    awbpengembalian: {
      type: DataTypes.STRING
    },
    expedisipengiriman: {
      type: DataTypes.STRING
    },
    typedfod: {
      type: DataTypes.INTEGER
    },
    evidance: {
      type: DataTypes.STRING
    },
    keterangan: {
      type: DataTypes.TEXT
    },
    kondisibarang: {
      type: DataTypes.BOOLEAN
    },
    state: {
      type: DataTypes.INTEGER
    },
    products_pengembalian: {
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
    deliveryfod.belongsTo(models.auths, { as: "auth", foreignKey: "authId"})
    deliveryfod.belongsTo(models.transaksis, { foreignKey: "transaksisId"})
    deliveryfod.belongsTo(models.auths, { as: "authSpv", foreignKey: "spvAuthId"})
    deliveryfod.belongsTo(models.auths, { as: "authCC", foreignKey: "ccAuthId"})
    deliveryfod.belongsTo(models.ekpedisi, {foreignKey: "expedisiPengembalianId"})
  };

  return deliveryfod;
};
  