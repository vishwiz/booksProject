let mongoose = require('mongoose')
let books = require('../books.json')
// console.log(books)
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
    "website": String

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
    // book.find(data=>console.log(data)).then(dta=>callbacks(dta))
    // console.log()
}
// get book by Id 
module.exports.getBookId = (id,callbacks) => {
    book.findById(id,callbacks)
}

// Add new books

// module.exports.addBook = (newBook,callbacks) => {
//     book.create(newBook,callbacks)
// }