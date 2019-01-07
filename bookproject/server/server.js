const express = require('express')
let bodyParser = require('body-parser')
const mongoose = require('mongoose')
let books = require('./models/book')
let users = require('./models/users')
const app = express()

app.use(bodyParser.json())



mongoose.connect('mongodb://localhost/booksProject', {
  useNewUrlParser: true
})


app.get('/', (req, res) => {
  res.send('Do something....')
})
app.get('/api/books', (req, res) => {
  books.getBooks((err, books) => {
    if (err) throw (err)
    res.json(books)
  })
})
// app.get('/api/books/:_id', (req, res) => {
//   books.getBookId(req.params._id, (err, books) => {
//     if (err) throw (new Error(""))
//     res.json(books)

//   })
// })

app.get('/users', (req, res) => {
  users.getUserId(req.get('Referer'), (user,status) => {
   
    res.status(status).send(user)
  })
})

app.post('/users', (req, res) => {
  users.addUser(req.get('Referer'), (user,status) => {
    res.status(status).json(user)
  })
})

app.get('/api/list/:checkData', (req, res) => {
  users.userBooks(req.get('Referer'), req.params.checkData, (err, user) => {
    res.json(user)
  })
})

app.post('/api/list/:checkData', (req, res) => {
 
    users.userBooksUpdate(req.get('Referer'),req.body.isbn,req.params.checkData,(user,status)=>{
      res.status(status).send(user)
    })

 // let check = req.params.checkData;
  // let userName = req.get('Referer');
  // let _isbn = req.body.isbn

  // books.findOne({
  //   isbn: _isbn
  // }).then(data => {
  //   console.log(data)
  //   users.findOne({
  //     user: userName
  //   }).then(userData => {
  //     let isIsbnExist = userData[check].some(element => element.isbn === _isbn)

  //     if (!isIsbnExist) {
  //       userData[check].push({
  //         isbn: data.isbn
  //         // title: data.title
  //       })
  //       userData.save();
  //       res.send("Sucess")
  //     } else {
  //       res.status(400).send("Already present");
  //     }
  //   })


  // })

})


app.delete('/api/list/:checkData/:_isbn', async (req, res) => {
  try{   
   let result= await users.userBooksDelete(req.get('Referer'),req.params._isbn,req.params.checkData)

    // if (user) {
    //   res.send("deleted")
    // } else {
    //   res.send("not Exist")
    // }

  if(result==='Galat hai bhai Request'){
       res.status(400).send('Galat hai bhai Request');
     }else if (result==="don't exist"){
       res.status(400).send("don't exist")
     }else res.status(200).send(result)
    }catch(error){
      res.status(400).send(error)
    }

})


app.listen(3000, function () {
  console.log('server started on port 3000....')
});