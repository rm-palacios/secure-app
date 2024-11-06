// backend/models/Role.js
const db = require('../config/db');

// Crear un nuevo rol
const createRole = (descripcion, callback) => {
    const sql = 'INSERT INTO Roles (descripcion) VALUES (?)';
    db.query(sql, [descripcion], callback);
};

// Obtener todos los roles
const getRoles = (callback) => {
    const sql = 'SELECT * FROM Roles';
    db.query(sql, callback);
};

// Asignar rol a un usuario
const assignRoleToUser = (userId, roleId, callback) => {
    const sql = 'INSERT INTO UsuariosRoles (Usuarios_idUsuarios, Roles_idRoles) VALUES (?, ?)';
    db.query(sql, [userId, roleId], callback);
};

module.exports = { createRole, getRoles, assignRoleToUser };