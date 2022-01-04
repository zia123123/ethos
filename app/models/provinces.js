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
  province.hasMany(models.customers)
  province.hasMany(models.warehouses)
  province.hasMany(models.transaksis)

  };

  return province;
};