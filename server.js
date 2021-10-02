require('dotenv').config();
const express = require('express');
const PORT = process.env.PORT || 3000;
const app = express();



// Routes
app.use('/',require('./config/sessions'))
app.use('/', require('./routes/homeRoute'))

app.listen(PORT, () => console.log(`Listening on Port ${PORT}`))