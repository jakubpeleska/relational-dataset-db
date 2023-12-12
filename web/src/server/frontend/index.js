import compression from 'compression';
import express from 'express';
import render from './render';

const app = express();

app.use(compression());
app.disable('x-powered-by');

app.use('/build', express.static('build'));
app.use('/assets', express.static('assets'));

app.get('*', (request, response, next) => {
  render(request, response).catch(next);
});

app.on('mount', () => {
  console.log('App is now available at path %s', app.mountpath);
});

export default app;
