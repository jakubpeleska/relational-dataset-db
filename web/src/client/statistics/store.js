import * as actions from './actions';
import immutable from 'immutable';
import {register} from '../lib/dispatcher';
import {statisticsCursor} from '../state';
import Summary from './summary';
import Classifier from './classifier';

export const dispatchToken = register(({action, data}) => {

  switch (action) {

    case actions.fetchSummarySuccess:
      statisticsCursor(statistics => {
        return statistics
          .set('summary', immutable.fromJS(data).map(summary => Summary.fromDB(summary)));
      });
      break;
    case actions.fetchClassifiersSuccess:
      statisticsCursor(statistics => {
        return statistics
          .set('classifiers', immutable.fromJS(data).map(classifier => Classifier.fromDB(classifier)));
      });
      break;

  }

});
