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

// Conexión base de datos
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Usuario
    password: '', // Contraseña
    database: 'db_blog' // Nombre de la base de datos
});

connection.connect(err => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err);
        return;
    }
    console.log('Conectado a la base de datos');
});

// Ruta servidor
app.get('/', (req, res) => {
    res.send('Servidor corriendo en http://localhost:3001');
});

// Ruta registrar usuario
app.post('/registrar', (req, res) => {
    const { userName, userEmail, userPassword } = req.body;

    if (!userName || !userEmail || !userPassword) {
        return res.status(400).json({ success: false, message: "Faltan datos" });
    }

    // Ruta verificar si correo está registrado
    const checkEmailQuery = 'SELECT * FROM users WHERE email = ?';
    connection.query(checkEmailQuery, [userEmail], (err, result) => {
        if (err) {
            console.error("Error al verificar el correo:", err);
            return res.status(500).json({ success: false, message: 'Error al verificar el correo electrónico' });
        }

        if (result.length > 0) {
            return res.status(400).json({ success: false, message: 'El correo electrónico ya está registrado' });
        }

        // Si el correo no está registrado, registramos al usuario
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
// Ruta login
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    console.log("🟡 Correo recibido:", email);
    console.log("🟡 Contraseña recibida:", password);

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
//Ruta reestablecer contraseña
app.post("/restablecer-contrasena", async (req, res) => {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
        return res.status(400).json({ success: false, message: "Faltan datos" });
    }

    try {
        const hashedPassword = await bcrypt.hash(newPassword, 12);

        connection.query("UPDATE users SET password = ? WHERE email = ?", [hashedPassword, email], (err, result) => {
            if (err) {
                console.error("❌ Error al actualizar contraseña:", err);
                return res.status(500).json({ success: false, message: "Error interno" });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ success: false, message: "Correo no encontrado" });
            }

            return res.json({ success: true, message: "Contraseña actualizada correctamente" });
        });

    } catch (err) {
        console.error("❌ Error en /restablecer-contrasena:", err);
        return res.status(500).json({ success: false, message: "Error interno" });
    }
});

// Ruta verificación de correo existente
app.post('/recuperar', (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ success: false, message: "Falta el correo" });
    }

    const query = 'SELECT * FROM users WHERE email = ?';
    connection.query(query, [email], (err, results) => {
        if (err) {
            console.error("❌ Error al buscar email:", err);
            return res.status(500).json({ success: false, message: "Error en el servidor" });
        }

        if (results.length === 0) {
            return res.status(404).json({ success: false, message: "Correo no encontrado" });
        }

        res.json({ success: true, message: "Correo válido" });
    });
});





// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
