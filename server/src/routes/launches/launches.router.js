const express = require('express');
const launchesRouter = express.Router();

const { httpGetAllLaunches, httpAddNewLaunch, httpAbortLaunch } = require('./launches.controller');

launchesRouter.get('/launches', httpGetAllLaunches );
launchesRouter.post('/launches',httpAddNewLaunch);
launchesRouter.delete('/launches/:id', httpAbortLaunch);

module.exports = launchesRouter;