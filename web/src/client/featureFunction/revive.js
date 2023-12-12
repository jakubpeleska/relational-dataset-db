import {Map} from 'immutable';
import FeatureFunction from './featureFunction';
import {ResultCurrent} from './result';

export default function(value) {
  return Map(value)
    .set('current', ResultCurrent.revive(value.get('current')))
    .set('pastResults', value.get('pastResults').map(featureFunction => FeatureFunction.revive(featureFunction)));
}
