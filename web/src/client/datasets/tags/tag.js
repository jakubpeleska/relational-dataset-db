import {Record} from 'immutable';

const TagRecord = Record({
  type: null,
  value: null,
  name: null,
  text: null
});

export default class Tag extends TagRecord {

  static revive = (props) => {
    return new Tag(props);
  }

}
