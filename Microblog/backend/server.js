require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('./db.js');
const PORT = process.env.PORT;
const app = express();

const { generateAccessToken, generateRefreshToken } = require('./utils/generateToken.js');
const protect = require('./middleware/authMiddleware.js');

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
    const result = await pool.query('INSERT INTO users (username, first_name, last_name, email, gender, created_at, password, role) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id, public_id', [username, first_name, last_name, email, gender, 'now()', hashedPassword, 'user']);
    const { id, public_id } = result.rows[0];

    // Generate access and refresh tokens from new added user
    const accessToken = generateAccessToken(public_id)

    const refreshToken = generateRefreshToken(public_id)
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await pool.query('INSERT INTO tokens(user_id, token, expires) VALUES ($1, $2, $3', [id, refreshToken, expiresAt])

    // Sets the refreshToken as a cookie and the access token for work purpose
    res.cookie('refreshToken', refreshToken, { httpOnly: true })
    res.json({
        'message': `User ${username} sucessfully registered`,
        'token': accessToken
    })
})

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Missing an input field' })
    }

    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email])
    const comparePass = user && await bcrypt.compare(password, user.rows[0].password);
    if (user.rows.length <= 0 || !comparePass) {
        return res.status(400).json({ message: 'Invalid credentials' })
    }

    const { id, public_id, username } = user.rows[0];
    const accessToken = generateAccessToken(public_id);

    const refreshToken = generateRefreshToken(public_id);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await pool.query('INSERT INTO tokens (user_id, token, expires) VALUES ($1, $2, $3)', [id, refreshToken, expiresAt])

    res.cookie('refreshToken', refreshToken, { httpOnly: true })
    res.json({
        'message': `User ${username} logged sucessfully`,
        'token': accessToken
    })
})

app.get('/profile', protect, async (req, res) => {
    const result = await pool.query('SELECT * FROM users WHERE public_id = $1', [req.user.payload])
    res.json(result.rows)
})

// Preparation for addition of a refresh token
// Refresh logic for a new refresh token

app.post('/refresh', async (req, res) => {
    // Takes the token from cookie, if there is none, sends back a 401
    const token = req.cookies.refreshToken;
    if (!token) {
        return res.status(401).json({ 'message': 'No token' })
    }

    // Decodes the cookie with secret and checks it if it exist in database
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

    console.log(decoded)
    const user = await pool.query('SELECT id FROM users WHERE public_id = $1', [decoded.payload])
    if (!user.rows[0]) {
        return res.status(401).json({ 'message': 'User does not exist' })
    }
    const result = await pool.query('SELECT * FROM tokens WHERE id = $1 AND token = $2', [user.rows[0].id, token]);

    if (!result.rows[0]) {
        return res.status(403).json({ 'message': 'Refresh Token Revoken' })
    }

    // If ok issue new access token and refresh the refreshToken for better security
    const accessToken = generateAccessToken(decoded.payload)

    const newRefreshToken = generateRefreshToken(decoded.payload);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await pool.query('DELETE FROM tokens WHERE id = $1', [user.rows[0].id]);
    await pool.query('INSERT INTO tokens (user_id, token, expires) VALUES ($1, $2, $3)', [user.rows[0].id, newRefreshToken, expiresAt]);

    res.cookie('refreshToken', newRefreshToken, { httpOnly: true })
    res.json({ 'token': accessToken })
})

app.listen(PORT, () => console.log(`Server started at port ${PORT}`))