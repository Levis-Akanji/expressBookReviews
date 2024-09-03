const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
const public_users = express.Router();

const doesExist = (username) => {
    return users.some((user) => user.username === username);
};

// User registration route
public_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    if (username && password) {
        if (!doesExist(username)) {
            users.push({ "username": username, "password": password });
            return res.status(200).json({ message: "User successfully registered. Now you can login" });
        } else {
            return res.status(404).json({ message: "User already exists!" });
        }
    }
    return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop using Async-Await
public_users.get('/', async function (req, res) {
    try {
        const booksList = await axios.get('http://localhost:5000/booksdb');
        res.status(200).json(booksList.data);
    } catch (error) {
        res.status(500).json({ message: "Error fetching books", error });
    }
});

// Endpoint to serve the books data
public_users.get('/booksdb', function (req, res) {
    res.status(200).json(books);
});

// Get book details based on ISBN using Async-Await
public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;
    try {
        const foundBook = await axios.get(`http://localhost:5000/booksdb/${isbn}`);
        res.status(200).json(foundBook.data);
    } catch (error) {
        res.status(404).json({ message: 'Book not found', error });
    }
});

// Endpoint to serve book details based on ISBN
public_users.get('/booksdb/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const foundBook = Object.values(books).find(book => book.isbn === isbn);

    if (foundBook) {
        res.status(200).send(foundBook);
    } else {
        res.status(404).send({ message: 'Book not found' });
    }
});

// Get book details based on author using Async-Await
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author;
    try {
        const booksByAuthor = await axios.get(`http://localhost:5000/booksdb/author/${author}`);
        res.status(200).json(booksByAuthor.data);
    } catch (error) {
        res.status(404).json({ message: 'No books found by this author', error });
    }
});

// Endpoint to serve book details based on author
public_users.get('/booksdb/author/:author', function (req, res) {
    const author = req.params.author;
    const booksByAuthor = Object.values(books).filter(book => book.author === author);

    if (booksByAuthor.length > 0) {
        res.status(200).send(booksByAuthor);
    } else {
        res.status(404).send({ message: 'No books found by this author' });
    }
});

// Get book details based on title using Async-Await
public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title;
    try {
        const booksByTitle = await axios.get(`http://localhost:5000/booksdb/title/${title}`);
        res.status(200).json(booksByTitle.data);
    } catch (error) {
        res.status(404).json({ message: 'No books found with this title', error });
    }
});

// Endpoint to serve book details based on title
public_users.get('/booksdb/title/:title', function (req, res) {
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

module.exports.general = public_users;

