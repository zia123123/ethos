'use strict';

module.exports = (sequelize, DataTypes) => {

  const cityregency = sequelize.define('cityregencies', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
 
  }, {
    tableName: "reg_regencies"
  });

  cityregency.associate = function(models) {
  cityregency.hasMany(models.transaksis)
  cityregency.hasMany(models.customers)
  cityregency.hasMany(models.warehouses)

  };

  return cityregency;
};

