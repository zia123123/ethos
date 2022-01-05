'use strict';

module.exports = (sequelize, DataTypes) => {

  const domain = sequelize.define('domains', {
    url: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.BOOLEAN
    },

  }, {
    tableName: "domains"
  });

  domain.associate = function(models) {
    domain.belongsTo(models.auths,{ onDelete: 'cascade' },{ constraints: true}, { foreignKey: "authId"})
    domain.hasMany(models.iklan)
    domain.hasMany(models.biayaiklan)
  };

  return domain;
};