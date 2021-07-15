var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require("passport-jwt").ExtractJwt;

var User = require("../models/user");
var dbconfig = require("../config/dbconfig");

module.exports = function (passport) {
    var opts = {}

    opts.secretOrKey = dbconfig.secret;
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');

    passport.use(new JwtStrategy(opts, function(jwt_payload, done){

        User.find({id: jwt_payload.id},
            function(err, user){
                if(err){
                    return done(err, false);
                }
                if (user) {
                    return done(null, user);
                }
                else {
                    return done(null, false);
                }
            })

    }));

}