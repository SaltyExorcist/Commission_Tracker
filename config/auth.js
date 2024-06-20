const jwt = require('jsonwebtoken');

module.exports.ensureAuthenticated = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.redirect('/auth/login');
    }
    try {
        const decoded = jwt.verify(token, 'your_jwt_secret');
        req.user = decoded;
        next();
    } catch (err) {
        res.redirect('/auth/login');
    }
};
