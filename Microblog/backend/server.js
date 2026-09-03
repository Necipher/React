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
const cookieParser = require('./middleware/cookieParser.js');

app.use(express.json());
app.use(cookieParser)
app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
    })
);

// Register function
app.post('/auth/register', async (req, res) => {
    const { username, first_name, last_name, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Missing an input field' })
    }
    const isAlreadyRegistered = (await pool.query('SELECT email FROM users WHERE email = $1', [email])).rows.length > 0;

    if (isAlreadyRegistered) {
        return res.status(400).json({ message: 'User already exists' })
    }

    // If user doesnt exist encrpyts password and then adds user to the database
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const result = await pool.query('INSERT INTO users (username, first_name, last_name, email, created_at, password, role) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, public_id', [username, first_name, last_name, email, 'now()', hashedPassword, 'user']);
    const { id, public_id } = result.rows[0];

    // Generate access and refresh tokens from new added user
    const accessToken = generateAccessToken(public_id)

    const refreshToken = generateRefreshToken(public_id)
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await pool.query('INSERT INTO tokens(user_id, token, expires) VALUES ($1, $2, $3)', [id, refreshToken, expiresAt])

    // Sets the refreshToken as a cookie and the access token for work purpose
    res.cookie('refreshToken', refreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 })
    res.json({
        'message': `User ${username} sucessfully registered`,
        'accessToken': accessToken,
        'user': { 'id': public_id, username, first_name, last_name, email }
    })
})

// Login function  
app.post('/auth/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        z
        return res.status(400).json({ message: 'Missing an input field' })
    }

    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email])
    if (user.rows.length === 0) {
        return res.status(400).json({ 'message': 'Invalid credentials' })
    }
    const comparePass = await bcrypt.compare(password, user.rows[0].password);
    if (!comparePass) {
        return res.status(400).json({ message: 'Invalid credentials' })
    }

    const { id, public_id, username, first_name, last_name, } = user.rows[0];
    const accessToken = generateAccessToken(public_id);

    const refreshToken = generateRefreshToken(public_id);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await pool.query('INSERT INTO tokens (user_id, token, expires) VALUES ($1, $2, $3)', [id, refreshToken, expiresAt])

    res.cookie('refreshToken', refreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 })
    res.json({
        'message': `User ${username} logged sucessfully`,
        'accessToken': accessToken,
        'user': { 'id': public_id, username, first_name, last_name, email }
    })
})

app.get('/user/profile', protect, async (req, res) => {
    const result = await pool.query('SELECT public_id, username, first_name, last_name, email, role FROM users WHERE public_id = $1', [req.user.payload])
    res.json(result.rows)
})

// Logout function
app.post('/auth/logout', async (req, res) => {
    try {
        const token = req.cookies.refreshToken;

        if (token) {
            await pool.query('DELETE FROM tokens WHERE token = $1', [token]);
        }
        res.clearCookie('refreshToken')
        res.status(200).json({ message: 'Logged out successfully' })
    } catch (err) {
        console.error('Logout error', err)
        res.status(500).json({ message: 'Logout failed' })
    }
})

// Refresh logic for automatic new refresh token
app.post('/auth/refresh', async (req, res) => {
    // Takes the token from cookie, if there is none, sends back a 401
    const token = req.cookies.refreshToken;
    if (!token) {
        return res.status(401).json({ 'message': 'No token, no access' });
    }
    // Decodes the cookie with secret and checks it if it exist in database
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    const public_id = decoded.payload

    const user = await pool.query('SELECT * FROM users WHERE public_id = $1', [decoded.payload]);
    if (!user.rows[0]) {
        return res.status(401).json({ 'message': 'User does not exist' })
    }
    // Checks if the token is in the database
    const result = await pool.query('SELECT * FROM tokens WHERE token = $1 AND user_id = $2', [token, user.rows[0].id]);
    if (!result.rows[0]) {
        return res.status(403).json({ 'message': 'Token access revoken' })
    }
    // Checks if the token is still valid 
    if (new Date(result.rows[0].expires) < new Date()) {
        await pool.query('DELETE FROM tokens WHERE token = $1', [result.rows[0].token]);
        return res.status(403).json({ 'message': 'Refresh token expired' });
    }
    // If ok issue new accessToken and refreshes the refreshToken for better security
    const newAccessToken = generateAccessToken(public_id);
    const newRefreshToken = generateRefreshToken(public_id);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await pool.query('DELETE FROM tokens WHERE token = $1', [result.rows[0].token])
    await pool.query('INSERT INTO tokens (user_id, token, expires) VALUES ($1, $2, $3)', [user.rows[0].id, newRefreshToken, expiresAt]);

    res.cookie('refreshToken', newRefreshToken, { httpOnly: true });
    res.json({
        'accessToken': newAccessToken,
        'user': {
            id: user.rows[0].public_id,
            username: user.rows[0].username,
            first_name: user.rows[0].first_name,
            last_name: user.rows[0].last_name,
            email: user.rows[0].email
        }
    })
})

app.listen(PORT, () => console.log(`Server started at port ${PORT}`))