import {dispatch, dispatchAsync} from '../lib/dispatcher';
import {getContributors} from '../../services/contributor/fetcher';
import resolver from '../../lib/resolver';

export function fetchContributors() {
  const promise = (resolve) => {
    getContributors()
      .then((data) => {
        fetchContributorsSuccess(data);
        resolve();
      })
      .catch((error) => {
        fetchContributorsError(error);
        resolve(error);
      });
  };
  return dispatchAsync(fetchContributors, resolver.resolve(promise));
}
export function fetchContributorsSuccess(data) { dispatch(fetchContributorsSuccess, data); }
export function fetchContributorsError(error) { dispatch(fetchContributorsError, error); }
