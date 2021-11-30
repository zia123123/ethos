'use strict';

module.exports = (sequelize, DataTypes) => {

  const customer = sequelize.define('customers', {
    nama: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    notelp: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    alamat: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    rt: {
      type: DataTypes.INTEGER,
    },
    rw: {
      type: DataTypes.INTEGER,
    },
    kelurahan: {
      type: DataTypes.STRING,
    },
    pekerjaan: {
      type: DataTypes.STRING,
    },
    city: {
      type: DataTypes.STRING,
    },
    memoid: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    province: {
       allowNull: false,
      type: DataTypes.STRING,
    },
    jeniskelamin: {
      type: DataTypes.CHAR,
    },
    postalcode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
 
  }, {
    tableName: "customers"
  });
  customer.associate = function(models) {
    customer.belongsTo(models.districts,{ onDelete: 'cascade' },{ constraints: true}, { foreginKey: "districtsId"})    
  };

  return customer;
};