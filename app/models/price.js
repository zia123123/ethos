'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Price extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Price.init({
    typeTransaksi: DataTypes.STRING,
    hpp: DataTypes.INTEGER,
    price: DataTypes.BOOLEAN,
    stock: DataTypes.INTEGER,
    start: DataTypes.DATE,
    end: DataTypes.DATE,
    namadomain: DataTypes.STRING,
    url: DataTypes.STRING,
    keterangan: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Price',
  });
  return Price;
};