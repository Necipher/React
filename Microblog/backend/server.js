require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('./db.js');
const PORT = process.env.PORT;
const app = express();

const { generateAccessToken, generateRefreshToken } = require('./utils/generateToken.js');
const { protect, optionalAuth } = require('./middleware/authMiddleware.js');
const cookieParser = require('./middleware/cookieParser.js');

app.use(express.json());
app.use(cookieParser)
app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
    })
);

// Default folder, currently used for default profile picture provided at creation
app.use('/public', express.static('public'));

// Register function
app.post('/auth/register', async (req, res, next) => {

    try {
        const { handle, username, first_name, last_name, email, password } = req.body;

        if (!handle || !email || !password) {
            return res.status(400).json({ message: 'Missing an input field' })
        }
        const isAlreadyRegistered = (await pool.query('SELECT email FROM users WHERE email = $1', [email])).rows.length > 0;

        if (isAlreadyRegistered) {
            return res.status(400).json({ message: 'User already exists' })
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const defaultAvatar = 'http://localhost:5004/public/default-avatar.png'
        const defaultBanner = 'http://localhost:5004/public/default-banner.png'
        const result = await pool.query(`
            INSERT INTO users (
                username, 
                first_name, 
                last_name, 
                email, 
                created_at, 
                password, 
                role, 
                handle, 
                avatar_url, 
                banner_url
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
                RETURNING 
                id, 
                public_id, 
                avatar_url, 
                handle, 
                bio, 
                quick_status
                `, [username, first_name, last_name, email, 'now()', hashedPassword, 'user', handle, defaultAvatar, defaultBanner]);
        const { id, public_id, avatar_url, handle: storedHandle, bio } = result.rows[0];

        const accessToken = generateAccessToken(public_id)

        const refreshToken = generateRefreshToken(public_id)
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        await pool.query('INSERT INTO tokens(user_id, token, expires) VALUES ($1, $2, $3)', [id, refreshToken, expiresAt])

        res.cookie('refreshToken', refreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 })
        res.json({
            'message': `User ${username} sucessfully registered`,
            'accessToken': accessToken,
            'user': { 'id': public_id, username, first_name, last_name, email, handle: `@${storedHandle}`, avatar_url, bio, quick_status }
        })
    } catch (err) {
        next(err);
    }
})

// Login function  
app.post('/auth/login', async (req, res, next) => {
    try {

        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Missing an input field' })
        }

        const user = await pool.query(`
            SELECT 
            users.id,
            users.public_id,
            users.username,
            users.first_name,
            users.last_name,
            users.password,
            users.handle,
            users.avatar_url,
            users.banner_url,
            users.bio,
            users.quick_status  
            FROM users 
            WHERE email = $1
            `, [email])
        if (user.rows.length === 0) {
            return res.status(400).json({ 'message': 'Invalid credentials' })
        }
        const comparePass = await bcrypt.compare(password, user.rows[0].password);
        if (!comparePass) {
            return res.status(400).json({ message: 'Invalid credentials' })
        }

        const { id, public_id, username } = user.rows[0];
        const accessToken = generateAccessToken(public_id);

        const refreshToken = generateRefreshToken(public_id);
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        await pool.query('INSERT INTO tokens (user_id, token, expires) VALUES ($1, $2, $3)', [id, refreshToken, expiresAt])

        res.cookie('refreshToken', refreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 })
        res.json({
            'message': `User ${username} logged sucessfully`,
            'accessToken': accessToken,
            'user': {
                id: user.rows[0].public_id,
                username: user.rows[0].username,
                first_name: user.rows[0].first_name,
                last_name: user.rows[0].last_name,
                handle: '@' + user.rows[0].handle,
                avatar_url: user.rows[0].avatar_url,
                banner_url: user.rows[0].banner_url,
                bio: user.rows[0].bio,
                quick_status: user.rows[0].quick_status
            }
        })
    } catch (err) {
        next(err)
    }
})

// Logout function
app.post('/auth/logout', async (req, res, next) => {
    try {
        const token = req.cookies.refreshToken;

        if (token) {
            await pool.query('DELETE FROM tokens WHERE token = $1', [token]);
        }
        res.clearCookie('refreshToken')
        res.status(200).json({ message: 'Logged out successfully' })
    } catch (err) {
        next(err)
    }
})

// Refresh logic for automatic new refresh token
app.post('/auth/refresh', async (req, res, next) => {
    try {

        const token = req.cookies.refreshToken;
        if (!token) {
            return res.status(401).json({ 'message': 'No token, No access' });
        }

        let decoded
        try {
            decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
        } catch (err) {
            console.error(err)
            return res.status(401).json({ message: 'Invalid or Expired refresh token' })
        }

        const public_id = decoded.payload

        const user = await pool.query(`
            SELECT 
            users.id,
            users.public_id,
            users.username,
            users.first_name,
            users.last_name,
            users.handle,
            users.avatar_url,
            users.banner_url,
            users.bio,
            users.quick_status 
            FROM users 
            WHERE public_id = $1
            `, [decoded.payload]);

        if (!user.rows[0]) {
            return res.status(401).json({ 'message': 'User does not exist' })
        }
        const result = await pool.query(`SELECT tokens.token FROM tokens WHERE token = $1 AND user_id = $2`, [token, user.rows[0].id]);
        if (!result.rows[0]) {
            return res.status(403).json({ 'message': 'Token access revoken' })
        }

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
                handle: '@' + user.rows[0].handle,
                avatar_url: user.rows[0].avatar_url,
                banner_url: user.rows[0].banner_url,
                bio: user.rows[0].bio,
                quick_status: user.rows[0].quick_status
            }
        })
    } catch (err) {
        next(err)
    }
})

// Function for adding a new post
app.post('/user/post', protect, async (req, res, next) => {
    try {
        const { content } = req.body;

        if (typeof content !== 'string' || content.trim() === '') {
            return res.status(400).json({ 'message': 'Message field is empty' });
        }
        if (content.length > 280) {
            return res.status(400).json({ 'message': 'Post excedes character limit' });
        }

        const user = await pool.query(`SELECT users.id FROM users WHERE public_id = $1`, [req.user.payload]);
        if (!user.rows[0]) {
            return res.status(400).json({ 'message': 'User not found' })
        }
        const userId = user.rows[0].id;
        const result = await pool.query('INSERT INTO posts (user_id, content) VALUES ($1, $2) RETURNING public_id, content, created_at', [userId, content]);

        res.status(200).json({ 'message': 'Post created', post: result.rows[0] })
    } catch (err) {
        next(err)
    }
})

// Fetches all posts from database based on provided limits
app.get('/home', optionalAuth, async (req, res, next) => {
    try {
        const userId = req.user?.payload
        const { limit, offset } = req.query

        const safeLimit = Math.max(0, Math.min(Number(limit) || 10, 50));
        const safeOffset = Math.max(0, Number(offset) || 0);

        // Once decided, needs a personalized fetch for the loged in user, maybe his hidden messages, etc...
        const data = await pool.query(`
            SELECT 
            posts.content, 
            posts.image_url, 
            posts.public_id, 
            posts.created_at, 
            users.avatar_url, 
            users.handle, 
            users.username
            FROM posts 
            LEFT JOIN users ON users.id = posts.user_id 
            ORDER BY posts.id DESC 
            LIMIT $1 OFFSET $2
            `, [safeLimit, safeOffset]);

        res.json(data.rows)
    } catch (err) {
        next(err)
    }

})

// Function for fetching all posts from a user
app.get('/userPosts/:handle', optionalAuth, async (req, res, next) => {
    try {
        const handle = req.params.handle;
        const user = await pool.query(`
            SELECT 
            users.id,
            users.username,
            users.first_name,
            users.last_name,
            users.avatar_url,
            users.handle 
            FROM users 
            WHERE handle = $1
            `, [handle]);
        if (!user.rows[0]) {
            return res.status(404).json({ message: 'User doest not exist' });
        }

        const data = await pool.query(`
                SELECT 
                posts.public_id,
                posts.content,
                posts.image_url,
                posts.created_at 
                FROM posts 
                WHERE user_id = $1 
                ORDER BY id DESC
                `, [user.rows[0].id])

        res.status(200).json({
            'user': {
                username: user.rows[0].username,
                first_name: user.rows[0].first_name,
                last_name: user.rows[0].last_name,
                avatar_url: user.rows[0].avatar_url,
                handle: user.rows[0].handle
            },
            'posts': data.rows
        })
    } catch (err) {
        next(err)
    }
})

// Get Profile function
app.get('/:handle', optionalAuth, async (req, res, next) => {
    try {
        const extractedHandle = req.params.handle;
        const user = await pool.query(`
            SELECT 
            users.id, 
            users.public_id,
            users.username, 
            users.first_name,
            users.last_name,
            users.handle,
            users.avatar_url,
            users.banner_url,
            users.bio,
            users.quick_status
            FROM users 
            WHERE handle = $1
            `, [extractedHandle])

        if (!user.rows[0]) {
            return res.status(404).json({ 'message': 'User not found' })
        }

        res.status(200).json({
            'user': {
                id: user.rows[0].public_id,
                username: user.rows[0].username,
                first_name: user.rows[0].first_name,
                last_name: user.rows[0].last_name,
                handle: '@' + user.rows[0].handle,
                avatar_url: user.rows[0].avatar_url,
                banner_url: user.rows[0].banner_url,
                bio: user.rows[0].bio,
                quick_status: user.rows[0].quick_status
            }
        })
    } catch (err) {
        next(err)
    }
})

// Delete Post
app.delete('/user/post/:postId', protect, async (req, res, next) => {
    try {
        const postId = req.params.postId;
        const userId = await pool.query('SELECT users.id FROM users WHERE public_id = $1', [req.user.payload]);
        if (!userId.rows[0]) {
            return res.status(404).json({ message: 'User does not exist' });
        }

        const post = await pool.query('SELECT posts.id FROM posts WHERE public_id = $1 AND user_id = $2', [postId, userId.rows[0].id]);
        if (!post.rows[0]) {
            return res.status(404).json({ message: 'Post does not exist' });
        }

        await pool.query('DELETE FROM posts WHERE id = $1', [post.rows[0].id]);
        res.status(200).json({ message: 'Post deleted' });
    } catch (err) {
        next(err);
    }
})

// Update Post
app.patch('/user/post/:postId', protect, async (req, res, next) => {
    try {
        const postId = req.params.postId;
        const { updatedContent } = req.body;
        if (typeof updatedContent !== 'string' || updatedContent.trim() === '' || updatedContent.length > 280) {
            return res.status(400).json({ message: 'Wrong input' });
        }
        const userId = await pool.query('SELECT users.id FROM users WHERE public_id = $1', [req.user.payload]);
        if (!userId.rows[0]) {
            return res.status(404).json({ message: 'User does not exist' });
        }

        const post = await pool.query('SELECT posts.id FROM posts WHERE public_id = $1 AND user_id = $2', [postId, userId.rows[0].id]);
        if (!post.rows[0]) {
            return res.status(404).json({ message: 'Post does not exist' });
        }

        const update = await pool.query('UPDATE posts SET content = $1 WHERE id = $2 RETURNING content, created_at', [updatedContent, post.rows[0].id]);
        res.status(200).json({ message: 'Post Updated', postContent: update.rows[0] });

    } catch (err) {
        next(err);
    }
})

// Get Post
app.get('/user/post/:postId', optionalAuth, async (req, res, next) => {
    try {
        const postId = req.params.postId;
        const data = await pool.query(`
            SELECT 
                posts.public_id,
                posts.content,
                posts.image_url,
                posts.created_at,
                users.public_id AS author_public_id,
                users.username,
                users.first_name,
                users.last_name,
                users.avatar_url,
                users.handle 
            FROM posts 
            LEFT JOIN users ON users.id = posts.user_id
            WHERE posts.public_id = $1 
            ORDER BY posts.id DESC
            `, [postId]);
        if (!data.rows[0]) {
            return res.status(404).json({ message: 'Post not found' })
        }

        const { author_public_id, ...post } = data.rows[0];
        post.isOwner = req.user?.payload === author_public_id;

        res.status(200).json({ 'data': post });

    } catch (err) {
        next(err)
    }
})

app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
})

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' })
})

app.listen(PORT, () => console.log(`Server started at port ${PORT}`)) 