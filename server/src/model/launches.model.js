let launches = new Map();
let newFlightNumber = 100;
//example launch data
let launch = {
    flightNumber: 100,
    mission: 'Kepler Exploration X',
    rocket: 'Explorer IS1',
    launchDate: new Date('December 27, 2030'),
    destination: 'kepler-442 b',
    customer: ['NASA', 'ZTM'],
    upcoming: true,
    success: true
}

launches.set(launch.flightNumber, launch);

function getAllLaunches() {
    return Array.from(launches.values());
}

function addNewLaunch(launch) {
    newFlightNumber++;
    launches.set(newFlightNumber, Object.assign(launch, {
        flightNumber: newFlightNumber,
        customer: ['Easy Learning', 'NASA'],
        upcoming: true,
        success: true
    }));
}

module.exports = {
    getAllLaunches,
    addNewLaunch
}