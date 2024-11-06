// backend/routes/adminRoutes.js
const express = require('express');
const { createRole, getRoles, assignRoleToUser } = require('../models/Role');
const { createFunction, getFunctions, assignFunctionToRole } = require('../models/Function');

const router = express.Router();

// Crear un nuevo rol
router.post('/roles', (req, res) => {
    const { descripcion } = req.body;
    createRole(descripcion, (err) => {
        if (err) return res.status(500).json({ error: 'Error al crear rol' });
        res.status(201).json({ message: 'Rol creado con éxito' });
    });
});

// Obtener todos los roles
router.get('/roles', (req, res) => {
    getRoles((err, results) => {
        if (err) return res.status(500).json({ error: 'Error al obtener roles' });
        res.json(results);
    });
});

// Asignar rol a un usuario
router.post('/roles/assign', (req, res) => {
    const { userId, roleId } = req.body;
    assignRoleToUser(userId, roleId, (err) => {
        if (err) return res.status(500).json({ error: 'Error al asignar rol' });
        res.json({ message: 'Rol asignado al usuario con éxito' });
    });
});

// Crear una nueva función
router.post('/functions', (req, res) => {
    const { descripcion } = req.body;
    createFunction(descripcion, (err) => {
        if (err) return res.status(500).json({ error: 'Error al crear función' });
        res.status(201).json({ message: 'Función creada con éxito' });
    });
});

// Asignar función a un rol
router.post('/functions/assign', (req, res) => {
    const { roleId, functionId } = req.body;
    assignFunctionToRole(roleId, functionId, (err) => {
        if (err) return res.status(500).json({ error: 'Error al asignar función' });
        res.json({ message: 'Función asignada al rol con éxito' });
    });
});

module.exports = router;