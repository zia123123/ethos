'use strict';

module.exports = (sequelize, DataTypes) => {

  const forgetpassword = sequelize.define('forgetpasswords', {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    tableName: "forgetpasswords"
  });

  forgetpassword.associate = function(models) {
    
  };

  return forgetpassword;
};