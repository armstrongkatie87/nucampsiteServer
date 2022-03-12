const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken'); 

const config = require('./config.js');

exports.local = passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken = function(user) {
    return jwt.sign(user, config.secretKey, {expiresIn: 3600});
};

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(
    new JwtStrategy(
        opts,
        (jwt_payload, done) => {
            console.log('JWT payload:', jwt_payload);
            User.findOne({_id: jwt_payload._id}, (err, user) => {
                if (err) {
                    return done(err, false);
                } else if (user) {
                    return done(null, user);
                } else {
                    return done(null, false);
                }
            });
        }
    )
);

exports.verifyUser = passport.authenticate('jwt', {session: false});

//Task 1: Set up the verifyAdmin() middleware Check for admin property: This function will check if a user has admin privileges. In order to perform this check, recall that all user documents include a field called admin set to Boolean true or false, false by default. When a user is authenticated in the verifyUser() function, Passport will load a user property to the req object. This will be available to you as long as the verifyAdmin() middleware follows after the verifyUser() middleware when they are executed in the Express routing methods. Then from the req object, you will be able to obtain the value of the admin flag by using the following expression: req.user.admin You can use this to find out if the user is an administrator. Allow admins to pass to the next middleware: You will have the verifyAdmin() function return next(); if the user is an admin. If not, create a new Error object with the message "You are not authorized to perform this operation!", set its status property to 403, and return next(err).

exports.verifyAdmin = function(req, res, next){
    if (req.user.admin === true){
        return next();
    } else {
        const err = new Error('You are not authorized to perform this operation!');
        err.status = 403;
        return next(err);
    }
}; 