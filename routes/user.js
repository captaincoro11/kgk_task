const express = require('express');
const { register,login,dashboard, logout, refreshtoken } = require('../controllers/user');
const app = express.Router();
const cookieParser = require('cookie-parser');
const {isAuthenticated} = require('../middleware/userAuthentication')
app.use(express.json());
app.use(cookieParser())

app.post('/register',register);
app.post('/login',login);
app.post('/dashboard',isAuthenticated,dashboard);
app.post('/logout',logout);
app.post('/refreshtoken',refreshtoken)

module.exports = app;