// ./models/pictures.js

module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    'picture',
    {
      picture_address: {
        type: DataTypes.STRING(100),
        allowNull: true
      }
    },
    {
      charset: 'utf8',
      collate: 'utf8_general_ci',
      timestamps: false
    }
  );
};
