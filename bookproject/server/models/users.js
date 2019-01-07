const mongoose = require('mongoose');
const Joi = require('joi');
let books = require('./book')
// let check = require('../books.json')
//console.log(books.find({'isbn':"9781449325862"}))

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
    // id:Joi.string().alphanum().min(3).max(70).required()
})
// let validation = (newUser,isbn)=>{
//     return Joi.validate({
//         username: newUser
//     }, joiSchema)
// }


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
module.exports.getUsers = (callbacks) => {
    users.find(callbacks)
}

//get all users by id
module.exports.getUserId = (_user, callbacks) => {
    let validation = Joi.validate({
        username: _user
    }, joiSchema)
    if(validation.error===null){
        users.findOne({user:_user}).then(data=>{
            console.log(data)
            if(data===null){
                callbacks('User name dont exist',400)
            }else callbacks(data,200)
        })
    }else callbacks('Invalid Request',400)
}

//add new user
module.exports.addUser = (newUser, callbacks) => {
    let validation = Joi.validate({
        username: newUser
    }, joiSchema)
    console.log(validation)
    if(validation.error=== null){
        users.findOne({
            user: newUser
        }).then(data => {
            console.log(data)
            if(data === null){
                users.create({
                    user: newUser
                }).then(data =>{
                    callbacks(data,201)
                }) 
            }else callbacks('Username already exists', 400)
        })
    }else callbacks(`Invalid Username `,400)
}

//get method
module.exports.userBooks = (checkuser, checkData, callbacks) => {
    let check = {
        user: checkuser
    }
    users.findOne(check, [checkData], callbacks)
}

//update method


module.exports.userBooksUpdate = (_user,_isbn,checkData ,callbacks) => {
    let validation = Joi.validate({
        username: _user,
        isbn: _isbn
    }, joiSchema)

    if(validation.error===null){
        books.findOne({
            isbn: _isbn
          }).then(data => {
            console.log(data)
           if(data===null){
              callbacks('Galat hai',400)
           }else{
            users.findOne({
                user: _user
              }).then(userData => {
                let isIsbnExist = userData[checkData].some(element => element.isbn === _isbn)
          
                if (!isIsbnExist) {
                  userData[checkData].push({
                    isbn: data.isbn
                  })
                  userData.save();
                  callbacks('Sucess',201)
                } else callbacks("Already present",400);
              })
           }
        
        
          })
    }else callbacks('Wrong Entry',400)
}





// module.exports.userBooksUpdate = (checkuser, _isbn,checkData ,callbacks) => {
//     let query = {
//         user: checkuser
//     }
//     books.find({
//         isbn: _isbn
//     },(err, data) => {
//         console.log(data)
//         users.findOneAndUpdate(query, {
//             $push: {
//                 [checkData]: {
//                     title: data[0].title,
//                     isbn: data[0].isbn
//                 }
//             }
//         }, callbacks)
//     })

// }





//delete method

module.exports.userBooksDelete = async (_user, _isbn, checkData) => {


   let validation = Joi.validate({
        username: _user,
        isbn: _isbn
    }, joiSchema)
    // console.log('fgbrt',validation)

try{    if (validation.error === null) {
        let userData =  await users.findOne({
            user: _user
        });
        
       
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






        // }).then(userData => {
        //     console.log(userData)

        //     let length = userData[checkData].length;

        //     for (let i in userData[checkData]) {
        //         if (userData[checkData][i].isbn === _isbn) {
        //             userData[checkData].splice(i, 1)
        //             if (i >= userData[checkData].length) break

        //         }
        //     }

        //     userData.save();
        //     if (userData[checkData].length !== length) {

        //         callbacks(userData[checkData], 201)
        //     } else callbacks("don't exist", 400)

        // })
    } else return 'Galat hai bhai Request';
}catch(err){
    //  console.log(err)
     return err
}


}

// module.exports.userBooksDelete = (_user, _isbn, checkData, callbacks) => {

    // let query = {
    //     id: _id
    // }

    //    users.findOne(query).then(userData=>{
    //     //    console.log(userData)

    //    let length = userData[checkData].length;

    //         for(let i in userData[checkData]){
    //             if(userData[checkData][i].isbn===_isbn){
    //                 userData[checkData].splice(i,1)
    //                 if(i>=userData[checkData].length) break

    //             }
    //         }

    //         userData.save();
    //          if(userData[checkData].length===length){

    //              callbacks(false)
    //          }else{
    //             callbacks(true)
    //          }

    //    })


    // let validation = Joi.validate({
    //     username:_user,
    //     isbn: _isbn
    // }, joiSchema)

    // console.log(validation)

    // if (validation.error === null) {

    //         users.findOneAndUpdate({user:_user}, {$pull: {[checkData]: {isbn: _isbn}}}).then(data =>{
    //             console.log(data)

    //             callback(data,201)
    //         })
    // }else callback('Galat hai bhai Request',400)
// }