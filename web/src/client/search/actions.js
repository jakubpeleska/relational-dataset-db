import {dispatch, dispatchAsync} from '../lib/dispatcher';
import {getSearchResults} from '../../services/dataset/fetcher';
import resolver from '../../lib/resolver';
import Form from './form';

export function onSearchInputChange(value: string) {
  dispatch(onSearchInputChange, value);
}

export function onFilterCheckboxChange(name, value, checked) {
  name = name.substr(0, name.length - 2); // remove []
  dispatch(onFilterCheckboxChange, {name, value, checked});
}

export function submitSearchForm(form: Form) {
  const router = require('../router');
  const query = form.toJS(true);

  router.transitionTo('search', null, query);
}

export function toggleFilterGroup(name: string, shrinked: bool) {
  dispatch(toggleFilterGroup, {name, shrinked});
}

export function fetchSearchResults(form: Form) {
  fetchSearchResultsStart(form);
  const promise = (resolve) => {
    getSearchResults(form.toJS())
      .then((data) => {
        fetchSearchResultsSuccess(data);
        resolve();
      })
      .catch((error) => {
        fetchSearchResultsError(error);
        resolve(error);
      });
  };
  return dispatchAsync(fetchSearchResults, resolver.resolve(promise));
}
export function fetchSearchResultsStart(form: Form) { dispatch(fetchSearchResultsStart, form); }
export function fetchSearchResultsSuccess(data) { dispatch(fetchSearchResultsSuccess, data); }
export function fetchSearchResultsError(error) { dispatch(fetchSearchResultsError, error); }
