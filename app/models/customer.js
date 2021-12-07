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
      allowNull: false,
      type: DataTypes.INTEGER,
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
    customer.belongsTo(models.provinces, { foreginKey: "provinceId"})   
    customer.belongsTo(models.districts, { foreginKey: "districtId"})   
    customer.belongsTo(models.cityregencies, { foreginKey: "cityregencyId"})   
    customer.hasMany(models.dataexpedisis,{ onDelete: 'cascade' },{ constraints: true}, { foreginKey: "customer"})
    customer.hasMany(models.transaksis,{ onDelete: 'cascade' },{ constraints: true}, { foreginKey: "customer"})

  };

  return customer;
};