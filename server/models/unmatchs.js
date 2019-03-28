module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
      'unmatch',
      {
        cause_ID : {
             type : DataTypes.STRING(64),
             allowNull : true
        },
        user_id : {
            type: DataTypes.INTEGER.UNSIGNED,
        },
        timestamps : {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize.literal('now()')
          },
    },
    {
        charset: 'utf8',
        collate: 'utf8_general_ci',
        timestamps: false,
      }
    )
};