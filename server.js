const express = require('express');
const connectDB = require('./config/db')
const app = express();

connectDB();

app.get('/',(req, res) => res.send('API Berjalan'))

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`server berjalan di port ${PORT}`))