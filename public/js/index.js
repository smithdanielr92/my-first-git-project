const rp = require("request-promise");
const characterQuery = {
    method: "GET",
    url: "https://us.api.battle.net/wow/character/stormrage/busy?locale=en_US&fields=statistics&apikey=4zhp9gcunyhhedfye3bcypg698chch9j"
};

const realmsQuery = {
    method: "GET",
    url: "https://us.api.battle.net/wow/realm/status?locale=en_US&apikey=4zhp9gcunyhhedfye3bcypg698chch9j"
}

async function getRealms(region="en-US") {
    const realmStatus = await rp(realmsQuery);
    const realms = JSON.parse(realmStatus).realms;

    if(name) {
        return realms.filter(realm => realm.name === name);
    }
    
    return realms.map(realm => realm.slug);
}

async function getCharacterInfo(name="", realm, region) {
    const characterQuery = {
        method: "GET",
        url: "https://" + region + ".api.battle.net/wow/character/" + realm + "/" + name + "?locale=en_US&fields=statistics&apikey=4zhp9gcunyhhedfye3bcypg698chch9j"
    };
    const statistics = await rp(characterQuery)
    const stats = JSON.parse(statistics);

    let data = {name: stats.name, realm: stats.realm};
    data.bgsPlayed = stats.statistics.subCategories[9].subCategories[1].statistics[0].quantity;
    data.bgsWon = stats.statistics.subCategories[9].subCategories[1].statistics[2].quantity;
    let killIndex = 9;
    let deathIndex = 0;
    let bgs = ["Alterac Valley", "Arathi Basin", "Warsong Gulch", "Eye of the Storm", "Strand of the Ancients", "Twin Peaks", "The Battle for Gilneas", "Silvershard Mines", "Temple of Kotmogu", "Deepwind Gorge"];
    let abbreviations = ["av", "ab", "wsg", "eots", "sota", "tp", "bfg", "sm", "tok", "dwg"];
    data.bgInfo = getBgs(stats);

    
    let bgIndex = 0;
    data.totalKills = 0;
    data.totalDeaths = 0;
    while (bgIndex < bgs.length) {
        if (killIndex === 14) {
            killIndex++; // Skip Isle of Conquest kills
        }
        let kills = stats.statistics.subCategories[2].subCategories[2].statistics[killIndex].quantity;
        let deaths = stats.statistics.subCategories[3].subCategories[1].statistics[deathIndex].quantity;

        data.totalKills += kills;
        data.totalDeaths += deaths;
        
        data.bgInfo[abbreviations[bgIndex]].kills = kills;
        data.bgInfo[abbreviations[bgIndex]].deaths = deaths;
        data.bgInfo[abbreviations[bgIndex]].ratio = (bgKill !== 0 || bgDeath !== 0) ? (bgKill / bgDeath).toFixed(2) : "N/A";

        let played = bgInfo[abbreviations[bgIndex]].played;
        data.bgInfo[abbreviations[bgIndex]].avgKillsPerGame = (kills / played).toFixed(2);
        data.bgInfo[abbreviations[bgIndex]].avgDeathsPerGame = (deaths / played).toFixed(2);
        
        killIndex++;
        deathIndex++;
        bgIndex++;
    }
    data.totalRatio = (totalKills !== 0 || totalDeaths !== 0) ? (totalKills / totalDeaths).toFixed(2) : "N/A";
    data.bgWinRate = (Number.parseFloat((data.bgsWon / data.bgsPlayed).toFixed(4)) * 100);

    data.arenaWins = stats.statistics.subCategories[9].subCategories[0].statistics[0].quantity;
    data.arenasPlayed = stats.statistics.subCategories[9].subCategories[0].statistics[1].quantity;
    data.arenaWL = (arenasPlayed !== 0) ? (arenaWins / arenasPlayed).toFixed(3) : "N/A";
    data.twosWins = stats.statistics.subCategories[9].subCategories[0].statistics[7].quantity;
    data.twosPlayed = stats.statistics.subCategories[9].subCategories[0].statistics[6].quantity;
    data.twosWL = (twosPlayed !== 0) ? (twosWins / twosPlayed).toFixed(3) : "N/A";
    data.twosRating = stats.statistics.subCategories[9].subCategories[0].statistics[24].quantity;
    data.threesWins = stats.statistics.subCategories[9].subCategories[0].statistics[5].quantity;
    data.threesPlayed = stats.statistics.subCategories[9].subCategories[0].statistics[4].quantity;
    data.threesWL = (threesPlayed !== 0) ? (threesWins / threesPlayed).toFixed(3) : "N/A";
    data.threesRating = stats.statistics.subCategories[9].subCategories[0].statistics[23].quantity;
    data.fivesWins = stats.statistics.subCategories[9].subCategories[0].statistics[3].quantity;
    data.fivesPlayed = stats.statistics.subCategories[9].subCategories[0].statistics[2].quantity;
    data.fivesWL = (fivesPlayed !== 0) ? (fivesWins / fivesPlayed).toFixed(3) : "N/A";
    data.fivesRating = stats.statistics.subCategories[9].subCategories[0].statistics[22].quantity;

    data.duelsWon = stats.statistics.subCategories[9].subCategories[2].statistics[0].quantity
    data.duelsLost = stats.statistics.subCategories[9].subCategories[2].statistics[1].quantity
    data.duelWL = (duelsWon !== 0 || duelsLost !== 0) ? Number.parseFloat(duelsWon / (duelsWon + duelsLost)).toFixed(4) * 100 : "N.A";

    consol.log(data);
}

function getBgs(stats) {
    let bgInfo = {};
    bgInfo.av = {
        played: stats.statistics.subCategories[9].subCategories[1].statistics[4].quantity,
        won: stats.statistics.subCategories[9].subCategories[1].statistics[5].quantity
    };
    bgInfo.ab = {
        played: stats.statistics.subCategories[9].subCategories[1].statistics[6].quantity,
        won: stats.statistics.subCategories[9].subCategories[1].statistics[7].quantity
    }
    bgInfo.bfg = {
        played: stats.statistics.subCategories[9].subCategories[1].statistics[8].quantity,
        won: stats.statistics.subCategories[9].subCategories[1].statistics[9].quantity
    }
    bgInfo.eots = {
        played: stats.statistics.subCategories[9].subCategories[1].statistics[10].quantity,
        won: stats.statistics.subCategories[9].subCategories[1].statistics[12].quantity
    }
    bgInfo.ss = {
        played: stats.statistics.subCategories[9].subCategories[1].statistics[13].quantity,
        won: stats.statistics.subCategories[9].subCategories[1].statistics[14].quantity
    }
    bgInfo.sota = {
        played: stats.statistics.subCategories[9].subCategories[1].statistics[15].quantity,
        won: stats.statistics.subCategories[9].subCategories[1].statistics[16].quantity
    }
    bgInfo.tp = {
        played: stats.statistics.subCategories[9].subCategories[1].statistics[17].quantity,
        won: stats.statistics.subCategories[9].subCategories[1].statistics[18].quantity
    }
    bgInfo.wsg = {
        played: stats.statistics.subCategories[9].subCategories[1].statistics[19].quantity,
        won: stats.statistics.subCategories[9].subCategories[1].statistics[20].quantity
    }
    bgInfo.sm = {
        played: stats.statistics.subCategories[9].subCategories[1].statistics[21].quantity,
        won: stats.statistics.subCategories[9].subCategories[1].statistics[22].quantity
    }
    bgInfo.tok = {
        played: stats.statistics.subCategories[9].subCategories[1].statistics[23].quantity,
        won: stats.statistics.subCategories[9].subCategories[1].statistics[24].quantity
    }
    bgInfo.ioc = {
        played: stats.statistics.subCategories[9].subCategories[1].statistics[25].quantity,
        won: stats.statistics.subCategories[9].subCategories[1].statistics[26].quantity
    }
    bgInfo.dwg = {
        played: stats.statistics.subCategories[9].subCategories[1].statistics[28].quantity,
        won: stats.statistics.subCategories[9].subCategories[1].statistics[27].quantity
    }
    return bgInfo;
}



// rp(options).then(data => {
//     const stats = JSON.parse(data);

//     let bgsPlayed = stats.statistics.subCategories[9].subCategories[1].statistics[0].quantity;
//     let bgsWon = stats.statistics.subCategories[9].subCategories[1].statistics[2].quantity;
//     let killIndex = 9;
//     let deathIndex = 0;
//     let bgs = ["Alterac Valley", "Arathi Basin", "Warsong Gulch", "Eye of the Storm", "Strand of the Ancients", "Twin Peaks", "The Battle for Gilneas", "Silvershard Mines", "Temple of Kotmogu", "Deepwind Gorge"];
//     let abbreviations = ["av", "ab", "wsg", "eots", "sota", "tp", "bfg", "sm", "tok", "dwg"];
//     let bgInfo = getBgs(stats);


//     let bgIndex = 0;
//     let totalKills = 0;
//     let totalDeaths = 0;
//     console.log("---PvP statistics for " + stats.name + " on " + stats.realm + "---\n");
//     while (bgIndex < bgs.length) {
//         if (killIndex === 14) {
//             killIndex++; // Skip Isle of Conquest kills
//         }
//         let bgKill = stats.statistics.subCategories[2].subCategories[2].statistics[killIndex].quantity;
//         let bgDeath = stats.statistics.subCategories[3].subCategories[1].statistics[deathIndex].quantity;
//         let ratio = (bgKill !== 0 || bgDeath !== 0) ? (bgKill / bgDeath).toFixed(2) : "N/A";
//         totalKills += bgKill;
//         totalDeaths += bgDeath;
//         let bgPlayed = bgInfo[abbreviations[bgIndex]].played;
//         let bgWon = bgInfo[abbreviations[bgIndex]].won;
//         let bgWinRate = ((bgWon / bgPlayed) * 100).toFixed(2);
//         console.log(bgs[bgIndex] + " games played: " + bgPlayed);
//         console.log(bgs[bgIndex] + " games won: " + bgWon);
//         console.log(bgs[bgIndex] + " win rate: " + bgWinRate + "%");
//         console.log("K/D in " + bgs[bgIndex] + ": " + bgKill + "/" + bgDeath);
//         console.log("Average kills per " + bgs[bgIndex] + " game: " + (bgKill / bgPlayed).toFixed(2));
//         console.log("Average deaths per " + bgs[bgIndex] + " game: " + (bgDeath / bgPlayed).toFixed(2));
//         console.log("Ratio: " + ratio);
//         console.log("\n");
//         killIndex++;
//         deathIndex++;
//         bgIndex++;
//     }
//     let totalRatio = (totalKills !== 0 || totalDeaths !== 0) ? (totalKills / totalDeaths).toFixed(2) : "N/A";
//     console.log("---TOTALS---");
//     console.log("Battlegrounds played: " + bgsPlayed);
//     console.log("Battlegrounds won: " + bgsWon);
//     console.log("Battlegrounds win rate: " + (Number.parseFloat((bgsWon / bgsPlayed).toFixed(4)) * 100) + "%");
//     console.log("TOTAL KILLS: " + totalKills);
//     console.log("TOTAL DEATHS: " + totalDeaths);
//     console.log("RATIO: " + totalRatio);
//     console.log();
//     let arenaWins = stats.statistics.subCategories[9].subCategories[0].statistics[0].quantity;
//     let arenasPlayed = stats.statistics.subCategories[9].subCategories[0].statistics[1].quantity;
//     let arenaWL = (arenasPlayed !== 0) ? (arenaWins / arenasPlayed).toFixed(3) : "N/A";
//     let twosWins = stats.statistics.subCategories[9].subCategories[0].statistics[7].quantity;
//     let twosPlayed = stats.statistics.subCategories[9].subCategories[0].statistics[6].quantity;
//     let twosWL = (twosPlayed !== 0) ? (twosWins / twosPlayed).toFixed(3) : "N/A";
//     let twosRating = stats.statistics.subCategories[9].subCategories[0].statistics[24].quantity;
//     let threesWins = stats.statistics.subCategories[9].subCategories[0].statistics[5].quantity;
//     let threesPlayed = stats.statistics.subCategories[9].subCategories[0].statistics[4].quantity;
//     let threesWL = (threesPlayed !== 0) ? (threesWins / threesPlayed).toFixed(3) : "N/A";
//     let threesRating = stats.statistics.subCategories[9].subCategories[0].statistics[23].quantity;
//     let fivesWins = stats.statistics.subCategories[9].subCategories[0].statistics[3].quantity;
//     let fivesPlayed = stats.statistics.subCategories[9].subCategories[0].statistics[2].quantity;
//     let fivesWL = (fivesPlayed !== 0) ? (fivesWins / fivesPlayed).toFixed(3) : "N/A";
//     let fivesRating = stats.statistics.subCategories[9].subCategories[0].statistics[22].quantity;
//     console.log("---ARENAS---");
//     console.log("Arena wins: " + arenaWins);
//     console.log("Arenas played: " + arenasPlayed);
//     console.log("Arena Win Percentage: " + arenaWL);
//     console.log("-----");
//     console.log("2v2 wins: " + twosWins);
//     console.log("2v2 matches: " + twosPlayed);
//     console.log("2v2 Win Percentage: " + twosWL);
//     console.log("2v2 best personal rating: " + twosRating);
//     console.log("-----");
//     console.log("3v3 wins: " + threesWins);
//     console.log("3v3 matches: " + threesPlayed);
//     console.log("3v3 Win Percentage: " + threesWL);
//     console.log("3v3 best personal rating: " + threesRating);
//     console.log("-----");
//     console.log("5v5 wins: " + fivesWins);
//     console.log("5v5 matches: " + fivesPlayed);
//     console.log("5v5 Win Percentage: " + fivesWL);
//     console.log("5v5 best personal rating: " + fivesRating);
//     console.log("---DUELS---");

//     let duelsWon = stats.statistics.subCategories[9].subCategories[2].statistics[0].quantity
//     let duelsLost = stats.statistics.subCategories[9].subCategories[2].statistics[1].quantity
//     let duelWL = (duelsWon !== 0 || duelsLost !== 0) ? Number.parseFloat(duelsWon / (duelsWon + duelsLost)).toFixed(4) * 100 : "N.A";
//     console.log(stats.statistics.subCategories[9].subCategories[2].statistics[0].name + ": " + duelsWon);
//     console.log(stats.statistics.subCategories[9].subCategories[2].statistics[1].name + ": " + duelsLost);
//     console.log("Duel Win Percentage: " + duelWL + "%");
// });


module.exports = {
    getRealms: getRealms,
    getCharacterInfo: getCharacterInfo
};