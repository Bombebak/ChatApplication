var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

var isAuthenticated = function (req, res, next) {
  // if user is authenticated in the session, call the next() to call the next request handler
  // Passport adds this method to request object. A middleware is allowed to add properties to
  // request and response objects
  if (req.isAuthenticated())
    return next();
  // if the user is not authenticated then redirect him to the login page
  res.redirect('/');
}

module.exports = function(passport){

  /* GET login page. */
  router.get('/', function(req, res) {
    // Display the Login page with any flash message, if any
    res.render('index', { message: req.flash('message') });
  });

  /* Handle Login POST */
  router.post('/login', passport.authenticate('login', {
    successRedirect: '/home',
    failureRedirect: '/',
    failureFlash : true
  }));

  /* GET Registration Page */
  router.get('/signup', function(req, res){
    res.render('register',{message: req.flash('message')});
  });

  /* Handle Registration POST */
  router.post('/signup', passport.authenticate('signup', {
    successRedirect: '/home',
    failureRedirect: '/signup',
    failureFlash : true
  }));

  /* GET Home Page */
  router.get('/home', isAuthenticated, function(req, res){
    mongoose.model('chatRoomDb').find({}, function (err, rooms) {
      if (err) {
        return console.error(err);
      } else {
        //console.log(JSON.stringify(rooms));
        res.format({
          html: function(){
            res.render("home", {
              user: req.user,rooms: rooms, title: 'Home'
            });
          },
          //JSON responds showing the updated values
          json: function(){
            res.json(rooms);
          }
        });

      }
    });
    //res.render('home', { user: req.user, title: "Home" });,
  });

  /* GET account page. */
  router.get('/account', isAuthenticated, function(req, res, next) {
    res.render('account', { title: 'Profile', user: req.user });
  });
  router.post('/account', isAuthenticated, function(req, res, next) {
    var avatarIcon = req.body.avatar_picking;
    mongoose.model('chatUserDb').findByIdAndUpdate(req.user._id,
        {$set: {avatarIcon: avatarIcon}}, function(error, user) {
      if (error) return next(error);
      if (!user) {
        return res.status(404).json({
          message: "user with id" + req.user._id + "cannot be found"
        });
      }
      else {
        res.format({
          html: function(){
            res.redirect("/account");
          },
          //JSON responds showing the updated values
          json: function(){
            res.json(user);
          }
        });
        //HTML responds by going back to the page or you can be fancy and create a new view that shows a success page.

      }
    })

})


  /* Handle Logout */
  router.get('/signout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  return router;
}

