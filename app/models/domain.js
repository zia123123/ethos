'use strict';

module.exports = (sequelize, DataTypes) => {

  const domain = sequelize.define('domains', {
    name: {
      type: DataTypes.STRING,
    },
    url: {
      type: DataTypes.STRING,
    },
    type: {
      type: DataTypes.STRING,
    },
    nameproduct: {
      type: DataTypes.STRING
    },
    biayaiklan: {
      type: DataTypes.BIGINT
    },

    // buktisaldo: {
    //   type: DataTypes.STRING
    // },
    // buktitagihan: {
    //   type: DataTypes.STRING
    // },
    // nBuktiSaldo: {
    //   type: DataTypes.STRING
    // },
    // nBuktiTagihan: {
    //   type: DataTypes.STRING
    // },

    status: {
      type: DataTypes.BOOLEAN
    },
    
    memo: {
      type: DataTypes.TEXT,
     
    },
  }, {
    tableName: "domains"
  });

  domain.associate = function(models) {
    domain.belongsTo(models.auths,{ onDelete: 'cascade' },{ constraints: true}, { foreignKey: "authId"})
    domain.belongsTo(models.products,{ onDelete: 'cascade' },{ constraints: true}, { foreignKey: "productId"})

  };

  return domain;
};