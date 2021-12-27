'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tagihan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  tagihan.init({
    namaproduct: DataTypes.STRING,
    pembayaran: DataTypes.STRING,
    domain: DataTypes.STRING,
    namabank: DataTypes.STRING,
    totaltagihan: DataTypes.INTEGER,
    norekening: DataTypes.STRING,
    buktitagihan: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'tagihan',
  });
  return tagihan;
};