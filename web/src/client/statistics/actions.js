import {dispatch, dispatchAsync} from '../lib/dispatcher';
import {getClassifiers, getSummary} from '../../services/statistics/fetcher';
import resolver from '../../lib/resolver';

export function fetchSummary() {
  const promise = (resolve) => {
    getSummary()
      .then((data) => {
        fetchSummarySuccess(data);
        resolve();
      })
      .catch((error) => {
        fetchSummaryError(error);
        resolve(error);
      });
  };
  return dispatchAsync(fetchSummary, resolver.resolve(promise));
}
export function fetchSummarySuccess(data) { dispatch(fetchSummarySuccess, data); }
export function fetchSummaryError(error) { dispatch(fetchSummaryError, error); }

export function fetchClassifiers() {
  const promise = (resolve) => {
    getClassifiers()
      .then((data) => {
        fetchClassifiersSuccess(data);
        resolve();
      })
      .catch((error) => {
        fetchClassifiersError(error);
        resolve(error);
      });
  };
  return dispatchAsync(fetchClassifiers, resolver.resolve(promise));
}
export function fetchClassifiersSuccess(data) { dispatch(fetchClassifiersSuccess, data); }
export function fetchClassifiersError(error) { dispatch(fetchClassifiersError, error); }
