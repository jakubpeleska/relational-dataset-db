import * as actions from './actions';
import immutable from 'immutable';
import {register} from '../lib/dispatcher';
import {featureFunctionsCursor} from '../state';
import FeatureFunction from './featureFunction';
import {ResultCurrent} from './result';

export const dispatchToken = register(({action, data}) => {

  switch (action) {

    case actions.fetchFeatureFunctionStart:
      featureFunctionsCursor(featureFunctions => {
        return featureFunctions.set('current', new ResultCurrent);
      });
      break;

    case actions.fetchFeatureFunctionSuccess:
      featureFunctionsCursor(featureFunctions => {
        return featureFunctions.updateIn(['current'], new ResultCurrent, result => {
          return result
            .set('error', false)
            .set('fetched', true)
            .set('featureFunction', FeatureFunction.fromDB(immutable.fromJS(data)));
        });
      });
      break;

    case actions.fetchPastResultsSuccess:
      featureFunctionsCursor(featureFunctions => {
        return featureFunctions
          .set('pastResults', immutable.fromJS(data).map(featureFunction => FeatureFunction.fromDB(featureFunction)));
      });
      break;

  }

});
