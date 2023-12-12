import * as contactActions from '../contact/actions';
import * as contributeActions from '../contribute/actions';
import * as featureFunctionActions from '../featureFunction/actions';
import {register} from '../lib/dispatcher';
import {appCursor} from '../state';
import Message from './message';

export const dispatchToken = register(({action, data}) => {

  switch (action) {

    case contactActions.submitContactFormSuccess:
    case contributeActions.submitContributeFormSuccess:
      appCursor(app => {
        return app.set('message', new Message({
          text: 'Your email has been sent.',
          error: false
        }));
      });
      break;

    case contactActions.submitContactFormError:
    case contributeActions.submitContributeFormError:
    case featureFunctionActions.submitFeatureFunctionFormError:
      appCursor(app => {
        return app.set('message', new Message({
          text: data.message,
          error: true
        }));
      });
      break;

    default:
      if (appCursor().get('message').text !== null) {
        appCursor(app => {
          return app.set('message', new Message());
        });
      }
      break;

  }

});
