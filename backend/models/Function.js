// backend/models/Function.js
const db = require('../config/db');

// Crear una nueva función
const createFunction = (descripcion, callback) => {
    const sql = 'INSERT INTO Funciones (descripcion) VALUES (?)';
    db.query(sql, [descripcion], callback);
};

// Obtener todas las funciones
const getFunctions = (callback) => {
    const sql = 'SELECT * FROM Funciones';
    db.query(sql, callback);
};

// Asignar función a un rol
const assignFunctionToRole = (roleId, functionId, callback) => {
    const sql = 'INSERT INTO RolesFunciones (Roles_idRoles, Funciones_idFunciones) VALUES (?, ?)';
    db.query(sql, [roleId, functionId], callback);
};

module.exports = { createFunction, getFunctions, assignFunctionToRole };