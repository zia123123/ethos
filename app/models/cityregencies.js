'use strict';

module.exports = (sequelize, DataTypes) => {

  const cityregency = sequelize.define('cityregencies', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
 
  }, {
    tableName: "cityregencies"
  });

  cityregency.associate = function(models) {
  cityregency.hasMany(models.transaksis,{ onDelete: 'cascade' },{ constraints: true}, { foreginKey: "cityregency"})
  cityregency.hasMany(models.customers,{ onDelete: 'cascade' },{ constraints: true}, { foreginKey: "cityregency"})

  };

  return cityregency;
};

