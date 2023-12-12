import {Record} from 'immutable';

const MessageRecord = Record({
  'text': null,
  'error': false
});

export default class Message extends MessageRecord {

  static revive = (props) => {
    return new Message(props);
  }

}
