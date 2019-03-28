'use strict';

const path = require('path');
const Sequelize = require('sequelize');

const env = process.env.NODE_ENV || 'development';
const config = require(path.join(__dirname, '..', 'config', 'config.json'))[
  env
];
const db = {};

let sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config,
  {
    define: {
      charset: 'utf8',
      collate: 'utf8_general_ci'
    }
    // pool: {
    //   max: 10,
    //   min: 0,
    //   idle: 10000
    // }
  }
);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.log('Unable to connect to the database: ', err);
  });

db.User = require('./users')(sequelize, Sequelize);
db.Picture = require('./pictures')(sequelize, Sequelize);
db.Interest = require('./interest')(sequelize, Sequelize);
db.Like = require('./like')(sequelize, Sequelize);
db.Match = require('./matchs')(sequelize, Sequelize);
// db.Unmatch = require('./unmatchs')(sequelize, Sequelize);

// User hasMany Picture
db.User.hasMany(db.Picture, { foreignKey: 'user_id', sourceKey: 'id' });
db.Picture.belongsTo(db.User, {
  foreignKey: 'user_id',
  targetKey: 'id'
});
// User hasMany Character
db.User.hasMany(db.Interest, { foreignKey: 'user_id', sourceKey: 'id' });
db.Interest.belongsTo(db.User, {
  foreignKey: 'user_id',
  targetKey: 'id'
});
// User hasMany Like
db.User.hasMany(db.Like, { foreignKey: 'user_id', sourceKey: 'id' });
db.Like.belongsTo(db.User, {
  foreignKey: 'user_id',
  targetKey: 'id'
});

// // Like hasOne Match
// db.Like.hasMany(db.Match, {
//   foreignKey: 'match_id',
//   sourceKey: 'favorite_user_id'
// });
// db.Match.belongsTo(db.Like, {
//   foreignKey: 'match_id',
//   targetKey: 'favorite_user_id'
// });
// db.Like.hasMany(db.Match, { foreignKey: 'Match_ID', sourceKey: 'favorite_user_id' });
// db.Match.belongsTo(db.Like, {
//   foreignKey: 'Match_ID',
//   targetKey: 'favorite_user_id'
// });
// // User hasMany Unmatch
// db.Match.hasMany(db.Unmatch, { foreignKey: 'Unmatch_ID', sourceKey: 'Match_ID' });
// db.Unmatch.belongsTo(db.Match, {
//   foreignKey: 'Unmatch_ID',
//   targetKey: 'Match_ID'
// });

db.secret = '5432534123$#@!$@!#%';

module.exports = db;
