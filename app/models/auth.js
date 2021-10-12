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
   
  };

  return auth;
};