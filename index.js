const rp = require("request-promise");
const options = {
    method: "GET",
    url: "https://us.api.battle.net/wow/mount/?locale=en_US&apikey=qhn8894puap9vd36abxukthwcg4fbad6"
};
rp(options)
.then(data => console.log(data));
