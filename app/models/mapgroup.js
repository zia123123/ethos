'use strict';

module.exports = (sequelize, DataTypes) => {

  const mapgroup = sequelize.define('mapgroup', {
    status: {
      type: DataTypes.BOOLEAN,
    },
    type: {
      type: DataTypes.STRING,
    },
  
  }, {
    tableName: "mapgroups"
  });

  mapgroup.associate = function(models) {
    mapgroup.belongsTo(models.group, { foreginKey: "groupId"})
    mapgroup.belongsTo(models.auths, { foreginKey: "authId"})
   
  };
  return mapgroup;
};
