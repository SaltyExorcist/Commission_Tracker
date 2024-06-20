const express = require('express');
const router = express.Router();
const Admin = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register Admin (Run once to create an admin, then comment out)
// router.post('/register', async (req, res) => {
//     const { username, password } = req.body;
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const newUser = new User({ username, password: hashedPassword });
//     await newUser.save();
//     res.send('Admin registered');
// });

// Initialize an admin user if it doesn't exist
const initAdmin = async () => {
    const adminExists = await Admin.findOne({ username: 'admin' });
    if (!adminExists) {
        const hashedPassword = await bcrypt.hash('password', 10);
        const admin = new Admin({ username: 'admin', password: hashedPassword });
        await admin.save();
    }
};

initAdmin();

router.get('/login', (req, res) => {
    res.render('login');
});

/*
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await Admin.findOne({ username });
    if (user && await bcrypt.compare(password, user.password)) {
        const token = jwt.sign({ userId: user._id }, 'your_jwt_secret', { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true });
        res.redirect('/admin');
    } else {
        res.send('Invalid credentials');
    }
});

router.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/auth/login');
});

*/

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username });

    if (admin && await bcrypt.compare(password, admin.password)) {
        req.session.loggedIn = true;
        res.redirect('/admin');
    } else {
        res.redirect('/auth/login');
    }
});


router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;
