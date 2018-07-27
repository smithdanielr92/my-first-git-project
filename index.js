const rp = require("request-promise");
const options = {
    method: "GET",
    url: "https://us.api.battle.net/wow/character/stormrage/Aeronautics?locale=en_US&fields=statistics&apikey=4zhp9gcunyhhedfye3bcypg698chch9j"
};
rp(options)
.then(data => {
    const stats = JSON.parse(data);
    let kd = {};
    kd.kills = {};
    kd.deaths = {};
    let killIndex = 9;
    let deathIndex = 0;
    let bgs = ["Alterac Valley", "Arathi Basin", "Warsong Gulch", "Eye of the Storm", "Strand of the Ancients", "Twin Peaks", "The Battle for Gilneas", "Silvershard Mines", "Temple of Kotmogu", "Deepwind Gorge"];
    let bgIndex = 0;
    let totalKills = 0;
    let totalDeaths = 0;

    console.log("PvP statistics for " + stats.name + " on " + stats.realm); 
    while(bgIndex < bgs.length) {
        if(killIndex === 14) {
            killIndex ++; // Skip Isle of Conquest kills
        }
        bgKill = stats.statistics.subCategories[2].subCategories[2].statistics[killIndex].quantity;
        bgDeath = stats.statistics.subCategories[3].subCategories[1].statistics[deathIndex].quantity;
        let ratio = (bgKill !== 0 || bgDeath !== 0) ? (bgKill / bgDeath).toFixed(2) : "N/A";
        totalKills += bgKill;
        totalDeaths += bgDeath;
        console.log("K/D in " + bgs[bgIndex] + ": " + bgKill + "/" + bgDeath);
        console.log("Ratio: " + ratio);
        killIndex++;
        deathIndex++;
        bgIndex++;
    }
    let totalRatio = (totalKills !== 0 || totalDeaths !== 0) ? (totalKills / totalDeaths).toFixed(2) : "N/A";
    console.log("TOTAL KILLS: " + totalKills);
    console.log("TOTAL DEATHS: " + totalDeaths);
    console.log("RATIO: " + totalRatio);
    
    let arenaWins = stats.statistics.subCategories[9].subCategories[0].statistics[0].quantity;
    let arenasPlayed = stats.statistics.subCategories[9].subCategories[0].statistics[1].quantity;
    let arenaWL = (arenasPlayed !== 0) ? (arenaWins / arenasPlayed).toFixed(3) : "N/A";
    let twosWins = stats.statistics.subCategories[9].subCategories[0].statistics[7].quantity;
    let twosPlayed = stats.statistics.subCategories[9].subCategories[0].statistics[6].quantity;
    let twosWL = (twosPlayed !== 0) ? (twosWins / twosPlayed).toFixed(3) : "N/A";
    let twosRating = stats.statistics.subCategories[9].subCategories[0].statistics[24].quantity;
    let threesWins = stats.statistics.subCategories[9].subCategories[0].statistics[5].quantity;
    let threesPlayed = stats.statistics.subCategories[9].subCategories[0].statistics[4].quantity;
    let threesWL = (threesPlayed !== 0) ? (threesWins / threesPlayed).toFixed(3) : "N/A";
    let threesRating = stats.statistics.subCategories[9].subCategories[0].statistics[23].quantity;
    let fivesWins = stats.statistics.subCategories[9].subCategories[0].statistics[3].quantity;
    let fivesPlayed = stats.statistics.subCategories[9].subCategories[0].statistics[2].quantity;
    let fivesWL = (fivesPlayed !== 0) ? (fivesWins / fivesPlayed).toFixed(3) : "N/A";
    let fivesRating = stats.statistics.subCategories[9].subCategories[0].statistics[22].quantity;
    console.log("---ARENAS---");
    console.log("Arena wins: " + arenaWins);
    console.log("Arenas played: " + arenasPlayed);
    console.log("Arena W/L: " + arenaWL);
    console.log("-----");
    console.log("2v2 wins: " + twosWins);
    console.log("2v2 matches: " + twosPlayed);
    console.log("2v2 W/L: " + twosWL);
    console.log("2v2 best personal rating: " + twosRating);
    console.log("-----");
    console.log("3v3 wins: " + threesWins);
    console.log("3v3 matches: " + threesPlayed);
    console.log("3v3 W/L: " + threesWL);
    console.log("3v3 best personal rating: " + threesRating);
    console.log("-----");
    console.log("5v5 wins: " + fivesWins);
    console.log("5v5 matches: " + fivesPlayed);
    console.log("5v5 W/L: " + fivesWL);
    console.log("5v5 best personal rating: " + fivesRating);
    console.log("---DUELS---");

    let duelsWon = stats.statistics.subCategories[9].subCategories[2].statistics[0].quantity
    let duelsLost = stats.statistics.subCategories[9].subCategories[2].statistics[1].quantity
    let duelWL = (duelsWon !== 0 || duelsLost !== 0) ? (duelsWon / duelsLost).toFixed(2) : "N.A";
    console.log(stats.statistics.subCategories[9].subCategories[2].statistics[0].name + ": " + duelsWon);
    console.log(stats.statistics.subCategories[9].subCategories[2].statistics[1].name + ": " + duelsLost);
    console.log("Duel W/L: " + duelWL);
});
