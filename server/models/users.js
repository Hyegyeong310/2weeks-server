module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    'user',
    {
      nickname: {
        type: DataTypes.STRING(25),
        allowNull: true,
        unique: false
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true
      },
      age: {
        type: DataTypes.STRING,
        allowNull: true
      },
      gender: {
        type: DataTypes.ENUM('man', 'woman'),
        allowNull: true
      },
      about_me: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      create_at: {
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
