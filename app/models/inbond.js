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
    totalbarangpesan: {
      type: DataTypes.INTEGER
    },
    totalbarangsampai: {
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
    inbond.hasMany(models.catalog, { foreginKey: "inbond"})
    inbond.hasMany(models.dropout)

  };
  return inbond;
};

