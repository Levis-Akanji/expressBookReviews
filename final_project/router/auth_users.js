const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{ username: 'username', password: 'password' }];

const isValid = (username) => {
    // Check if the username is valid
    return username !== '';
};

const authenticatedUser = (username, password) => {
    // Check if the username and password match a user in our records
    let validUsers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    return validUsers.length > 0;
};

// Only registered users can log in
regd_users.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if username or password is missing
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }

    // Authenticate user
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: username
        }, 'access', { expiresIn: 60 * 60 });

        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        };
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review; // Get review from request query
    const username = req.session.authorization.username; // Get the username from the session

    // Find the book by ISBN
    let book = Object.values(books).find(book => book.isbn === isbn);

    if (book) {
        // Add or update the review for the current user
        book.reviews[username] = review;
        return res.status(200).json({ message: "Review successfully added/updated", reviews: book.reviews });
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization.username; // Get the username from the session

    // Find the book by ISBN
    let book = null;
    for (const key in books) {
        if (books[key].isbn === isbn) {
            book = books[key];
            break; // Exit the loop once the book is found
        }
    }

    // If the book is not found, return an error response
    if (!book) {
        return res.status(404).json({ message: "Book not found" });
    }

    // Check if the user has a review for this book
    if (book.reviews && book.reviews[username]) {
        // Delete the user's review
        delete book.reviews[username];
        return res.status(200).json({ message: "Review successfully deleted" });
    } else {
        // If the user has no review for this book, return an error response
        return res.status(404).json({ message: "Review not found for this user" });
    }
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

