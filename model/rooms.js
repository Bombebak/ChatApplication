/**
 * Created by Den_F on 20-09-2016.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var roomSchema = new Schema({
    id: String,
    title: {type: String, required: true},
    users: [{username: String, joinedDate: String, avatarIcon: String}],
    comments: [{message: String, author: String, createdDate: String, avatarIcon: String }]
}, {collection: 'chatRoomDb'});

//var Room = mongoose.model('chatRoomDb', roomSchema);
//model.exports = Room;
mongoose.model('chatRoomDb', roomSchema);

var rooms = [{
    title: "Hardware",
    users: [
        {
            username: "John Doe",
            joinedDate: "Thu, 06 Oct 2016 19:34:19 GMT",
            avatarIcon: "images/avatarIcon1.png"
        },
        {
            username: "Anders Andersen",
            joinedDate: "Thu, 06 Oct 2016 19:34:19 GMT",
            avatarIcon: "images/avatarIcon3.png"
        },
        {
            username: "Mike Johnsen",
            joinedDate: "Fri, 07 Oct 2016 14:34:19 GMT",
            avatarIcon: "images/avatarIcon4.png"
        }
    ],
    comments: [
        {
            message: "I just love Jade.....",
            author: "John Doe",
            createdDate: "Thu, 06 Oct 2016 19:39:19 GMT",
            avatarIcon: "images/avatarIcon1.png"
        },
        {
            message: "I'm nice",
            author: "Anders Andersen",
            createdDate: "Thu, 06 Oct 2016 19:43:19 GMT",
            avatarIcon: "images/avatarIcon3.png"
        },
        {
            message: "Who are you guys?",
            author: "Mike Johnsen",
            createdDate: "Fri, 07 Oct 2016 19:51:19 GMT",
            avatarIcon: "images/avatarIcon4.png"
        }
    ]
},
    {
        title: "News",
        users: [
            {
                username: "John Doe",
                joinedDate: "Thu, 06 Oct 2016 19:34:19 GMT",
                avatarIcon: "images/avatarIcon1.png"
            },
            {
                username: "Mikkel Mikkelsen",
                joinedDate: "Thu, 06 Oct 2016 19:34:19 GMT",
                avatarIcon: "images/avatarIcon2.png"
            },
            {
                username: "Mike Johnsen",
                joinedDate: "Fri, 07 Oct 2016 14:34:19 GMT",
                avatarIcon: "images/avatarIcon4.png"
            }
        ],
        comments: [
            {
                message: "Who in here doesn't love Jade?",
                author: "John Doe",
                createdDate: "Thu, 06 Oct 2016 19:39:19 GMT",
                avatarIcon: "images/avatarIcon1.png"
            },
            {
                message: "I'm also nice",
                author: "Mikkel Mikkelsen",
                createdDate: "Thu, 06 Oct 2016 19:43:19 GMT",
                avatarIcon: "images/avatarIcon2.png"
            },
            {
                message: "Who are you serious?",
                author: "Mike Johnsen",
                createdDate: "Fri, 07 Oct 2016 19:51:19 GMT",
                avatarIcon: "images/avatarIcon4.png"
            }
        ]
    }
];

mongoose.model('chatRoomDb').create(rooms, function(err, docs) {
    if (err) {
        throw err;
    }
    else {
        //console.log(docs);
    }
});