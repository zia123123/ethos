'use strict';

module.exports = (sequelize, DataTypes) => {

  const domain = sequelize.define('domains', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  }, {
    tableName: "domains"
  });

  domain.associate = function(models) {
    domain.belongsTo(models.auths,{ onDelete: 'cascade' },{ constraints: true}, { foreignKey: "authId"})
  };

  return domain;
};