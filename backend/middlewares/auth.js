// backend/middlewares/auth.js
const jwt = require('jsonwebtoken');
const JWT_SECRET = '2*W[7uW0Yd:`6}RAO,!%';

const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).send('Token requerido');

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).send('Token inválido');
        req.user = user;
        next();
    });
};

const authorizeRole = role => (req, res, next) => {
    if (req.user.role !== role) return res.status(403).send('Acceso denegado');
    next();
};

module.exports = { authenticateToken, authorizeRole };