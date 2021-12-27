'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class saldo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  saldo.init({
    namaproduct: DataTypes.STRING,
    sisasaldo: DataTypes.INTEGER,
    status: DataTypes.STRING,
    buktisaldo: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'saldo',
  });
  return saldo;
};