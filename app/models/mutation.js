'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class mutation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      mutation.hasMany(models.mutation_details)
    }
  };
  mutation.init({
  }, {
    sequelize,
    modelName: 'mutation',
  });
  return mutation;
};