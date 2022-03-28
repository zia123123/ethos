'use strict';
module.exports = (sequelize, DataTypes) => {

  const retur = sequelize.define('returs', {
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
  }, {
    tableName: "returs"
  });
  retur.associate = function(models) {
    retur.belongsTo(models.transaksis, { foreignKey: "transaksisId"})
    
  };

  return retur;
};
  