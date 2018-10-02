const {getCharacterInfo} = require('./index');
const express = require('express');
const app = express();
const path = require('path');
const PORT = 3000

app.get('/', (req, res) => {
    const filePath = path.join(__dirname + '/index.html');
    return res.sendFile(filePath);
});

app.get('/characterSearch', async (req, res) => {
    const name = req.query.name || "";

    const info = await getCharacterInfo(name);
    return res.send(info);
});

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))