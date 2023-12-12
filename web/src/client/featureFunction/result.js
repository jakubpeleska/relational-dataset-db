import {Map, Record} from 'immutable';
import FeatureFunction from './featureFunction';

const ResultCurrentRecord = Record({
  featureFunction: new FeatureFunction(),
  fetched: false,
  error: false
});

export class ResultCurrent extends ResultCurrentRecord {

  static revive = (props) => {
    if (props instanceof Map) {
      props = props.set('featureFunction', FeatureFunction.revive(props.get('featureFunction')));
    }
    return new ResultCurrent(props);
  }

}
