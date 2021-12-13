'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class unit extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  unit.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'unit',
  });
  return unit;
};

'use strict';

module.exports = (sequelize, DataTypes) => {

  const unit = sequelize.define('units', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
 
  }, {
    tableName: "units"
  });

  unit.associate = function(models) {
    unit.hasMany(models.products,{ onDelete: 'cascade' },{ constraints: true}, { foreginKey: "unit"})
  };

  return unit;
};