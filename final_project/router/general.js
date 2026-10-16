// Get the book list available in the shop
const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (isValid(username)) {
    return res.status(400).json({ message: "User already exists" });
  }

  users.push({ username: username, password: password });
  return res.status(200).json({ message: "User successfully registered" });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
	res.json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  res.json(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author.toLowerCase();
  const result = {};

  for (let isbn in books) {
    if (books[isbn].author.toLowerCase() === author) {
      result[isbn] = books[isbn];
    }
  }

  res.json(result);
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title.toLowerCase();
  const result = {};

  for (let isbn in books) {
    if (books[isbn].title.toLowerCase() === title) {
      result[isbn] = books[isbn];
    }
  }

  res.json(result);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  res.json(books[isbn].reviews);
});

module.exports.general = public_users;
