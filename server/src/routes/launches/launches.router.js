const express = require('express');
const launchesRouter = express.Router();

const { httpGetAllLaunches, httpAddNewLaunch } = require('./launches.controller');

launchesRouter.get('/launches', httpGetAllLaunches );

launchesRouter.post('/launches',httpAddNewLaunch);

module.exports = launchesRouter;