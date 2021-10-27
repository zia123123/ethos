'use strict';

module.exports = (sequelize, DataTypes) => {

  const groupcs = sequelize.define('groupcs', {
    nama: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    tableName: "groupcs"
  });

  groupcs.associate = function(models) {
    
   
  };

  return groupcs;
};
