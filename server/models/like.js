module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
      'like',
      {
       like: {
        type: DataTypes.BOOLEAN,
       },
       favorite_user_id : {
        type: DataTypes.INTEGER.UNSIGNED,
       }
      },
      {
        charset: 'utf8',
        collate: 'utf8_general_ci',
        timestamps: false,
      }
  )};