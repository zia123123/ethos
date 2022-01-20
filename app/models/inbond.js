'use strict';

module.exports = (sequelize, DataTypes) => {

  const inbond = sequelize.define('inbond', {
    nopo: {
      type: DataTypes.STRING
    },
    totalharga: {
      type: DataTypes.INTEGER
    },
    totalterbayar: {
      type: DataTypes.INTEGER
    },
    status: {
      type: DataTypes.STRING
    },
  }, {
    tableName: "inbonds"
  });

  inbond.associate = function(models) {
    inbond.belongsTo(models.suppliers, { foreginKey: "supplierId"})
  };
  return inbond;
};

