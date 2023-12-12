import * as actions from './actions';
import immutable from 'immutable';
import {register} from '../lib/dispatcher';
import {contributorsCursor} from '../state';
import Contributor from './contributor';

export const dispatchToken = register(({action, data}) => {

  switch (action) {

    case actions.fetchContributorsSuccess:
      contributorsCursor(contributors => {
        return contributors
          .set('list', immutable.fromJS(data).map(contributor => {
            return new Contributor({
              name: contributor.get('uploader_name'),
              url: contributor.get('uploader_url'),
              count: contributor.get('count')
            });
          }));
      });
      break;

  }

});
