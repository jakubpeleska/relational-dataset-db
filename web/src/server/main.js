import api from './api';
import config from '../config/config.server';
import errorHandler from './lib/errorhandler';
import express from 'express';
import frontend from './frontend';
import {Server} from 'http';

const app = express();
const server = Server(app);

app.disable('x-powered-by');

app.use(config.api.url, api);

app.use(frontend);

app.use(errorHandler);

server.timeout = 5 * 60 * 1000;

server.listen(config.port, () => {
  console.log('Server started at port %s', config.port);
});
