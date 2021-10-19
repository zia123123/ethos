'use strict';

module.exports = (sequelize, DataTypes) => {

  const mappingadvertiser = sequelize.define('mappingadvertisers', {

    start: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    expired: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    keterangan: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
 
  }, {
    tableName: "mappingadvertisers"
  });

  mappingadvertiser.associate = function(models) {
    mappingadvertiser.belongsTo(models.auths, { foreignKey: "advertiserId"})
    mappingadvertiser.belongsTo(models.auths, { foreignKey: "cserviceId"})

  };

  return mappingadvertiser;
};