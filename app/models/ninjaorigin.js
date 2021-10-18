'use strict';

module.exports = (sequelize, DataTypes) => {

  const ninjaorigin = sequelize.define('ninjaorigins', {
    origin: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    index: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    tableName: "ninjaorigins"
  });

  ninjaorigin.associate = function(models) {
    ninjaorigin.hasMany(models.warehouses,{ onDelete: 'cascade' },{ constraints: true}, { foreginKey: "ninjaorigin"})

  };

  return ninjaorigin;
};