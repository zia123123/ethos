'use strict';

module.exports = (sequelize, DataTypes) => {

  const province = sequelize.define('province', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
 
  }, {
    tableName: "reg_provinces"
  });

  province.associate = function(models) {

  //province.hasMany(models.transaksis,{ onDelete: 'cascade' },{ constraints: true}, { foreginKey: "province"})

  province.hasMany(models.warehouses)

  };

  return province;
};