import {Record} from 'immutable';

const ClassifierRecord = Record({
  algorithm: null,
  type: null,
  released: null,
  ranking: null,
  referenceCount: null
});

export default class Classifier extends ClassifierRecord {

  static fromDB = (props) => {
    return new Classifier({
      algorithm: props.get('algorithm'),
      type: props.get('type'),
      released: props.get('released'),
      ranking: props.get('ranking'),
      referenceCount: props.get('referenceCount')
    });
  }

  static revive = (props) => {
    return new Classifier(props);
  }

}
