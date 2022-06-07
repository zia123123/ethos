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
  }, {
    tableName: "mutation_details"
  });
  mutation_detail.associate = function(models) {
    mutation_detail.belongsTo(models.mutation, { foreignKey: "mutationId"})
  };

  return mutation_detail;
};
  