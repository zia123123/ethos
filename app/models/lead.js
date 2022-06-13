'use strict';

module.exports = (sequelize, DataTypes) => {

  const lead = sequelize.define('lead', {
    sumber: {
      type: DataTypes.STRING
    },
  }, {
    tableName: "leads"
  });

  lead.associate = function(models) {
    lead.belongsTo(models.auths, { foreginKey: "authId"})
    lead.belongsTo(models.products, { foreginKey: "productId"})
  };
  return lead;
};