'use strict';

module.exports = (sequelize, DataTypes) => {

  const mapprice = sequelize.define('mapprice', {
    status: {
      type: DataTypes.BOOLEAN
    },
    hpp: {
      type: DataTypes.INTEGER
    },
  }, {
    tableName: "mapprices"
  });

  mapprice.associate = function(models) {
    mapcs.belongsTo(models.productId, { foreginKey: "productId"})
    mapcs.belongsTo(models.groupId, { foreginKey: "groupId"})
  };

  return mapprice;
};