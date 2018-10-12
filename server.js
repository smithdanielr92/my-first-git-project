const {getCharacterInfo} = require('./public/js');
const {getRealms} = require('./public/js');
const express = require('express');
const app = express();
const path = require('path');

let port = process.env.PORT;
if (port == null || port == "") {
  port = 6003;
}

app.get('/', (req, res) => {
    const filePath = path.join(__dirname + '/public/index.html');
    return res.sendFile(filePath);
});

app.get('/characterSearch', async (req, res) => {
    const region = req.query.region || "us";
    const realm = req.query.realm || "Stormrage";
    const name = req.query.name || "Busy";

    const info = await getCharacterInfo(region, realm, name);
    return res.send(info);
});

app.use(express.static('public'));
app.listen(port, () => console.log(`app listening on port ${port}!`))