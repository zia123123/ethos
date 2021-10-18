'use strict';

module.exports = (sequelize, DataTypes) => {

  const cityregency = sequelize.define('cityregencies', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
 
  }, {
    tableName: "cityregencies"
  });

  cityregency.associate = function(models) {
   
  };

  return cityregency;
};

