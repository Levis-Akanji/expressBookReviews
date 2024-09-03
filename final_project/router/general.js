const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username) => {
    return users.some((user) => user.username === username);
};

// Register a new user
public_users.post("/register", (req, res) => {
    const { username, password } = req.body;
    if (username && password) {
        if (!doesExist(username)) {
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const foundBook = Object.values(books).find(book => book.isbn === isbn);
    if (foundBook) {
        res.status(200).send(foundBook);
    } else {
        res.status(404).send({ message: 'Book not found' });
    }
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    const booksByAuthor = Object.values(books).filter(book => book.author === author);
    if (booksByAuthor.length > 0) {
        res.status(200).send(booksByAuthor);
    } else {
        res.status(404).send({ message: 'No books found by this author' });
    }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    const booksByTitle = Object.values(books).filter(book => book.title === title);
    if (booksByTitle.length > 0) {
        res.status(200).send(booksByTitle);
    } else {
        res.status(404).send({ message: 'No books found with this title' });
    }
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const foundBook = Object.values(books).find(book => book.isbn === isbn);
    if (foundBook) {
        res.status(200).send(foundBook.reviews);
    } else {
        res.status(404).send({ message: 'Book not found' });
    }
});

// Add or modify a book review
public_users.post('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const review = req.query.review;
    const username = req.session.username; // Assuming the username is stored in the session

    // Check if the user is logged in
    if (!username) {
        return res.status(401).json({ message: 'You need to be logged in to post a review.' });
    }

    // Find the book by ISBN
    const foundBook = Object.values(books).find(book => book.isbn === isbn);

    if (foundBook) {
        // Check if the user has already posted a review for this book
        if (foundBook.reviews[username]) {
            // Update the existing review
            foundBook.reviews[username] = review;
            return res.status(200).json({ message: 'Review updated successfully.' });
        } else {
            // Add a new review
            foundBook.reviews[username] = review;
            return res.status(200).json({ message: 'Review added successfully.' });
        }
    } else {
        return res.status(404).json({ message: 'Book not found' });
    }
});

module.exports.general = public_users;

