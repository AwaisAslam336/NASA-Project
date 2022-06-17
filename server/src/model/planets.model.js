const { parse } = require("csv-parse");
const fs = require('fs');
const path = require('path');

const habitableplanets = [];

function isHabitable(planet) {
    return planet['koi_disposition'] === 'CONFIRMED'
        && planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11
        && planet['koi_prad'] < 1.6;
}
function loadPlanetsData() {
    return new Promise((resolve, reject) => {
        fs.createReadStream(path.join(__dirname,'..','..','data','kepler_data.csv'))
            .pipe(parse({
                comment: '#',
                columns: true
            }))
            .on('data', (data) => {
                if (isHabitable(data)) {
                    habitableplanets.push(data);
                }
            })
            .on('error', (err) => {
                console.log(err);
                reject(err);
            })
            .on('end', () => {
                console.log(`${habitableplanets.length} habitable planets found!!!`);
                resolve();
            });
    });
}


module.exports = {
    loadPlanetsData,
    planets: habitableplanets,
};