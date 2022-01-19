'use strict';

module.exports = (sequelize, DataTypes) => {

  const group = sequelize.define('group', {
    name: {
      type: DataTypes.STRING,
    },
    internal: {
      type: DataTypes.BOOLEAN,
    },
    status: {
      type: DataTypes.BOOLEAN,
    },
  }, {
    tableName: "groups"
  });

  group.associate = function(models) {
    group.belongsTo(models.auths, { foreginKey: "authId"})
    group.hasMany(models.mapgroup,{ foreginKey: "group"})
  };
  return group;
};
