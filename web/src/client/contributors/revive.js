import {Map} from 'immutable';
import Contributor from './contributor';

export default function(value) {
  return Map(value)
    .set('list', value.get('list').map(contributor => Contributor.revive(contributor)));
}
