const express = require('express');

const app = express();

app.get('/',(req, res) => res.send('API Berjalan'))

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`server berjalan di port ${PORT}`))