const express = require('express');
const mysql = require('mysql2');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
    secret: 'yourSecretKey',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public'))
// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Snehal',
    database: 'portfolio'
});

db.connect((err) => {
    if (err) throw err;
    console.log('✅ Connected to MySQL');
});

// Default route - send index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Signup
app.post('/signup', (req, res) => {
    const { name, email, password } = req.body;
    // Add a 'role' column to your users table with a default value of 'user'.
    const sql = 'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)';
    db.query(sql, [name, email, password, 'user'], (err) => {
        if (err) {
            console.error('❌ Signup error:', err);
            return res.status(500).json({ message: 'Signup failed. Please try again.' });
        }
        res.json({ message: 'Signup successful, please login.' });
    });
});

// Login
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const sql = 'SELECT * FROM users WHERE email = ? AND password = ?';
    db.query(sql, [email, password], (err, results) => {
        if (err) return res.status(500).json({ message: 'Login error' });
        if (results.length > 0) {
            const user = results[0];
            const isAdmin = (user.role === 'admin'); // Use the 'role' column from the database

            req.session.user = {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            };

            res.json({ message: 'Login successful', role: user.role });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    });
});

// Get current session user
app.get('/me', (req, res) => {
    if (req.session.user) {
        res.json({ loggedIn: true, user: req.session.user });
    } else {
        res.json({ loggedIn: false });
    }
});

// Logout
app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/index.html');
    });
});

// Protect authenticated pages
app.get('/authenticated.html', (req, res, next) => {
    if (req.session.user) return next();
    return res.redirect('/index.html');
});

// Admin-specific middleware to check for admin role
const checkAdmin = (req, res, next) => {
    if (req.session.user && req.session.user.role === 'admin') {
        next();
    } else {
        res.status(403).send('Forbidden: You do not have admin privileges.');
    }
};

// Admin panel route, protected by middleware
app.get('/admin.html', checkAdmin, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// Admin API to get all users
app.get('/admin/users', checkAdmin, (req, res) => {
    const sql = 'SELECT id, name, email, role FROM users';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching users:', err);
            return res.status(500).json({ message: 'Error fetching users' });
        }
        res.json(results);
    });
});

// Admin API to update a user's role
app.post('/admin/updateRole', checkAdmin, (req, res) => {
    const { userId, newRole } = req.body;
    const sql = 'UPDATE users SET role = ? WHERE id = ?';
    db.query(sql, [newRole, userId], (err, result) => {
        if (err) {
            console.error('Error updating role:', err);
            return res.status(500).json({ message: 'Error updating role' });
        }
        res.json({ message: 'Role updated successfully' });
    });
});

app.post('/saveContact', (req, res) => {
    const { name, email, subject, message } = req.body;
    const query = 'INSERT INTO contacts (name, email, subject, message) VALUES (?, ?, ?, ?)';

    db.query(query, [name, email, subject, message], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Database error');
        }
        res.send({ success: true, message: 'Message saved successfully' });
    });
});

// Start server
app.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}`);
});
