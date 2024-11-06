// backend/models/User.js
const db = require('../config/db');
const bcrypt = require('bcrypt');

// Crear un usuario nuevo
const createUser = async (nombre, user, pass, role = 'user', callback) => {
    const hashedPassword = await bcrypt.hash(pass, 10);
    const sql = 'INSERT INTO Usuarios (nombre, user, pass, role) VALUES (?, ?, ?, ?)';
    db.query(sql, [nombre, user, hashedPassword, role], callback);
};

// Buscar usuario por nombre de usuario
const findUserByUsername = (user, callback) => {
    const sql = 'SELECT * FROM Usuarios WHERE user = ?';
    db.query(sql, [user], (err, results) => {
        if (err) return callback(err);
        callback(null, results[0]); // results[0] devuelve el primer registro encontrado
    });
};

// Función para guardar el secreto 2FA
const saveTwoFactorSecret = (userId, secret, callback) => {
    const sql = 'UPDATE Usuarios SET two_factor_secret = ?, two_factor_enabled = ? WHERE idUsuarios = ?';
    db.query(sql, [secret, true, userId], callback);
};


module.exports = { createUser, findUserByUsername, saveTwoFactorSecret };