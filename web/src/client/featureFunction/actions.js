import {dispatch, dispatchAsync} from '../lib/dispatcher';
import {getFeatureFunction, getPastResults, sendFeatureFunction} from '../../services/featureFunction/fetcher';
import resolver from '../../lib/resolver';
import {validate, ValidationError} from '../lib/validation';

export function fetchFeatureFunction(featureId) {
  fetchFeatureFunctionStart();
  const promise = (resolve) => {
    getFeatureFunction(featureId)
      .then((data) => {
        fetchFeatureFunctionSuccess(data);
        resolve();
      })
      .catch((error) => {
        fetchFeatureFunctionError(error);
        resolve(error);
      });
  };
  return dispatchAsync(fetchFeatureFunction, resolver.resolve(promise));
}
export function fetchFeatureFunctionStart() { dispatch(fetchFeatureFunctionStart); }
export function fetchFeatureFunctionSuccess(data) { dispatch(fetchFeatureFunctionSuccess, data); }
export function fetchFeatureFunctionError(error) { dispatch(fetchFeatureFunctionError, error); }

export function fetchPastResults() {
  const promise = (resolve) => {
    getPastResults()
      .then((data) => {
        fetchPastResultsSuccess(data);
        resolve();
      })
      .catch((error) => {
        fetchPastResultsError(error);
        resolve(error);
      });
  };
  return dispatchAsync(fetchPastResults, resolver.resolve(promise));
}
export function fetchPastResultsSuccess(data) { dispatch(fetchPastResultsSuccess, data); }
export function fetchPastResultsError(error) { dispatch(fetchPastResultsError, error); }

function validateFeatureFunctionForm(values: Object) {
  return validate(values)
    .prop('featureName').required()
    .prop('sql').required()
    .prop('sql').custom((value, prop) => {
      const requiredVariables = ['@table', '@target', '@feature'];
      requiredVariables.forEach(item => {
        if (value.indexOf(item) === -1)
          throw new ValidationError(
            'Required variable ' + item + ' not found in your query.',
            prop
          );
      });
      return;
    })
    .promise;
}

export function submitFeatureFunctionForm(values: Object) {
  const promise = (resolve, reject) => {
    validateFeatureFunctionForm(values)
      .then(() => sendFeatureFunction(values))
      .then((data) => {
        submitFeatureFunctionFormSuccess();
        resolve(data);
      })
      .catch((error) => {
        submitFeatureFunctionFormError(error);
        reject(error);
      });
  };
  return dispatchAsync(submitFeatureFunctionForm, resolver.resolve(promise));
}
export function submitFeatureFunctionFormSuccess() { dispatch(submitFeatureFunctionFormSuccess); }
export function submitFeatureFunctionFormError(error) { dispatch(submitFeatureFunctionFormError, error); }
