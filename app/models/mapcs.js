'use strict';

module.exports = (sequelize, DataTypes) => {

  const mapcs = sequelize.define('mapcs', {
    status: {
      type: DataTypes.BOOLEAN
    },
  }, {
    tableName: "mapcs"
  });

  mapcs.associate = function(models) {
    mapcs.belongsTo(models.auths,{ onDelete: 'cascade' },{ constraints: true}, { foreignKey: "authId"})
    mapcs.belongsTo(models.domains, { foreginKey: "domainId"})
  };

  return mapcs;
};