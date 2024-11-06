/*// backend/routes/authRoutes.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createUser, findUserByUsername } = require('../models/User');

const router = express.Router();
const JWT_SECRET = '2*W[7uW0Yd:`6}RAO,!%'; // Asegúrate de que este secreto sea seguro y único

// Ruta de registro
router.post('/register', (req, res) => {
    const { nombre, user, pass, role } = req.body;

    // Validación de campos obligatorios
    if (!nombre || !user || !pass) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    createUser(nombre, user, pass, role || 'user', (err, result) => {
        if (err) {
            console.error('Error al registrar el usuario en la base de datos:', err);
            return res.status(500).json({ error: 'Error al registrar el usuario' });
        }
        res.status(201).json({ message: 'Usuario registrado con éxito' });
    });
});

// Ruta de inicio de sesión
router.post('/login', (req, res) => {
    const { user, pass } = req.body;

    findUserByUsername(user, async (err, userRecord) => {
        if (err) {
            console.error('Error al buscar el usuario:', err);
            return res.status(500).json({ error: 'Error del servidor' });
        }

        if (!userRecord) {
            console.warn('Usuario no encontrado:', user);
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        try {
            // Verificar la contraseña hasheada
            const isMatch = await bcrypt.compare(pass, userRecord.pass);
            console.log("Resultado de comparación de contraseña:", isMatch);
            if (!isMatch) {
                return res.status(401).json({ error: 'Contraseña incorrecta' });
            }

            // Generar el token JWT
            const token = jwt.sign({ id: userRecord.idUsuarios, role: userRecord.role }, JWT_SECRET, { expiresIn: '1h' });
            res.json({ message: 'Inicio de sesión exitoso', token });
        } catch (err) {
            console.error('Error al comparar contraseñas:', err);
            return res.status(500).json({ error: 'Error al verificar la contraseña' });
        }
    });
});
module.exports = router;*/


const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const speakeasy = require('speakeasy');
const { createUser, findUserByUsername, saveTwoFactorSecret } = require('../models/User');

const router = express.Router();
const JWT_SECRET = '2*W[7uW0Yd:`6}RAO,!%'; // Asegúrate de que este secreto sea seguro y único

// Ruta de registro
router.post('/register', (req, res) => {
    const { nombre, user, pass, role } = req.body;

    if (!nombre || !user || !pass) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    createUser(nombre, user, pass, role || 'user', (err, result) => {
        if (err) {
            console.error('Error al registrar el usuario en la base de datos:', err);
            return res.status(500).json({ error: 'Error al registrar el usuario' });
        }
        res.status(201).json({ message: 'Usuario registrado con éxito' });
    });
});

// Ruta de inicio de sesión
router.post('/login', (req, res) => {
    const { user, pass } = req.body;

    findUserByUsername(user, async (err, userRecord) => {
        if (err) return res.status(500).json({ error: 'Error del servidor' });
        if (!userRecord) return res.status(404).json({ error: 'Usuario no encontrado' });

        const isMatch = await bcrypt.compare(pass, userRecord.pass);
        if (!isMatch) return res.status(401).json({ error: 'Contraseña incorrecta' });

        const token = jwt.sign({ id: userRecord.idUsuarios, role: userRecord.role }, JWT_SECRET, { expiresIn: '1h' });

        if (userRecord.two_factor_enabled) {
            return res.json({ message: 'Inicio de sesión exitoso', token, requires2FA: true });
        }

        res.json({ message: 'Inicio de sesión exitoso', token, requires2FA: false });
    });
});
module.exports = router;

// Ruta para configurar el 2FA
router.post('/2fa/setup', async (req, res) => {
    const userId = req.body.userId;

    const secret = speakeasy.generateSecret({ length: 20 });

    saveTwoFactorSecret(userId, secret.base32, (err) => {
        if (err) {
            console.error('Error al guardar el secreto de 2FA:', err);
            return res.status(500).json({ error: 'Error al configurar 2FA' });
        }

        res.json({ secret: secret.base32, qr: secret.otpauth_url });
    });
});

// Ruta para verificar el código de 2FA
router.post('/2fa/verify', (req, res) => {
    const { userId, token } = req.body;

    findUserByUsername(userId, (err, userRecord) => {
        if (err || !userRecord) {
            console.error('Usuario no encontrado o error al buscar el usuario:', err);
            return res.status(500).json({ error: 'Usuario no encontrado' });
        }

        const verified = speakeasy.totp.verify({
            secret: userRecord.two_factor_secret,
        });
    });
});     
