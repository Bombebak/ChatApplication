/**
 * Created by Den_F on 20-09-2016.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var bCrypt = require('bcryptjs');

var userSchema = new Schema({
        username: String,
        password: String,
        email: String,
        rooms: [{id: String, title: String}],
        avatarIcon: String,},
    {collection: 'chatUserDb'}
);

mongoose.model('chatUserDb', userSchema);

var createHash = function(password){
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
}

var users = [{
        username: "John Doe",
        password: createHash("123456"),
        email: "mail@mail.dk",
        avatarIcon: "images/avatarIcon1.png"
},
        {
                username: "Anders Andersen",
                password: createHash("123456"),
                email: "mail2@mail.dk",
                avatarIcon: "images/avatarIcon3.png"
        }];
mongoose.model('chatUserDb').create(users, function(err, docs) {
        if (err) {
                throw err;
        }
        else {
                //console.log(docs);
        }
});


