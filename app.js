
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const env = require("dotenv");
const path = require('path');
const bcrypt = require('bcrypt');
const app = express();

env.config(); 
// MongoDB connection
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true 
}).then(console.log("connected to mongodb")).catch(err => console.log(err));

// Middleware setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

// Session setup
app.use(session({
    secret: 'E7E03340C434EC3C9FFBC0F305356A43675893E315AB5FB14DF72C4C29FAD7FA',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URL })
}));

const indexRouter = require('./routes/index');
const adminRouter = require('./routes/admin');
const authRouter = require('./routes/auth');

app.use('/', indexRouter);
app.use('/admin', adminRouter);
app.use('/auth', authRouter);

// Start the server
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});