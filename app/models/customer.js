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
    notelp2: {
      type: DataTypes.STRING
    },
    email: {
      type: DataTypes.STRING,
      
    },
    alamat: {
      type: DataTypes.TEXT,
    },
    kelurahan: {
      type: DataTypes.STRING
    },
    rt: {
      type: DataTypes.INTEGER,
    },
    rw: {
      type: DataTypes.INTEGER,
    },
    pekerjaan: {
      type: DataTypes.STRING,
    },
    memoid: {
      type: DataTypes.INTEGER,
    },
    jeniskelamin: {
      type: DataTypes.STRING,
    },
    postalcode: {
      type: DataTypes.STRING,
    },
    provinceId: {
      type: DataTypes.INTEGER,
    },
    cityregencyId: {
      type: DataTypes.INTEGER,
    },
    districtId: {
      type: DataTypes.INTEGER,
    },
    
  }, {
    tableName: "customers"
  });
  customer.associate = function(models) { 
    customer.hasMany(models.transaksis,{ onDelete: 'cascade' },{ constraints: true}, { foreginKey: "customer"})
    customer.belongsTo(models.province , { foreginKey: "provinceId"})
    customer.belongsTo(models.cityregencies , { foreginKey: "cityregencyId"})
    customer.belongsTo(models.districts , { foreginKey: "districtId"})


  };

  return customer;
};