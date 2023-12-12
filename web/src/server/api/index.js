import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import fetcher from './fetcher';

const app = express();

app.disable('x-powered-by');
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use('/contact', fetcher(require('../../services/contact/fetcher')));
app.use('/contribute', fetcher(require('../../services/contribute/fetcher')));
app.use('/contributor', fetcher(require('../../services/contributor/fetcher')));
app.use('/dataset', fetcher(require('../../services/dataset/fetcher')));
app.use('/featureFunction', fetcher(require('../../services/featureFunction/fetcher')));
app.use('/statistics', fetcher(require('../../services/statistics/fetcher')));

app.on('mount', () => {
  console.log('Api started at path %s', app.mountpath);
});

export default app;
