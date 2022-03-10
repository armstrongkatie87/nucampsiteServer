const express = require('express');
const User = require('../models/user');
const passport = require('passport');//imported passport

const router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//signup handling rewritten to use passport local mongoose plugins register()
router.post('/signup', (req, res) => {
    User.register(
        new User({username: req.body.username}),//1st arg-new user created w/req name
        req.body.password,//2nd arg-password f/req
        err => {//3rd arg- callback() rec an err
            if (err) {//if err, then internal server err
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.json({err: err});
            } else {//if no err then authenticate() 
                passport.authenticate('local')(req, res, () => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({success: true, status: 'Registration Successful!'});
                });
            }
        }
    );
});

//inserted middlewear into post router and pass arg of local-enables passport auth on route, handles login, challenge for creds, parsing creds, so just need set up res for successful login
router.post('/login', passport.authenticate('local'), (req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: true, status: 'You are successfully logged in!'});
});

router.get('/logout', (req, res, next) => {
  if (req.session) {
      req.session.destroy();
      res.clearCookie('session-id');
      res.redirect('/');
  } else {
      const err = new Error('You are not logged in!');
      err.status = 401;
      return next(err);
  }
});

module.exports = router;
