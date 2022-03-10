const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/user');
const JwtStrategy = require('passport-jwt').Strategy;//imported jwt strategy constructor
const ExtractJwt = require('passport-jwt').ExtractJwt;//imported extract jwt, obj provides helper()
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

const config = require('./config.js');//imported config file created 

exports.local = passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//export token
exports.getToken = function(user) {
    return jwt.sign(user, config.secretKey, {expiresIn: 3600});
};

//config jwt strategy for passport
const opts = {};//declared; contains options for jwt strategy; initialized as empty obj
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();//set prop 1 how jwt extracted f/req
opts.secretOrKey = config.secretKey;//set prop 2 supplies jwt strategy w/key will assign to token

//export jwt strategy
exports.jwtPassport = passport.use(//takes instance of jwt strategy as arg
    new JwtStrategy(//jwt strategy constructor
        opts,//1st arg obj w/config options
        //2nd arg- verify callback f(x)...see docs passport-jwt-npm
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

//verifies incoming req f/authenticated user; set up verifyUser as shortcut 
exports.verifyUser = passport.authenticate('jwt', {session: false});