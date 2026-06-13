require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const generateToken = require('./utils/generateToken.js');
const pool = require('./db.js');
const PORT = process.env.PORT;
const app = express();

app.use(express.json());
app.use(cors());

app.post('/register', async (req, res) => {
    // Takes in all the data from front end
    const { username, first_name, last_name, email, gender, password } = req.body;

    if (!username || !first_name || !last_name || !email || !gender || !password) {
        return res.status(400).json({ message: 'Missing an input field' })
    }
    // Compares the unique identifier against the database and checks if the user already exists there
    const isAlreadyRegistered = (await pool.query('SELECT email FROM users WHERE email = $1', [email])).rows.length > 0;

    if (isAlreadyRegistered) {
        return res.status(400).json({ message: 'User already exists' })
    }

    // If user doesnt exist encrpyts password and then adds user to the database
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const result = await pool.query('INSERT INTO users (username, first_name, last_name, email, gender, created_at, password, role) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING public_id', [username, first_name, last_name, email, gender, 'now()', hashedPassword, 'user']);
    const {public_id} = result.rows[0];
    // Generate access token from new added user
    const token = generateToken(public_id)
    res.json({
        'message': `User ${username} sucessfully registered`,
        'token': token
    })
})

app.listen(PORT, () => console.log(`Server started at port ${PORT}`))