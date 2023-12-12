import {Map} from 'immutable';
import Filter from './filter';
import Form from './form';
import Result from './result';

export default function(value) {
  return Map(value)
    .set('filter', Filter.revive(value.get('filter')))
    .set('form', Form.revive(value.get('form')))
    .set('result', Result.revive(value.get('result')));
}
