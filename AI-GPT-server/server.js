const express = require('express');
const app = express();

const PORT = 5000;

app.get('/', (req, res) => {
    res.send("The server is working fine");
})

app.listen(PORT, () => {
    console.log(`The app is running on localhost:${PORT}`);
})