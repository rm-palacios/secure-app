// backend/config/db.js
const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',        // Host
    port: 3306,               // Asegúrate de que el puerto es el correcto
    user: 'root',             // Usuario de MySQL
    password: '87654321', // Contraseña de MySQL
    database: 'accesoM_db'    // Nombre de la base de datos
});

db.connect(err => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err.message);
        return;
    }
    console.log('Conectado a la base de datos MySQL');
});

module.exports = db;