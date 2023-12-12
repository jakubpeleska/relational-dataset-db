import {dispatch, dispatchAsync} from '../lib/dispatcher';
import {sendContact} from '../../services/contact/fetcher';
import resolver from '../../lib/resolver';
import {validate} from '../lib/validation';

function validateContactForm(values: Object) {
  return validate(values)
    .prop('email').required().email()
    .prop('message').required()
    .promise;
}

export function submitContactForm(values: Object) {
  const promise = (resolve) => {
    validateContactForm(values)
      .then(() => sendContact(values))
      .then((data) => {
        submitContactFormSuccess();
        resolve();
      })
      .catch((error) => {
        submitContactFormError(error);
        resolve(error);
      });
  };
  return dispatchAsync(submitContactForm, resolver.resolve(promise));
}
export function submitContactFormSuccess() { dispatch(submitContactFormSuccess); }
export function submitContactFormError(error) { dispatch(submitContactFormError, error); }
