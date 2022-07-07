'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ekpedisi extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  ekpedisi.init({
    name: DataTypes.STRING,
    internal: DataTypes.BOOLEAN,
    rajaongkir: DataTypes.BOOLEAN,
    ratecard: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'ekpedisi',
  });
  return ekpedisi;
};