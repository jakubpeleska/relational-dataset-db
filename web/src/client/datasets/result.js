import {Map, Record, List} from 'immutable';
import Dataset from './dataset';

const ResultCurrentRecord = Record({
  dataset: new Dataset(),
  fetched: false,
  error: false
});

export class ResultCurrent extends ResultCurrentRecord {

  static revive = (props) => {
    if (props instanceof Map) {
      props = props.set('dataset', Dataset.revive(props.get('dataset')));
    }
    return new ResultCurrent(props);
  }

}

const ResultTopRecord = Record({
  list: List(),
  fetched: false
});

export class ResultTop extends ResultTopRecord {

  static revive = (props) => {
    if (props instanceof Map) {
      props = props
        .set('list', props.get('list').map(dataset => Dataset.revive(dataset)));
    }
    return new ResultTop(props);
  }

}
