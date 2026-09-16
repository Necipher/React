const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Invalid token' })
    }

    let decoded
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        console.error(err);
        return res.status(401).json({ message: 'Invalid or Expired token' })
    }
    req.user = decoded

    // Next passes control to the followup function
    next();
}

const optionalAuth = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        req.user = null
        return next();
    }

    let decoded
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
        console.error(err);
        req.user = null
        return next();
    }
    req.user = decoded;
    next();
}

module.exports = { protect, optionalAuth };