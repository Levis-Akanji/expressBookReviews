const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username) => {
    return users.some((user) => user.username === username);
  };
  
public_users.post("/register", (req,res) => {
  //Write your code here
  const { username, password } = req.body;
    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!doesExist(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
   const isbn = req.params.isbn;
   // Find the book with the matching ISBN
  let foundBook = null;
  for (const key in books) {
    if (books[key].isbn === isbn) {
      foundBook = books[key];
      break; // Exit the loop once the book is found
    }
  }

  if (foundBook) {
    res.status(200).send(foundBook);
  } else {
    res.status(404).send({ message: 'Book not found' });
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  let booksByAuthor = [];
  for (const key in books) {
    if (books[key].author === author) {
      booksByAuthor.push(books[key]);
    }
  }

  if (booksByAuthor.length > 0) {
    res.status(200).send(booksByAuthor);
  } else {
    res.status(404).send({ message: 'No books found by this author' });
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  let booksByTitle = [];
  for (const key in books) {
    if (books[key].title === title) {
      booksByTitle.push(books[key]);
    }
  }

  if (booksByTitle.length > 0) {
    res.status(200).send(booksByTitle);
  } else {
    res.status(404).send({ message: 'No books found with this title' });
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  let foundBook = null;
  for (const key in books) {
    if (books[key].isbn === isbn) {
      foundBook = books[key];
      break; // Exit the loop once the book is found
    }
  }

  if (foundBook) {
    res.status(200).send(foundBook.reviews);
  } else {
    res.status(404).send({ message: 'Book not found' });
  }
});

module.exports.general = public_users;
