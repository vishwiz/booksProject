const express = require('express')
let bodyParser = require('body-parser')
const mongoose = require('mongoose')
// let books = require('./models/book')
let users = require('./models/users')
const app = express()

app.use(bodyParser.json())



mongoose.connect('mongodb://localhost/booksProject', {
  useNewUrlParser: true
})


app.get('/', (req, res) => {
  res.send('Do something....')
})
// app.get('/api/books', (req, res) => {
//   books.getBooks((err, books) => {
//     if (err) throw (err)
//     res.json(books)
//   })
// })
// app.get('/api/books/:_id', (req, res) => {
//   books.getBookId(req.params._id, (err, books) => {
//     if (err) throw (new Error(""))
//     res.json(books)

//   })
// })

// app.get('/api/users', (req, res) => {
//   users.getUserId(req.get('Referer'), (user,status) => {
   
//     res.status(status).send(user)
//   })
// })

app.post('/api/users', async (req, res) => {
 try{
  let result = await  users.addUser(req.get('Referer'))
  res.status(200).send(result)
 }catch(err){
  res.status(400).send(err)
 }
})

app.get('/api/list/:checkData', async (req, res) => {
  try{
    let result = await users.userBooks(req.get('Referer'), req.params.checkData)
    res.status(200).send(result)
  }catch(err){
    res.status(400).send(err)
  }

})

app.post('/api/list/:checkData', async (req, res) => {
 
  try{
    let result = await users.userBooksUpdate(req.get('Referer'),req.body.isbn,req.params.checkData)
    if(result==='Sucess'){
      res.status(201).send(result)
    }else if(result==='Already present'){
      res.status(400).send(result)
    }else res.status(400).send(result)
  }catch(err){
    res.status(400).send(err)
  }
})


app.delete('/api/list/:checkData/:_isbn', async (req, res) => {
  try{   
   let result= await users.userBooksDelete(req.get('Referer'),req.params._isbn,req.params.checkData)
   if(result==="Galat hai"){
      res.status(400).send(result)
   }else if(result==='Galat hai bhai Request'){
       res.status(400).send(result);
     }else if (result==="don't exist"){
       res.status(400).send(result)
     }else res.status(200).send(result)
    }catch(err){
      res.status(400).send(err)
    }

})

app.listen(3000, function () {
  console.log('server started on port 3000....')
});