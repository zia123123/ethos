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
    destinations: {
      type: DataTypes.STRING,
    },
    cityregencyId: {
      type: DataTypes.INTEGER,
    },
    districtId: {
      type: DataTypes.INTEGER,
    },
    provinsiname:{
      type: DataTypes.STRING,
    },
    groupId: {
      type: DataTypes.INTEGER
    },
    cityname:{
      type: DataTypes.STRING,
    },
    idorigin: {
      type: DataTypes.STRING
    },
    districtname:{
      type: DataTypes.STRING,
    },
  }, {
    tableName: "customers"
  });
  customer.associate = function(models) { 
    customer.hasMany(models.transaksis,{ onDelete: 'cascade' },{ constraints: true}, { foreginKey: "customer"})
    customer.hasMany(models.keranjangs)
    customer.belongsTo(models.auths, { foreginKey: "authId"})
    customer.belongsTo(models.warehouses, { foreginKey: "warehouseId"})
  };

  return customer;
};