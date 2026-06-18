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

// Register function
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

// Login function
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

// Logout function
app.post('/logout', async (req, res) => {
    const token = req.cookies.refreshToken;

    if (token) {
        await pool.query('DELETE FROM tokens WHERE token = $1', [token]);
    }
    res.clearCookie('refreshToken')
})

// Refresh logic for automatic new refresh token
app.post('/refresh', async (req, res) => {
    // Takes the token from cookie, if there is none, sends back a 401
    const token = req.cookies.refreshToken;
    if (!token) {
        return res.status(401).json({ 'message': 'No token, no access' });
    }
    // Decodes the cookie with secret and checks it if it exist in database
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    const { public_id } = decoded.payload
    // Checks existance of user and obtains id which is needed for searching in token table
    const user = await pool.query('SELECT * FROM users WHERE public_id = $1', [decoded.payload]);
    if (!user.rows[0]) {
        return res.status(401).json({ 'message': 'User does not exist' })
    }
    // Checks if the token is in the database
    const result = await pool.query('SELECT * FROM tokens WHERE token = $1 AND id = $2', [token, user.rows[0].id]);
    if (!result.rows[0]) {
        return res.status(403).json({ 'message': 'Token access revoken' })
    }
    // Checks if the token is still valid timewise
    if (new Date(result.rows[0].expires) < new Date()) {
        await pool.query('DELETE FROM tokens WHERE token = $1', [result.rows[0].token]);
        return res.status(403).json({ 'message': 'Refresh token expired' });
    }
    // If ok issue new accessToken and refreshes the refreshToken for better security
    const newAccessToken = generateAccessToken(public_id);
    const newRefreshToken = generateRefreshToken(public_id);
    const expiresAt = new Date(Date.now + 7 * 24 * 60 * 60 * 1000);

    await pool.query('DELETE FROM tokens WHERE token = $1', [result.rows[0].token])
    await pool.query('INSERT INTO tokens (user_id, token, expires) VALUES ($1, $2, $3)', [public_id, newRefreshToken, expiresAt]);

    res.cookie('refreshToken', newRefreshToken, { httpOnly: true });
    res.json({ newAccessToken })
})

app.listen(PORT, () => console.log(`Server started at port ${PORT}`))