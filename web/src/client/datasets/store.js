import immutable from 'immutable';
import * as actions from './actions';
import {register} from '../lib/dispatcher';
import {datasetsCursor} from '../state';
import Dataset from './dataset';
import {ResultCurrent, ResultTop} from './result';

export const dataTypes = immutable.List.of(
  'numeric',
  'string',
  'lob',
  'date',
  'geo'
);

export const dispatchToken = register(({action, data}) => {

  switch (action) {

    case actions.fetchDatasetStart:
      datasetsCursor(datasets => {
        return datasets.set('current', new ResultCurrent);
      });
      break;

    case actions.fetchDatasetSuccess:
      datasetsCursor(datasets => {
        return datasets.updateIn(['current'], new ResultCurrent, result => {
          return result
            .set('error', false)
            .set('fetched', true)
            .set('dataset', Dataset.fromDB(immutable.fromJS(data)));
        });
      });
      break;

    case actions.fetchDatasetError:
      datasetsCursor(datasets => {
        return datasets.updateIn(['current'], new ResultCurrent, result => {
          return result.set('error', true);
        });
      });
      break;

    case actions.fetchTopDatasetsStart:
      datasetsCursor(datasets => {
        return datasets.updateIn(['top'], new ResultTop, result => {
          return result.set('fetched', false);
        });
      });
      break;

    case actions.fetchTopDatasetsSuccess:
      datasetsCursor(datasets => {
        return datasets.updateIn(['top'], new ResultTop, result => {
          return result
            .set('fetched', true)
            .set('list', immutable.fromJS(data).map(dataset => Dataset.fromDB(dataset)));
        });
      });
      break;

  }

});
