import {Map} from 'immutable';
import {ResultCurrent, ResultTop} from './result';

export default function(value) {
  return Map(value)
    .set('current', ResultCurrent.revive(value.get('current')))
    .set('top', ResultTop.revive(value.get('top')));
}
