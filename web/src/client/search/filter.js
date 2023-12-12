import {List, Record} from 'immutable';

const FilterRecord = Record({
  shrinked: List()
});

export default class Filter extends FilterRecord {

  static revive = (props) => {
    return new Filter(props);
  }

}
