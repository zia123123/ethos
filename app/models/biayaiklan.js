'use strict';

module.exports = (sequelize, DataTypes) => {

  const biayaiklan = sequelize.define('biayaiklan', {
    domainId: {
      type: DataTypes.INTEGER
    },
    productId: {
      type: DataTypes.INTEGER
    },
    namacs: {
      type: DataTypes.STRING
    },
    biayaiklan: {
      type: DataTypes.INTEGER
    },
    status: {
      type: DataTypes.BOOLEAN
    },
  }, {
    tableName: "biayaiklans"
  });

  biayaiklan.associate = function(models) {
    biayaiklan.belongsTo(models.domains, { foreginKey: "domainId"})
    biayaiklan.belongsTo(models.products, { foreginKey: "productId"})
  };

  return biayaiklan;
};
