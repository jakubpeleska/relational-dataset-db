import {dispatch, dispatchAsync} from '../lib/dispatcher';
import {getDataset, getTopDatasets} from '../../services/dataset/fetcher';
import resolver from '../../lib/resolver';

export function fetchDataset(datasetTitle: string) {
  fetchDatasetStart();
  const promise = (resolve) => {
    getDataset(datasetTitle)
      .then((data) => {
        fetchDatasetSuccess(data);
        resolve();
      })
      .catch((error) => {
        fetchDatasetError(error);
        resolve(error);
      });
  };
  return dispatchAsync(fetchDataset, resolver.resolve(promise));
}
export function fetchDatasetStart() { dispatch(fetchDatasetStart); }
export function fetchDatasetSuccess(data) { dispatch(fetchDatasetSuccess, data); }
export function fetchDatasetError(error) { dispatch(fetchDatasetError, error); }

export function fetchTopDatasets(count = 12) {
  fetchTopDatasetsStart();
  const promise = (resolve) => {
    getTopDatasets(count)
      .then((data) => {
        fetchTopDatasetsSuccess(data);
        resolve();
      })
      .catch((error) => {
        fetchTopDatasetsError(error);
        resolve(error);
      });
  };
  return dispatchAsync(fetchTopDatasets, resolver.resolve(promise));
}
export function fetchTopDatasetsStart() { dispatch(fetchTopDatasetsStart); }
export function fetchTopDatasetsSuccess(data) { dispatch(fetchTopDatasetsSuccess, data); }
export function fetchTopDatasetsError(error) { dispatch(fetchTopDatasetsError, error); }
