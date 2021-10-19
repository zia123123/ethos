'use strict';

module.exports = (sequelize, DataTypes) => {
  const auth = sequelize.define('auths', {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    firstname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  }, {
    tableName: "auths"
  });

  auth.associate = function(models) {
    auth.hasMany(models.domains,{ onDelete: 'cascade' },{ constraints: true}, { foreginKey: "auth"})
    auth.hasMany(models.mappingadvertisers,{ onDelete: 'cascade' },{ constraints: true}, { foreginKey: "auth"})
  };

  return auth;
};