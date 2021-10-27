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
    kecamatan: {
      type: DataTypes.STRING,
     
    },
    kelurahan: {
      type: DataTypes.STRING,
     
    },
    city: {
      type: DataTypes.STRING,
     
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
    customer.belongsTo(models.provinces,{ onDelete: 'cascade' },{ constraints: true}, { foreginKey: "provinceId"})
    customer.belongsTo(models.cityregencies,{ onDelete: 'cascade' },{ constraints: true}, { foreginKey: "cityregencyId"})
    
  };

  return customer;
};