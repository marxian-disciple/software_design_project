const express = require('express');

const app = express();

//Our middleware here
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//Our routes here
const authRoutes = require('./routes/authRoutes');
app.use(authRoutes);

//We export here so that we can test it
module.exports = app;