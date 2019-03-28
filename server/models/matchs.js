module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    'match',
    {
      user_id1: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
      },
      user_id2: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('now()')
      }
    },
    {
      charset: 'utf8',
      collate: 'utf8_general_ci',
      timestamps: false
    }
  );
};
