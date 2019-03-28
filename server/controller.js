const model = require('./model');
const path = require('path');
const sha256 = require('sha256');
const salt = require(path.join(__dirname, '..', 'server/config', 'config.json'))
  .salt;
function enc(pwd, salt, email) {
  return sha256(pwd + salt + email);
}
let AWS = require('aws-sdk');
AWS.config.loadFromPath(
  path.join(__dirname, '..', '/server/config', 'awsconfig.json')
);
let s3 = new AWS.S3();
let multer = require('multer');
let multerS3 = require('multer-s3');
let upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'hoa-hoa-project',
    key: (req, file, cb) => {
      let extension = path.extname(file.originalname);
      cb(null, Date.now().toString() + extension);
    },
    acl: 'public-read-write'
  }),
  limits: { fileSize: 5 * 1024 * 1024 }
});

module.exports = {
  needs: () => upload,
  api: {
    get: (req, res) => {
      res.send("Hello!! It's Hoa?Hoa! Project Server.");
    }
  },
  user: {
    getAllUsers: (req, res) => {
      model.user.getAllUsers(data => {
        res.send(data);
      });
    },
    getUser: (req, res) => {
      let id = parseInt(req.params.id, 10);
      if (!id) {
        return res.status(400).json({ error: 'Incorrect Id' });
      }
      model.user.getUser(id, data => {
        if (data === null) {
          return res.status(404).json({ error: 'Unknown user' });
        }
        res.send(data);
      });
    },
    delete: (req, res) => {
      let id = parseInt(req.params.id, 10);
      if (!id) {
        return res.status(400).json({ error: 'Incorrect Id' });
      }
      model.user.delete(id, data => {
        res.status(204).send(`Delete Done: ${data}`);
      });
    }
  },
  login: {
    signup: (req, res) => {
      let body = req.body;
      model.login.mailCheck(body, data => {
        if (data !== null) {
          // 이미 가입되어 있는 이메일이라면
          return res
            .json(400, { error: 'This email is already defined' })
            .end();
        }

        let email_check = null;
        let regExp = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
        if (body.email.match(regExp) != null) {
          email_check = true;
        } else {
          email_check = false;
        }
        if (email_check === false) {
          return res.json(400, { error: body.email + ' is not email' }).end();
        }
        if (body.password.length === 0) {
          return res.json(400, { error: 'Please input your password' }).end();
        }
        if (body.nickname.length === 0) {
          return res.json(400, { error: 'Please input your nickname' }).end();
        }
        if (body.gender !== 'man' && body.gender !== 'woman') {
          return res
            .json(400, { error: body.gender + ' should be "man" or "woman"' })
            .end();
        }
        if (body.age < 18) {
          return res
            .json(400, {
              error: 'Only adult can join! (Your age is ' + body.age + ')'
            })
            .end();
        }
        body.hasher_password = enc(body.password + salt + body.email);
        model.login.signup(body, data => {
          //   console.log(data);
          res.json(201, data);
        });
      });
    },
    login: (req, res) => {
      let body = req.body;
	    console.log('body: ', body);
      if (req.session.displayName === body.email) {
        return res.json('You are already logged in.');
      }
      let email_check = null;
      let regExp = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
      if (body.email.match(regExp) != null) {
        email_check = true;
      } else {
        email_check = false;
      }
      if (email_check === false) {
        return res.json(400, { error: body.email + ' is not email' }).end();
      }

      body.hard_password = enc(body.password + salt + body.email);
      model.login.login(body, data => {
        if (data === null) {
          return res.json(400, { error: 'This email is undefined!' }).end();
        }
        if (data.password === body.hard_password && data.email === body.email) {
          req.session.displayName = data.email;
		console.log('req.session val: ', req.session.displayName);
          let send_obj = {};
          send_obj['id'] = data.id;
          send_obj['nickname'] = data.nickname;
          send_obj['about_me'] = data.about_me;
          res.send(send_obj);
        } else {
          return res.status(400).json('Incorrect user information.');
        }
      });
    },
    logout: (req, res) => {
      let displayName = { email: req.session.displayName };
      if (!displayName) {
        return res.json('You are not logged in yet.');
      }
      model.login.mailCheck(displayName, data => {
        if (data === null) {
          delete req.session.displayName;
          return res.json(201, 'session delete complete!');
        }
        if (displayName) {
          delete req.session.displayName;
          res.json(201, `Goodbye, ${data.nickname}(${data.email})`);
        }
      });
    }
  },
  like: (req, res) => {
    let body = req.body;
    let user_favorite = body.favorite_user_id;
   console.log('like: ', req.session.displayName);
	  if (!req.session.displayName) {
      return res.json(400, { error: 'Please Login!' });
    }
    if (body.user_id === user_favorite) {
      return res.json(400, {
        error: '"user_id" and "favorite_user_id" are the same.'
      });
    }
    model.user.getUser(user_favorite, data => {
      if (data === null) {
        return res.json(400, { error: 'This user not defined' });
      }
      model.user.getUser(body.user_id, data => {
        if (data === null) {
          return res.json(400, { error: 'User table has no data' });
        }
        model.like.likeCheck(body, data => {
          if (data.length !== 0) {
            return res.json(400, { error: 'This data already exists.' }).end();
          }
          model.like.like(body, data => {
            res.json(data).end();
          });
        });
      });
    });
  },
  match: {
    users: (req, res) => {
      let id = req.params.id;
      model.match.getUsers(id, data => {
        if (data.length === 0) {
          return res.send('There are no matches');
        }
        res.send(data);
      });
    },
    unmatch: (req, res) => {
      let email = req.session.displayName;
      if (!email) {
        return res.json({ error: 'Please login!' });
      }
      model.match.unmatch(email, data => {
        res.send(data);
      });
    }
  },
  update: {
    picture: (req, res) => {
      let email = req.session.displayName;
      //if (!email) {
       // return res.json({ error: 'Please login!' });
     // }
      let id = req.params.id;
      let imgFile = req.file;
      model.update.picture(id, imgFile, data => {
        res.send(data);
      });
    },
    interest: (req, res) => {
      let id = req.params.id;
      let body = req.body.interest;
      model.update.interest(id, body, data => {
        res.status(201).send(data);
      });
    }
  }
};
