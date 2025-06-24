const express = require('express');
const router = require('./router/router');
const dotenv = require('dotenv');
const cors = require('cors');
const { connectToDb } = require('./config/database');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to DB
connectToDb();

// CORS config
const corsOptions = {
    origin:
        process.env.NODE_ENV === 'development'
            ? process.env.DEVELOPMENT_URL
            : process.env.FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
};

console.log(`CORS origin allowed: ${corsOptions.origin}`);

app.use(cors());
app.options("*", cors(corsOptions)); // For preflight requests
app.use(express.json());

// Health check
app.get("/", (req, res) => {
    res.send("The server is working fine");
});

// Routes
app.use("/", router);

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
