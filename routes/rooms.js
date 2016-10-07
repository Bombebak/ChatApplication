var express = require('express');
var router = express.Router();
var mongoose = require('mongoose'),
    bodyParser = require('body-parser'), //parses information from POST
    methodOverride = require('method-override'); //used to manipulate POST
var passport = require('passport');

router.use(bodyParser.urlencoded({ extended: true }))
router.use(methodOverride(function(req, res){
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        var method = req.body._method
        delete req.body._method
        return method
    }
}))

var isAuthenticated = function (req, res, next) {
    // if user is authenticated in the session, call the next() to call the next request handler
    // Passport adds this method to request object. A middleware is allowed to add properties to
    // request and response objects
    if (req.isAuthenticated())
        return next();
    // if the user is not authenticated then redirect him to the login page
    res.redirect('/');
}

//module.exports = function(passport){

//Gets all room
router.route('/', isAuthenticated)
//GET all rooms
    .get(isAuthenticated,function(req, res, next) {
        //retrieve all rooms from MongoDb
        mongoose.model('chatRoomDb').find({}, function (err, rooms) {
            if (err) {
                return console.error(err);
            } else {
                //console.log(JSON.stringify(rooms));
                res.render('rooms/index', {
                    rooms: rooms,
                    title: 'All my rooms',
                    user: req.user,
                    pathHack: "../"});

            }
        });
    })
    .post(isAuthenticated, function(req, res) {
        var title = req.body.chatRoomTitle;
        var username = req.user.username;
        var joinedDate = new Date();
        var UTCstring = joinedDate.toUTCString();
        mongoose.model("chatRoomDb").create({
            title: title,
            users: {username: username, joinedDate: UTCstring},
            comments: []}, function (err, room) {
                if (err) {
                    res.send("There was a problem adding the information to the database.");
                } else {
                    //Blob has been created
                    console.log('POST creating new room: ' + room);
                    res.format({
                        //HTML response will set the location and redirect back to the home page. You could also create a 'success' page if that's your thing
                        html: function(){
                            res.render("rooms/details",{
                                title: room.title,
                                id: room._id,
                                "rooms" : room
                            });
                        },
                        //JSON response will show the newly created blob
                        json: function(){
                            res.json(room);
                        }
                    });
                }
            })
    });



// route middleware to validate :id
router.param('id', function(req, res, next, id) {
    //console.log('validating ' + id + ' exists');
    //find the ID in the Database
    mongoose.model('chatRoomDb').findById(id , function (err, room) {
        //if it isn't found, we are going to repond with 404
        if (err) {
            console.log(title + ' was not found');
            res.status(404)
            var err = new Error('Not Found');
            err.status = 404;
            res.format({
                html: function(){
                    next(err);
                },
                json: function(){
                    res.json({message : err.status  + ' ' + err});
                }
            });
            //if it is found we continue on
        } else {
            //uncomment this next line if you want to see every JSON document response for every GET/PUT/DELETE call
            //console.log("the room " + room);
            // once validation is done save the new item in the req
            req.id = id;
            // go to the next thing
            next();
        }
    });
});


router.get('/:id',function(req, res) {
    mongoose.model('chatRoomDb').findById(req.id, function (err, room) {
        if (err) {
            console.log('GET Error: There was a problem retrieving: ' + err);
        } else {
            res.format({
                html: function(){
                    res.render("rooms/details",{
                        title: room.title,
                        id: room._id,
                        "rooms" : room,
                        user: req.user,
                        pathHack: "../"
                    });
                },
                //JSON responds showing the updated values
                json: function(){
                    res.json(room);
                }
            });
            //console.log('GET Retrieving ID: ' + room._id);
            //console.log("The room: " + room.title);


        }
    });
});

router.route('/:id/createMessage')
//POST to update a room by ID
router.route('/:id/createMessage')
//POST to update a room by ID
    .post(isAuthenticated,
        function(req, res) {
            var message = req.body.message;
            var username = req.user.username;
            var avatarIcon = req.user.avatarIcon;
            var joinedDate = new Date();
            var UTCstring = joinedDate.toUTCString();
            mongoose.model('chatUserDb').findOne({username: username}, function (err, userData) {

            })
            //User was not found
            //find the document by ID
            mongoose.model('chatRoomDb').findByIdAndUpdate(req.id,
                {$push:
                {comments: {
                    author: username,
                    message: message,
                    createdDate: UTCstring,
                    avatarIcon: avatarIcon},
                    users: {
                        username: username,
                        joinedDate: UTCstring,
                        avatarIcon: avatarIcon}}
                },
                function (err, room) {
                    if (message.length == 0) {
                        throw err;
                    }
                    if (err) {
                        res.send("There was a problem updating the information to the database: " + err);
                    }
                    else {
                        res.format({
                            html: function(){
                                res.redirect("/rooms/" + room._id);
                            },
                            //JSON responds showing the updated values
                            json: function(){
                                res.json(room);
                            }
                        });
                        //HTML responds by going back to the page or you can be fancy and create a new view that shows a success page.

                    }
                });

        })

    .get(isAuthenticated, function(req, res) {
        mongoose.model('chatRoomDb').findById(req.id, function (err, room) {
            if (err) {
                console.log('GET Error: There was a problem retrieving: ' + err);
            } else {
                //console.log('GET Retrieving ID: ' + room._id);
                //console.log("The room: " + room.title);
                res.render('rooms/details', {
                    title: room.title,
                    id: room._id,
                    "rooms" : room,
                    user: req.user,
                    pathHack: "../"});

            }
        });
    })




//}




module.exports = router;
