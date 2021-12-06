'use strict';

module.exports = (sequelize, DataTypes) => {

  const province = sequelize.define('provinces', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
 
  }, {
    tableName: "provinces"
  });

  province.associate = function(models) {

  province.hasMany(models.transaksis,{ onDelete: 'cascade' },{ constraints: true}, { foreginKey: "province"})
  province.hasMany(models.customers,{ onDelete: 'cascade' },{ constraints: true}, { foreginKey: "province"})

  };

  return province;
};