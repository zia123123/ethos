'use strict';

module.exports = (sequelize, DataTypes) => {

  const mappingproduct = sequelize.define('mappingproducts', {
    keterangan: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  
  }, {
    tableName: "mappingproducts"
  });

  mappingproduct.associate = function(models) {
    mappingproduct.belongsTo(models.products, { foreignKey: "productId"})
    mappingproduct.belongsTo(models.domains,{ foreignKey: "domainId"})
  };

  return mappingproduct;
};