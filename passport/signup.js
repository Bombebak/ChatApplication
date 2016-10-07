/**
 * Created by Den_F on 04-10-2016.
 */
var LocalStrategy   = require('passport-local').Strategy;
var User = require('../model/users');
var bCrypt = require('bcryptjs');
var mongoose = require('mongoose');

module.exports = function(passport){

    passport.use('signup', new LocalStrategy({
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) {

            findOrCreateUser = function(){
                // find a user in Mongo with provided username
                mongoose.model('chatUserDb').findOne({ 'username' :  username }, function(err, user) {
                    // In case of any error, return using the done method
                    if (err){
                        console.log('Error in SignUp: '+err);
                        return done(err);
                    }
                    // already exists
                    if (user) {
                        console.log('User already exists with username: '+username);
                        return done(null, false, req.flash('message','User Already Exists'));
                    } else {
                        // if there is no user with that email
                        // create the user
                        var username = req.body.username;
                        var password = req.body.password;
                        var email = req.body.email;
                        var avatarIcon = "images/avatarIcon1.png";
                        var newUser = mongoose.model('chatUserDb').create({
                            username : username,
                            password : createHash(password),
                            email: email,
                            rooms: [],
                            avatarIcon: avatarIcon
                        }, function (err, user) {
                            if (err) {
                                res.send("There was a problem adding the information to the database.");
                            } else {
                                //User has been created
                                console.log('POST creating new user: ' + user);
                                return done(null, newUser)
                            }
                        })

                    }
                });
            };
            // Delay the execution of findOrCreateUser and execute the method
            // in the next tick of the event loop
            process.nextTick(findOrCreateUser);
        })
    );

    // Generates hash using bCrypt
    var createHash = function(password){
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
    }

}