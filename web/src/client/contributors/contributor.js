import {Record} from 'immutable';

const ContributorRecord = Record({
  name: '',
  url: '',
  count: 0
});

export default class Contributor extends ContributorRecord {

  static revive = (props) => {
    return new Contributor(props);
  }

}
