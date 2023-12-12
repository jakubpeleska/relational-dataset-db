import {List, Map, Record} from 'immutable';
import Form from './form';
import Dataset from '../datasets/dataset';

const ResultRecord = Record({
  query: new Form(),
  fetched: false,
  list: List()
});

export default class Result extends ResultRecord {

  static revive = (props) => {
    if (props instanceof Map) {
      props = props
        .set('query', Form.revive(props.get('query')))
        .set('list', props.get('list').map(dataset => Dataset.revive(dataset)));
    }
    return new Result(props);
  }

}
