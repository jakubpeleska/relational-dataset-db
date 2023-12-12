import immutable, {List, Record} from 'immutable';

const FormRecord = Record({
  q: '',
  databaseSize: List(),
  tableCount: List(),
  type: List(),
  domain: List(),
  task: List(),
  missingValues: List(),
  dataType: List(),
  loops: List(),
  compoundKeys: List()
});

export default class Form extends FormRecord {

  static fromJS = (props) => {
    return new Form(immutable.fromJS(props));
  }

  static revive = (props) => {
    return new Form(props);
  }

  toJS(withoutEmpty = false) {
    return withoutEmpty
      ? this
          .toMap()
          .filter((n) => n !== '' && n.size !== 0)
          .toJS()
      : super
          .toJS();
  }
}
