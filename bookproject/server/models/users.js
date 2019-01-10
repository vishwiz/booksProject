const mongoose = require('mongoose');
const Joi = require('joi');
let books = require('./book')

let userSchema = mongoose.Schema({
    "user": String,
    "password": String,
    "want-to-read": Array,
    "read": Array,
    "reading": Array

})

const joiSchema = Joi.object().keys({
    username: Joi.string().alphanum().min(3).max(30).required(),
    isbn: Joi.number()
})



let users = module.exports = mongoose.model('users', userSchema)
// users.find().then(data=>console.log(data))

//  users.insertMany(
//      [
//      {
//      "user":"Vishal",
//      "password":"vbnm",
//      "want-to-read":[{"isbn": "9781449337711"}],
//      "read":[{"isbn": "9781449325862"}],
//       "reading":[{"isbn": "9781491950296"}]
//  },
// {
//     "user":"Harish",
//     "password":"mnvb",
//     "want-to-read":[{"isbn": "9781593277574"}],
//     "read":[{"isbn": "9781491950296"}],
//     "reading":[{"isbn": "9781449365035"}]
// }
// ]
// )

// get all users data
// module.exports.getUsers = (callbacks) => {
//     users.find(callbacks)
// }

// joi Validation
let validation = (user, _isbn) => {
    return Joi.validate({
        username: user,
        isbn: _isbn
    }, joiSchema)
}
//get user Validation
// let getUserValidation = async (_user)=>{
//     let validation = Joi.validate({
//         username: newUser
//     }, joiSchema)
//     if (validation.error === null) {
//         let userData = await users.findOne({
//             user: newUser
//         })
//     }
// }
// user Validation
let addUserValidation = async (newUser) => {
    let validation = Joi.validate({
        username: newUser
    }, joiSchema)
    if (validation.error === null) {
        let userData = await users.findOne({
            user: newUser
        })
        if (userData === null) {
            return newUser
        } else return {message:JSON.stringify('User Name already exist'),status:400}
    } else return {message:JSON.stringify('Invalid User Name'),status:400}
}
// user books validation
let userBooksValidation = async (_user, _isbn) => {
    try {
        if (validation(_user, _isbn).error === null) {
            let booksData = await books.findOne({
                isbn: _isbn
            })
            if (booksData === null){
                return {message:JSON.stringify('Not Available'),status:400}
            } else {
                let userData = await users.findOne({
                    user: _user
                })
                return userData
            }
        } else return {message:JSON.stringify('Worng Entry'),status:400}
    } catch (err) {
        throw {message:JSON.stringify("Internal Server Error"),status:500}
    }
}
//get the user data
module.exports.getUser = async (_user)=>{
    try{
       let userData = await users.findOne({
           user:_user
       })
       if(userData!==null){
        return{message:userData,status:200}
       }else return{message:JSON.stringify(`${_user} don't Exist`),status:400}
       
    }catch(err){
        throw {message:JSON.stringify("Internal Server Error"),status:500}
    }
}

//add new user
module.exports.addUser = async (newUser) => {

    try {
        let check = await addUserValidation(newUser)

        if (check === newUser) {
            await users.create({
                user: newUser
            })
            return {message:JSON.stringify('Sign-up complete'),status:200}
        } else return check
    } catch (err) {
        throw {message:JSON.stringify("Internal Server Error"),status:500}
    }
}

//get method
module.exports.userBooks = async (checkuser, checkData) => {
    try {
        let userData = await users.findOne({
            user: checkuser
        })
        return {message:userData[checkData],status:200}
    } catch (err) {
        throw {message:JSON.stringify("Internal Server Error"),status:500}
    }
}

//update method

module.exports.userBooksUpdate = async (_user, _isbn, checkData) => {
    try {
        let userData = await userBooksValidation(_user, _isbn)
        if (!userData.hasOwnProperty('message')) {
            let isIsbnExist = await userData[checkData].some(element => element.isbn === _isbn)
            console.log(isIsbnExist)
            if (!isIsbnExist) {
                userData[checkData].push({
                    isbn: _isbn
                })
                await userData.save();
                return {message:JSON.stringify('Success'),status:201}
            } else return {message:JSON.stringify('Already present'),status:400}
        } else return userData

    } catch (err) {
        
        throw {message:JSON.stringify("Internal Server Error"),status:500}
    }
}


module.exports.userBooksDelete = async (_user, _isbn, checkData) => {
    try {
        let userData = await users.findOne({
            user: _user
        })
        let length = userData[checkData].length;

        for (let i in userData[checkData]) {
            if (userData[checkData][i].isbn === _isbn) {
                userData[checkData].splice(i, 1)
                if (i >= userData[checkData].length) break
            }
        }

        await userData.save();
        if (userData[checkData].length !== length) {

            return {message:JSON.stringify('sucessfully deleted'),status:200}
        } else return {message:JSON.stringify("don't exist"),status:400}

    } catch (err) {

        throw {message:JSON.stringify("Internal Server Error"),status:500}
    }
}