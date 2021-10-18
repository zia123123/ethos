'use strict';

module.exports = (sequelize, DataTypes) => {

  const price = sequelize.define('prices', {
    typeTransaksi: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    hpp: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    start: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    end: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    namadomain: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    keterangan: {
      type: DataTypes.TEXT,
      allowNull: false,
    }
  
  }, {
    tableName: "prices"
  });

  price.associate = function(models) {
    price.belongsTo(models.products,{ onDelete: 'cascade' },{ constraints: true}, { foreignKey: "productId"})
  };

  return price;
};