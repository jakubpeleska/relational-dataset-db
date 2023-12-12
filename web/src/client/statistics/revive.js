import {Map} from 'immutable';
import Summary from './summary';

export default function(value) {
  return Map(value)
    .set('summary', value.get('summary').map(summary => Summary.revive(summary)));
}
