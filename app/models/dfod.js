'use strict';
module.exports = (sequelize, DataTypes) => {

  const dfod = sequelize.define('dfods', {
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
    evidance: {
      type: DataTypes.STRING
    },
    transaksi_Id: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    keterangan: {
      type: DataTypes.TEXT
    },
    state: {
      type: DataTypes.INTEGER
    },
  }, {
    tableName: "dfods"
  });
  dfod.associate = function(models) {
  };

  return dfod;
};
  