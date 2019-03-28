const sequelize = require('./models').sequelize;
const {
  User,
  Picture,
  Interest,
  Like,
  Match,
  // Unmatch,
  Sequelize: { Op }
} = require('./models');
sequelize.query('SET NAMES utf8;');

module.exports = {
  user: {
    getAllUsers: callback => {
      User.findAll({
        include: [{ model: Interest }, { model: Picture }]
      })
        .then(data => {
          callback(data);
        })
        .catch(err => {
          throw err;
        });
    },
    getUser: (user_id, callback) => {
      User.findOne({
        where: { id: user_id },
        include: [{ model: Interest }, { model: Picture }]
      })
        .then(data => {
          callback(data);
        })
        .catch(err => {
          throw err;
        });
    },
    delete: (user_id, callback) => {
      User.destroy({ where: { id: user_id } })
        .then(data2 => {
          callback(data1);
        })
        .catch(err => {
          throw err;
        });
    }
  },
  login: {
    mailCheck: (body, callback) => {
      User.findOne({
        where: { email: body.email }
      })
        .then(data => {
          callback(data);
        })
        .catch(err => {
          throw err;
        });
    },
    signup: (body, callback) => {
      User.create({
        nickname: body.nickname,
        email: body.email,
        password: body.hasher_password,
        age: body.age,
        gender: body.gender,
        about_me: body.about_me
      })
        .then(result => {
          callback(result);
        })
        .catch(err => {
          throw err;
        });
    },
    login: (body, callback) => {
      User.findOne({
        where: { email: body.email }
      })
        .then(data => {
          callback(data);
        })
        .catch(err => {
          throw err;
        });
    }
  },
  like: {
    likeCheck: (body, callback) => {
      Like.findAll({
        where: {
          user_id: body.user_id,
          favorite_user_id: body.favorite_user_id
        }
      })
        .then(data => {
          callback(data);
        })
        .catch(err => {
          throw err;
        });
    },
    like: (body, callback) => {
      Like.create({
        like: body.like,
        favorite_user_id: body.favorite_user_id,
        user_id: body.user_id
      })
        .then(data => {
          Like.findOne({
            where: {
              user_id: data.favorite_user_id,
              favorite_user_id: data.user_id
            }
          }).then(result => {
            if (result) {
              // Match table add query
              Match.create({
                user_id1: data.user_id,
                user_id2: data.favorite_user_id
              });
            }
            callback(result);
          });
        })
        .catch(err => {
          throw err;
        });
    }
  },
  match: {
    getUsers: (id, callback) => {
      Match.findAll({
        where: { [Op.or]: [{ user_id1: id }, { user_id2: id }] }
      })
        .then(data => {
          callback(data);
        })
        .catch(err => {
          throw err;
        });
    },
    unmatch: (email, callback) => {}
  },
  update: {
    picture: (id, file, callback) => {
      Picture.destroy({ where: { user_id: id } });
      Picture.create({ picture_address: file.location, user_id: id })
        .then(data => {
          callback(data);
        })
        .catch(err => {
          throw err;
        });
    },
    interest: (id, body, callback) => {
      Interest.destroy({ where: { user_id: id } });
      for (let i = 0; i < body.length; i++) {
        Interest.create({ keyword: body[i], user_id: id });
      }
      Interest.findAll({ where: { user_id: id } })
        .then(data => {
          callback(body);
        })
        .catch(err => {
          throw err;
        });
    }
  }
};
