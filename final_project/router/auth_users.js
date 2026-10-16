const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  return users.some((user) => user.username === username);
};

const authenticatedUser = (username, password) => {
  return users.some(
    (user) => user.username === username && user.password === password
  );
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  const token = jwt.sign({ username: username }, "access");
  return res.status(200).json({ message: "User successfully logged in", token: token });
});

// Add a book review
// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access token required" });
  }

  jwt.verify(token, "access", (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }

    const isbn = req.params.isbn;
    const review = req.query.review;

    if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (!review) {
      return res.status(400).json({ message: "Review is required" });
    }

    books[isbn].reviews[decoded.username] = review;

    return res.status(200).json({
      message: "Review successfully added",
      reviews: books[isbn].reviews
    });
  });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access token required" });
  }

  jwt.verify(token, "access", (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }

    const isbn = req.params.isbn;

    if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (!books[isbn].reviews[decoded.username]) {
      return res.status(404).json({ message: "Review not found" });
    }

    delete books[isbn].reviews[decoded.username];

    return res.status(200).json({
      message: "Review successfully deleted",
      reviews: books[isbn].reviews
    });
  });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
