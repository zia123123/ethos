'use strict';
module.exports = (sequelize, DataTypes) => {
  const dfod = sequelize.define('dfod', {
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
    // evidance2: {
    //   type: DataTypes.STRING
    // },
    // evidance3: {
    //   type: DataTypes.STRING
    // },
    // evidance4: {
    //   type: DataTypes.STRING
    // },
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
    dfod.belongsTo(models.transaksis, { foreignKey: "transaksisId"})
  };

  return dfod;
};
  