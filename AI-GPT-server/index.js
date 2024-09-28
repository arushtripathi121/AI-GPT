const express = require('express');
const router = require('./router/router');
const app = express();
require('dotenv').config();
const cors = require('cors');
const { connectToDb } = require('./config/database');
const PORT = process.env.PORT;

connectToDb();

app.use(express.json());

const corsOptions = {
    origin: process.env.FRONTEND_URL,
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
};

app.use(cors(corsOptions));

app.use('/', (req, res) => {
    res.send("The server is working fine");
});

app.use('/api/v1/gpt', router);

app.listen(PORT, () => {
    console.log(`The app is running on localhost:${PORT}`);
})
