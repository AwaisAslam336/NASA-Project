const launchesDatabase = require('./launches.mongo');
const planetsDatabase = require('./planets.mongo');
const axios = require('axios');
let DefaultFlightNumber = 100;

const SPACEX_API_URL = 'https://api.spacexdata.com/v4/launches/query';

async function populateLaunches() {
    const response = await axios.post(SPACEX_API_URL, {
        query: {},
        options: {
            pagination: false,
            populate: [
                {
                    path: 'rocket',
                    select: {
                        name: 1
                    }
                },
                {
                    path: 'payloads',
                    select: {
                        customers: 1
                    }
                }
            ]
        }
    });

    if(response.status !== 200){
        console.log('Problem downloading launch data from SpaceX API');
        throw new Error('Launch data download failed!');
    }
    const launchDocs = response.data.docs;

    for (const launchDoc of launchDocs) {
        const payloads = launchDoc.payloads;
        const customers = payloads.flatMap((payload) => { return payload['customers'] })
        const launch = {
            flightNumber: launchDoc.flight_number,
            mission: launchDoc.name,
            rocket: launchDoc.rocket.name,
            launchDate: launchDoc.date_local,
            customers: customers,
            upcoming: launchDoc.upcoming,
            success: launchDoc.success
        }
        await saveLaunch(launch);
    }
}

async function loadLaunchesData() {
    const firstLaunch = await findLaunch({
        flightNumber: 1,
        rocket: 'Falcon 1',
        mission: 'FalconSat'
    });

    if (firstLaunch) {
        console.log('Launch data already loaded');
    } else {
        await populateLaunches();
    }
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

async function saveLaunch(launch) {
    await launchesDatabase.findOneAndUpdate(
        { flightNumber: launch.flightNumber },
        launch,
        { upsert: true }
    );
}

async function addNewLaunch(launch) {

    const planet = await planetsDatabase.findOne({
        keplerName: launch.target,
    });
    if (!planet) {
        throw new Error('No matching planet found');
    }

    const newFlightNumber = await getLatestFlightNumber() + 1;

    const newLaunch = Object.assign(launch, {
        flightNumber: newFlightNumber,
        customers: ['Easy Learning', 'NASA'],
        upcoming: true,
        success: true
    });

    await saveLaunch(newLaunch);
}

async function findLaunch(filter) {
    return await launchesDatabase.findOne(filter);
}

async function existsLaunchWithId(launchId) {
    return await findLaunch({ flightNumber: launchId });
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
    abortLaunchById,
    loadLaunchesData
}