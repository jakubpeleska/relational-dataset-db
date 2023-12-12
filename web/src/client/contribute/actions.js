import {dispatch, dispatchAsync} from '../lib/dispatcher';
import {sendContribution} from '../../services/contribute/fetcher';
import resolver from '../../lib/resolver';
import {validate} from '../lib/validation';

function validateContributeForm(values: Object) {
  return validate(values)
    .prop('dataset').required()
    .prop('description').required()
    .prop('comment').required()
    .promise;
}

export function submitContributeForm(values: Object) {
  const promise = (resolve, reject) => {
    validateContributeForm(values)
      .then(() => sendContribution(values))
      .then((data) => {
        submitContributeFormSuccess();
        resolve();
      })
      .catch((error) => {
        submitContributeFormError(error);
        reject(error);
      });
  };
  return dispatchAsync(submitContributeForm, resolver.resolve(promise));
}
export function submitContributeFormSuccess() { dispatch(submitContributeFormSuccess); }
export function submitContributeFormError(error) { dispatch(submitContributeFormError, error); }
