/**
 * Created by Den_F on 04-10-2016.
 */
var login = require('./login');
var signup = require('./signup');
var room = require('./room');
var mongoose = require('mongoose');

module.exports = function(passport){

    // Passport needs to be able to serialize and deserialize users to support persistent login sessions
    passport.serializeUser(function(user, done) {
        //console.log('serializing user: ');console.log(user);
        done(null, user._id);
    });

    passport.deserializeUser(function(id, done) {
        mongoose.model('chatUserDb').findById(id, function(err, user) {
            //console.log('deserializing user:',user);
            done(err, user);
        });
    });

    // Setting up Passport Strategies for Login and SignUp/Registration
    login(passport);
    signup(passport);
    //room(passport);

}