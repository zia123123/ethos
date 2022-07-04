module.exports = (sequelize, DataTypes) => {

  const mutation_detail = sequelize.define('mutation_details', {
    date: {
      type: DataTypes.DATE,
    },
    bank: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    debit: {
      type: DataTypes.STRING,
    },
    invoice: {
      type: DataTypes.STRING
    },
    kredit: {
      type: DataTypes.INTEGER
    },
    saldo: {
      type: DataTypes.INTEGER
    },
    norekening: {
      type: DataTypes.STRING
    },
  }, {
    tableName: "mutation_details"
  });
  mutation_detail.associate = function(models) {
    mutation_detail.belongsTo(models.mutation, { foreignKey: "mutationId"})
    mutation_detail.belongsTo(models.transaksis, { foreignKey: "transaksiId"})
  };

  return mutation_detail;
};
  