// backend/app.js
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');    // Rutas de autenticacion
const adminRoutes = require('./routes/adminRoutes'); // Rutas de administración

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes); // Agrega las rutas de administración

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});