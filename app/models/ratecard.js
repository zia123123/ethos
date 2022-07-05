'use strict';
module.exports = (sequelize, DataTypes) => {

  const retur = sequelize.define('ratecard', 
    {
        gudang: {
        type: DataTypes.STRING
        },
        provinsi: {
        type: DataTypes.STRING
        },
        kabupaten_kota: {
        type: DataTypes.STRING
        },
        kecamatan: {
        type: DataTypes.STRING
        },
        paket: {
        type: DataTypes.STRING
        },
        region: {
        type: DataTypes.STRING
        },
        citycode: {
        type: DataTypes.STRING
        },
        harga: {
        type: DataTypes.INTEGER
        },
    }, 
    {
        tableName: "ratecard",
        timestamps: false
    },
  );
  retur.associate = function(models) {
    retur.belongsTo(models.ekpedisi, { foreignKey: "ekspedisiId"})
    
  };

  return retur;
};
  