'use strict';

module.exports = (sequelize, DataTypes) => {

  const district = sequelize.define('districts', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
 
  }, {
    tableName: "districts"
  });

  district.associate = function(models) {
    district.hasMany(models.warehouses,{ onDelete: 'cascade' },{ constraints: true}, { foreginKey: "district"})
  };

  return district;
};