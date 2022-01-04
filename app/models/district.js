'use strict';

module.exports = (sequelize, DataTypes) => {

  const district = sequelize.define('districts', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
 
  }, {
    tableName: "reg_districts"
  });

  district.associate = function(models) {
    district.hasMany(models.warehouses)
    district.hasMany(models.customers)
    district.hasMany(models.transaksis)

  };

  return district;
};