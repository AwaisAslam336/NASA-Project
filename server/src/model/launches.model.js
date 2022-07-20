const launchesDatabase = require('./launches.mongo');
const planetsDatabase = require('./planets.mongo');
let launches = new Map();
let DefaultFlightNumber = 100;

// //example launch data
// let launch = {
//     flightNumber: 100,
//     mission: 'Kepler Exploration X',
//     rocket: 'Explorer IS1',
//     launchDate: new Date('December 27, 2030'),
//     target: 'kepler-442 b',
//     customers: ['NASA', 'ZTM'],
//     upcoming: true,
//     success: true
// }

async function saveLaunch(launch) {
    const planet = await planetsDatabase.findOne({
        keplerName: launch.target,
    });
    if (!planet) {
        throw new Error('No matching planet found');
    }
    await launchesDatabase.findOneAndUpdate({ flightNumber: launch.flightNumber }, launch, { upsert: true });
}

async function getAllLaunches() {
    return await launchesDatabase.find({}, { '_id': 0, '__v': 0 });
}

async function getLatestFlightNumber() {
    const latestLaunch = await launchesDatabase.findOne().sort('-flightNumber');
    if (!latestLaunch) {
        return DefaultFlightNumber;
    }
    return latestLaunch.flightNumber;
}

async function addNewLaunch(launch) {
    const newFlightNumber = await getLatestFlightNumber() + 1;

    const newLaunch = Object.assign(launch, {
        flightNumber: newFlightNumber,
        customers: ['Easy Learning', 'NASA'],
        upcoming: true,
        success: true
    });

    await saveLaunch(newLaunch);
}

async function existsLaunchWithId(launchId) {
    return await launchesDatabase.findOne({ flightNumber: launchId });
}

async function abortLaunchById(launchId) {
    const aborted = await launchesDatabase.updateOne(
        { flightNumber: launchId },
        {
            upcoming: false,
            success: false
        });
        console.log(aborted);
    return aborted.matchedCount === 1 && aborted.modifiedCount === 1;
}

module.exports = {
    getAllLaunches,
    addNewLaunch,
    existsLaunchWithId,
    abortLaunchById
}