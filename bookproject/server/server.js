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

    res.json(books)
  })
})
app.get('/api/books/:_id', (req, res) => {
  books.getBookId(req.params._id, (err, books) => {

    res.json(books)

  })
})

app.get('/users/:_id', (req, res) => {
  users.getUserId(req.params._id, (err, user) => {
    res.json(user)
  })
})
// app.get('/users', (req, res) => {
//   users.getUsers((err, user) => {
//     res.json(user)
//   })
// })

app.post('/users', (req, res) => {
  users.addUser(req.body, (err, user) => {
    res.json(user)
  })
})

app.get('/api/list/:checkData', (req, res) => {
  users.userBooks(req.get('Referer'), req.params.checkData, (err, user) => {
    res.json(user)
  })
})

app.post('/api/list/:checkData', (req, res) => {

  users.userBooksUpdate(req.get('Referer'), req.body.isbn, req.params.checkData, (err, user) => {
    res.json(user)
  })
})

app.delete('/api/list/:checkData/:_id', (req, res) => {

  users.userBooksDelete(req.params._id, req.body.isbn, req.params.checkData, (err, user) => {
    res.json(user)
  })
})

app.listen(3000, function () {
  console.log('server started on port 3000....')
})





//  GET /books/:id

// List

// GET /list/want-to-read
// POST  /list/want-to-read
// DELETE  /list/want-to-read/:id

// GET /list/reading
// POST  /list/reading
// DELETE  /list/reading/:id

// GET /list/read
// POST  /list/read
// DELETE  /list/read/:id