'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class reg_province extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  reg_province.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'reg_province',
  });
  return reg_province;
};