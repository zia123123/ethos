'use strict';

module.exports = (sequelize, DataTypes) => {

  const iklan = sequelize.define('iklan', {
    domainId: {
      type: DataTypes.INTEGER
    },
    productId: {
      type: DataTypes.INTEGER
    },
    namacs: {
      type: DataTypes.STRING
    },
    status: {
      type: DataTypes.BOOLEAN
    },
  }, {
    tableName: "iklans"
  });

  iklan.associate = function(models) {
    iklan.belongsTo(models.domains, { foreginKey: "domainId"})
    iklan.belongsTo(models.products, { foreginKey: "productId"})
  };

  return iklan;
};
