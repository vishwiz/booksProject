let mongoose = require('mongoose')
let books = require('./book')
// let check = require('../books.json')


let userSchema = mongoose.Schema({
    "user": String,
    "password": String,
    "want_to_read": Array,
    "read": Array,
    "reading": Array

})

let users = module.exports = mongoose.model('users', userSchema)


//  users.insertMany(
//      [
//      {
//      "user":"Vishal",
//      "password":"vbnm",
//      "want_to_read":[{"isbn": "9781449337711","title": "Designing Evolvable Web APIs with ASP.NET"}],
//      "read":[{"isbn": "9781449325862","title": "Git Pocket Guide"}],
//       "reading":[{"isbn": "9781491950296","title": "Programming JavaScript Applications"}]
//  },
// {
//     "user":"Harish",
//     "password":"mnvb",
//     "want_to_read":[{"isbn": "9781593277574","title": "Understanding ECMAScript 6"}],
//     "read":[{"isbn": "9781491950296","title": "Programming JavaScript Applications"}],
//     "reading":[{"isbn": "9781449365035","title": "Speaking JavaScript"}]
// }
// ]
// )

//get all users data
// module.exports.getUsers = (callbacks) => {
//     users.find(callbacks)
// }

//get all users by id
module.exports.getUserId = (id, callbacks) => {
    users.findById(id, callbacks)
}

//add new user
module.exports.addUser = (newUser, callbacks) => {
    users.create(newUser, callbacks)
}

//get method
module.exports.userBooks = (checkuser,checkData ,callbacks) => {
    let check = {
        user: checkuser
    }
    users.findOne(check, [checkData], callbacks)
}

//update method
module.exports.userBooksUpdate = (checkuser, _isbn,checkData ,callbacks) => {
    let query = {
        user: checkuser
    }
    books.find({
        isbn: _isbn
    }).then((err, data) => {
        console.log(data)
        users.findOneAndUpdate(query, {
            $push: {
                [checkData]: {
                    title: data[0].title,
                    isbn: data[0].isbn
                }
            }
        }, callbacks)
    })

}
//delete method

module.exports.userBooksDelete = (id, _isbn,checkData, callbacks) => {
    let query = {
        _id: id
    }
    books.find({
        isbn: _isbn
    }).then((err, data) => {
        console.log(data)
        users.findOneAndUpdate(query, {
            $pull: {
                [checkData]: {
                    title: data[0].title,
                    isbn: data[0].isbn
                }
            }
        }, callbacks)
    })
}
