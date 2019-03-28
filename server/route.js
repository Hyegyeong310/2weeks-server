const express = require('express');
const router = express.Router();
const controller = require('./controller');
const upload = controller.needs();

router.get('/', (req, res) => res.redirect('/api'));
router.get('/api', controller.api.get);

router.get('/api/users', controller.user.getAllUsers);
router.get('/api/users/:id', controller.user.getUser);
router.delete('/api/users/:id', controller.user.delete);

router.post('/api/signup', controller.login.signup);
router.post('/api/login', controller.login.login);
router.post('/api/logout', controller.login.logout);

router.post('/api/like', controller.like);

router.get('/api/users/match/:id', controller.match.users);
router.post('/api/users/unmatch', controller.match.unmatch);

let type = upload.single('file');
router.post('/api/users/:id/picture', type, controller.update.picture);
router.post('/api/users/:id/interest', controller.update.interest);

module.exports = router;
