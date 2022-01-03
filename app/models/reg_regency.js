'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class reg_regency extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  reg_regency.init({
    name: DataTypes.STRING,
    province_id: DataTypes.CHAR
  }, {
    sequelize,
    modelName: 'reg_regency',
  });
  return reg_regency;
};