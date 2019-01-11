let mongoose = require('mongoose')
let books = require('../books.json')

// boook schema
let bookSchema = mongoose.Schema({

    "isbn": String,
    "title": String,
    "subtitle": String,
    "author": String,
    "published": String,
    "publisher": String,
    "pages": Number,
    "description": String,
    "website": String,
    "imageUrl":String

})

let book = module.exports = mongoose.model('book', bookSchema)

// book.insertMany(books)


// get books
module.exports.getBooks = async () => {
    try{
        let bookData = await book.find()
        console.log(bookData)
        return {message:bookData,status:200}
    }catch(err){
         throw {message:'Internal Server Error',status:500}
    }
}
// get book by Id 
module.exports.getBookId = (id,callbacks) => {
    book.findById(id,callbacks)
}