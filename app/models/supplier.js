'use strict';

module.exports = (sequelize, DataTypes) => {

  const supplier = sequelize.define('suppliers', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address_line_one: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    address_line_two: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    district: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sub_district: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    bank_account_no: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name_of_director: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    bank_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    tableName: "suppliers"
  });

  supplier.associate = function(models) {
 
  
  };

  return supplier;
};