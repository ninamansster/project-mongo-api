import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import mongoose from 'mongoose'

// If you're using one of our datasets, uncomment the appropriate import below
// to get started!
// 
// import goldenGlobesData from './data/golden-globes.json'
// import avocadoSalesData from './data/avocado-sales.json'
import booksData from './data/books.json'
//import netflixData from './data/netflix-titles.json'
// import topMusicData from './data/top-music.json'

const mongoUrl = process.env.MONGO_URL || "mongodb://localhost/project-mongo"
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise = Promise

const Book = mongoose.model('Book', {
  bookID: {
    type: Number
  },
  title: {
    type: String
  },
  authors: {
    type: String
  },
  average_rating: {
    type: Number
  },
  isbn: {
    unique: true,
    type: String
  },
  isbn13: {
    type: String
  },
  language_code: {
    type: String
  },
  num_pages: {
    type: Number
  },
  ratings_count: {
    type: Number
  },
  text_reviews_count: {
    type: Number
  }
});

const addBooksToDatabase = () => {
  booksData.forEach((book) => {
    new Book(book).save();
  });
};
//addBooksToDatabase();
//This adds a new collection of books, but as we have the unique:true for isbn it will not add an new collection.

// Defines the port the app will run on. Defaults to 8080, but can be 
// overridden when starting the server. For example:
//
//   PORT=9000 npm start
const port = process.env.PORT || 8080
const app = express()

// Add middlewares to enable cors and json body parsing
app.use(cors())
app.use(bodyParser.json())

// Start defining your routes here
app.get('/', (req, res) => {
  res.send('Hello world, beutiful planet and handsome')
})

// Reg expression snippet
// Book.find({'title': /Harry/i})
//   .then((results) => {
//     console.log('Found : ' + results)
//   }).catch((err) => {
//     console.log('Error' + err)
//   })

app.get('/books', (req, res) => {
  const queryString = req.query.q
  const queryRegex = new RegExp(queryString, "i");
  Book.find({ 'title': queryRegex })
    .sort({ 'average_rating': -1 })
    .then((results) => {
      //success case
      console.log('Found : ' + results)
      res.json(results)
    }).catch((err) => {
      //error case
      console.log('Error' + err)
      res.json({ message: 'Cannot find this book', err: err })
    })
})

app.get('/books/:isbn', (req, res) => {
  const isbn = req.params.isbn
  Book.findOne({ 'isbn': isbn })
    .then((results) => {
      res.json(results)
    }).catch((err) => {
      res.json({ message: 'Cannot find this book', err: err })
    })
})


// app.get('/authors', async (req, res) => {
//   const authors = await Author.find()
//   res.json(authors)
// })

// app.get('/authors/:id', async (req, res) => {
//   const author = await Author.findById(req.params.id)
//   if (author) {
//     res.json(author)
//   } else {
//     res.status(404).json({ error: 'Author not found' })
//   }
// })

// app.get('/authors/:id/books', async (req, res) => {
//   const author = await Author.findById(req.params.id)
//   if (author) {
//     const books = await Book.find({ author: mongoose.Types.ObjectId(author.id) })
//     res.json(books)
//   } else {
//     res.status(404).json({ error: 'Author not found' })
//   }
// })

// app.get('/books', async (req, res) => {
//   const books = await Book.find().populate('author')
//   res.json(books)
// })

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})
