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
        Staff.findOne ({
            where: {
                id_number: jwt_payload.id_number,
                identity:jwt_payload.identity
            }
        }).then (user =>{
            if (user){
                return done(null,user);
            }
            return done(null,false);
        }).catch(error => {
            console.log (error);
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
                Admin.findOne ({
                    where: {
                        username: jwt_payload.username
                    }
                }).then (user =>{
                    if (user){
                        return done(null,user);
                    }
                    return done(null,false);
                }).catch(error => {
                    console.log (error);
                })
            })
        })
    }));
};
