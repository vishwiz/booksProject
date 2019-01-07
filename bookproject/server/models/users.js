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

let validation = (user,_isbn)=>{
    return Joi.validate({
        username:user,
         isbn: _isbn
     }, joiSchema)
 }


//get all users by user name
// module.exports.getUserId = (_user) => {
//     try{
//         if (validation(_user,_isbn).error === null) {
//             let userData = await users.findOne({
//                 user:_user
//             })
//             if(userData===null){
//                 return 'User name dont exist'
//             }else return userData
//         }else return 'Invalid Request'
//     }catch(err){
//         return err
//     }

    //     users.findOne({
    //         user: _user
    //     }).then(data => {
    //         console.log(data)
    //         if (data === null) {
    //             callbacks('User name dont exist', 400)
    //         } else callbacks(data, 200)
    //     })
    // } else callbacks('Invalid Request', 400)
// }

let userValidation =  (newUser)=>{
    let validation = Joi.validate({username:newUser}, joiSchema)
    // console.log(validation)
     if(validation.error===null){
        let userData = users.findOne({
            user:newUser
        })
        if(userData===null){
            return newUser
        }else return 'User Name already exist'
     }else return 'Invalid User Name'
}

//add new user
module.exports.addUser = async (newUser) => {
    // try{
    //     if(validation(_user,_isbn).error===null){
    //         let userData = await users.findOne({
    //             user:newUser
    //         })
    
    //         if(userData===null){
                // let createUser = await users.create({
                //     user:newUser
                // })
    
    //             return createUser
    //         }else return 'Username alredy exists'
    //     }else return 'Invalid Username'
    
    // }catch(err){
    //     return err
    // }      
          try{
            let check = await userValidation(newUser)
      
            if(check===newUser){
              let createUser = await users.create({
                  user:newUser
              })
              console.log(createUser)
              return createUser
            }else return check
          }catch(err){
              return err
          }




}

//get method
module.exports.userBooks = async (checkuser, checkData) => {
    try {
        let userData = await users.findOne({
            user: checkuser
        })
        return userData[checkData]
    } catch (err) {
        return err
    }
}

//update method


module.exports.userBooksUpdate = async (_user, _isbn, checkData) => {
    try {
        if (validation(_user,_isbn).error === null) {
            let booksData = await books.findOne({
                isbn: _isbn
            })
            if (booksData === null) {
                return 'Galat hai'
            } else {
                let userData = await users.findOne({
                    user: _user
                })
                let isIsbnExist = userData[checkData].some(element => element.isbn === _isbn)
                if (!isIsbnExist) {
                    userData[checkData].push({
                        isbn: booksData.isbn
                    })
                    await userData.save();
                    return "Sucess"
                } else return "Already present"
            }
        } else return 'Wrong Entry'
    } catch (err) {
        return err
    }
}

//delete method


module.exports.userBooksDelete = async (_user, _isbn, checkData) => {
    try {
        if (validation(_user,_isbn).error === null) {
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

                return userData[checkData]
            } else return "don't exist";

        } else return 'Galat hai bhai Request';
    } catch (err) {

        return err
    }
}