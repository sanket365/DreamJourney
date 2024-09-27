const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const app = express();
const saltRounds = 10;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Create a MySQL connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root123',
    database: 'register'
});

connection.connect((err) => {
    if (err) {
        console.error('Database connection error:', err.stack);
        return;
    }
    console.log('Connected to database.');
});

// Endpoint to handle registration
app.post('/register', async (req, res) => {
    const { fullName, email, phoneNumber, countryOfResidence, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        return res.status(400).json({ error: 'Passwords do not match' });
    }

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Insert data into the database
        const query = 'INSERT INTO users (full_name, email, phone_number, country_of_residence, password) VALUES (?, ?, ?, ?, ?)';
        connection.query(query, [fullName, email, phoneNumber, countryOfResidence, hashedPassword], (error, results) => {
            if (error) {
                return res.status(500).json({ error: 'Database error' });
            }
            res.status(201).json({ message: 'User registered successfully' });
        });
    } catch (err) {
        res.status(500).json({ error: 'Error hashing password' });
    }
});
// {(

// const ipAddress = connection.config.host;
//   console.log{
//       return;
//   }(`MySQL server IP address: ${ipAddress}`);
// });

// Start the server
app.listen(3000, () => {
    console.log('Server running on port 3000');
});