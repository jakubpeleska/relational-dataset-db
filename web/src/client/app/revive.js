import {Map} from 'immutable';
import Message from './message';

export default function(value) {
  return Map(value)
    .set('message', Message.revive(value.get('message')));
}
