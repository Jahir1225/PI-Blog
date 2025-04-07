const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conectar a la base de datos
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Asegúrate de que sea el usuario correcto
    password: '', // Pon tu contraseña si tienes una
    database: 'db_blog' // Asegúrate de que el nombre de la base de datos sea correcto
});

connection.connect(err => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err);
        return;
    }
    console.log('Conectado a la base de datos');
});

// Ruta para probar el servidor
app.get('/', (req, res) => {
    res.send('Servidor corriendo en http://localhost:3001');
});

// Ruta para registrar usuario
app.post('/registrar', (req, res) => {
    const { userName, userEmail, userPassword } = req.body;

    if (!userName || !userEmail || !userPassword) {
        return res.status(400).json({ success: false, message: "Faltan datos" });
    }

    // Verificar si el correo ya está registrado
    const checkEmailQuery = 'SELECT * FROM users WHERE email = ?';
    connection.query(checkEmailQuery, [userEmail], (err, result) => {
        if (err) {
            console.error("Error al verificar el correo:", err);
            return res.status(500).json({ success: false, message: 'Error al verificar el correo electrónico' });
        }

        if (result.length > 0) {
            return res.status(400).json({ success: false, message: 'El correo electrónico ya está registrado' });
        }

        // Si el correo no está registrado, encriptamos la contraseña y guardamos el usuario
        bcrypt.hash(userPassword, 10, (err, hashedPassword) => {
            if (err) {
                console.error("Error al encriptar la contraseña:", err);
                return res.status(500).json({ success: false, message: 'Error al encriptar la contraseña' });
            }

            const insertUserQuery = 'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)';
            connection.query(insertUserQuery, [userName, userEmail, hashedPassword, 'usuario'], (err, result) => {
                if (err) {
                    console.error("Error al guardar el usuario en la base de datos:", err);
                    return res.status(500).json({ success: false, message: 'Error al guardar el usuario en la base de datos' });
                }

                res.status(201).json({ success: true, message: 'Usuario registrado exitosamente', userId: result.insertId, userName });
            });
        });
    });
});
// Ruta para login
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    console.log("🟡 Email recibido:", email);
    console.log("🟡 Password recibido:", password);

    if (!email || !password) {
        return res.status(400).json({ success: false, message: "Faltan datos" });
    }

    const query = 'SELECT * FROM users WHERE email = ?';
    connection.query(query, [email], (err, results) => {
        if (err) {
            console.error("❌ Error al consultar el usuario:", err);
            return res.status(500).json({ success: false, message: "Error en el servidor" });
        }

        if (results.length === 0) {
            console.log("🔴 Usuario no encontrado");
            return res.status(401).json({ success: false, message: "Correo no registrado" });
        }

        const user = results[0];

        console.log("🟢 Usuario encontrado:", user.email);
        console.log("🔐 Hash guardado:", user.password);

        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                console.error("❌ Error al comparar contraseñas:", err);
                return res.status(500).json({ success: false, message: "Error interno" });
            }

            console.log("🔍 Coincidencia de contraseña:", isMatch);

            if (!isMatch) {
                return res.status(401).json({ success: false, message: "Contraseña incorrecta" });
            }

            res.json({
                success: true,
                message: "Inicio de sesión exitoso",
                name: user.name,
                role: user.role
            });
        });
    });
});




// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
