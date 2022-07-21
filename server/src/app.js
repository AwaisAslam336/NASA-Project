const path = require('path');
const express = require("express");
const cors = require('cors');
const morgan = require('morgan');
const api_v1 = require('./routes/api_version1');

const app = express();

//security related middleware
app.use(cors({
    origin: 'http://localhost:3000'
}));

app.use(morgan('combined'));

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(api_v1);

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

module.exports = app;