// imports
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const noteRoutes = require('./routes/noteRoutes');
const authRoutes = require('./routes/authRouter');
const cookieParser = require('cookie-parser');
const { requireAuth, checkUser } = require('./middleware/authMiddleware');

// app
const app = express();
//console.log(process.env);
// connect
const dbURI = process.env.DB_URI;
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    .then(result => {
        app.listen(process.env.PORT || 3000);
        console.log('server started')
    })
    .catch(err => console.log(err));

// view engine
app.set('view engine','ejs');

// middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.locals.path = req.path;
  next();
});
app.use(express.json());
app.use(cookieParser());

// routes
app.get('*', checkUser);
app.get('/', (req, res) => {res.redirect('/notes'); });
app.use('/notes', requireAuth, noteRoutes);
app.use(authRoutes);
app.use((req,res) => {res.status(404).render('404', { title: '404' });} ) //  404 page