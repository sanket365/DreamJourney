const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt'); // to hash passwords
const app = express();

// Create a MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root123',
  database: 'register'
});

// Set up Express.js server
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Define a route to handle login requests
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Check if the username and password are provided
  if (!username || !password) {
    res.status(400).send({ message: 'Username and password are required' });
    return;
  }

  try {
    // Create a table to store login data if it doesn't exist
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL
      );
    `);

    // Query the database to find the user
    const [results] = await connection.execute('SELECT * FROM users WHERE username = ?', [username]);

    if (results.length === 0) {
      // If the user doesn't exist, return an error
      res.status(401).send({ message: 'Invalid username or password' });
    } else {
      // If the user exists, check the password
      const storedPassword = results[0].password;
      if (bcrypt.compareSync(password, storedPassword)) {
        res.send({ message: 'Login successful' });
      } else {
        res.status(401).send({ message: 'Invalid password' });
      }
    }
  } catch (err) {
    console.error('Error executing query:', err);
    res.status(500).send({ message: 'Error executing query' });
  }
});

// Define a route to handle registration requests
app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  // Check if the username and password are provided
  if (!username || !password) {
    res.status(400).send({ message: 'Username and password are required' });
    return;
  }

  try {
    // Hash the password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Insert the new user into the database
    await connection.execute('INSERT INTO users SET ?', { username, password: hashedPassword });

    res.send({ message: 'User created successfully' });
  } catch (err) {
    console.error('Error executing query:', err);
    res.status(500).send({ message: 'Error executing query' });
  }
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});