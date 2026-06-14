const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
    // Extracting the token from req header object sent from frontend
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(400).json({message: 'Invalid token'})
    }

    // Checks validty of token, decodes it and attaches it to the req object for continuous use in the upcoming function
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded

    // Next passes control to the followup function
    next();
}

module.exports = protect;