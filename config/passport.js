const JwtStrategy = require ('passport-jwt').Strategy,
    ExtractJwt = require ('passport-jwt').ExtractJwt;
const User = require ('../models/user');
const Staff = require ('../models/staff');
const Admin = require ('../models/admin');
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken ();
opts.secretOrKey = 'secret';
module.exports = passport => {
    passport.use (new JwtStrategy (opts, (jwt_payload, done) => {
        User.findOne ({
            where: {
                id_number: jwt_payload.id_number
            }
        }).then (user =>{
            if (user){
                return done(null,user);
            }
            return done(null,false);
        }).catch(error => {
            console.log (error);
            Staff.findOne ({
                where: {
                    id_number: jwt_payload.id_number
                }
            }).then (user2 =>{
                if (user){
                    return done(null,user2);
                }
                return done(null,false);
            }).catch(error => {
                console.log (error);
                Admin.findOne ({
                    where: {
                        username: jwt_payload.username
                    }
                }).then (user3 =>{
                    if (user3){
                        return done(null,user3);
                    }
                    return done(null,false);
                }).catch(error => {
                    console.log (error);
                })
            })
        })
    }));
};
