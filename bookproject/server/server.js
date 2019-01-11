const express = require('express')
let bodyParser = require('body-parser')
const mongoose = require('mongoose')
const path = require('path');
let users = require('./models/users')
let books = require('./models/book')
const app = express()
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, '../client')));

mongoose.connect('mongodb://localhost/booksProject', {
  useNewUrlParser: true
})

app.get('/api/books',async(req,res)=>{
 try{
   let result = await books.getBooks();
   console.log(result)
   res.status(result['status']).send(result['message'])
 }catch(err){
  throw res.status(result['status']).send(result['message'])
 }
})
app.get('/api/users', async (req, res) => {
  try{
    let result = await  users.getUser(req.get('Referer'))
    res.status(result['status']).send(result['message'])
  }catch(err){
    throw res.status(result['status']).send(result['message'])
  }
})

app.post('/api/users', async (req, res) => {
 try{
  let result = await  users.addUser(req.get('Referer'))
  res.status(result['status']).send(result['message'])
 }catch(err){
  throw res.status(result['status']).send(result['message'])
 }
})

app.get('/api/list/:checkData', async (req, res) => {
  try{
    let result = await users.userBooks(req.get('Referer'), req.params.checkData)
    res.status(result['status']).send(result['message'])
  }catch(err){
    throw res.status(result['status']).send(result['message'])
  }

})

app.post('/api/list/:checkData', async (req, res) => {
 
  try{
    let result = await users.userBooksUpdate(req.get('Referer'),req.body.isbn,req.params.checkData)
    res.status(result['status']).send(result['message'])
  }catch(err){
    throw res.status(result['status']).send(result['message'])
  }
})


app.delete('/api/list/:checkData/:_isbn', async (req, res) => {
  try{   
   let result= await users.userBooksDelete(req.get('Referer'),req.params._isbn,req.params.checkData)
   console.log(result)
   res.status(result['status']).send(result['message'])
  }catch(err){
    throw res.status(result['status']).send(result['message'])
    }

})

app.listen(3000, function () {
  console.log('server started on port 3000....')
});