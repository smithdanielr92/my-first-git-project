const {getCharacterInfo} = require('./index');
const {getRealms} = require('./index');
const express = require('express');
const app = express();
const path = require('path');

let port = process.env.PORT;
if (port == null || port == "") {
  port = 6003;
}

app.get('/', (req, res) => {
    const filePath = path.join(__dirname + '/index.html');
    return res.sendFile(filePath);
});

app.get('/characterSearch', async (req, res) => {
    const name = req.query.name || "";

    const info = await getCharacterInfo(name);
    return res.send(info);
});

app.listen(port, () => console.log(`app listening on port ${port}!`))