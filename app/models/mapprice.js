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
    mapprice.belongsTo(models.productId, { foreginKey: "productId"})
    mapprice.belongsTo(models.groupId, { foreginKey: "groupId"})
  };

  return mapprice;
};