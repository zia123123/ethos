'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class reg_district extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  reg_district.init({
    regency_id: DataTypes.CHAR,
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'reg_district',
  });
  return reg_district;
};