import immutable from 'immutable';
import * as actions from './actions';
import {register} from '../lib/dispatcher';
import {searchCursor} from '../state';
import Form from './form';
import Result from './result';
import Dataset from '../datasets/dataset';

export const dispatchToken = register(({action, data}) => {

  switch (action) {

    case actions.onSearchInputChange:
      searchCursor(search => {
        return search.updateIn(['form'], new Form, form => {
          return form
            .set('q', data);
        });
      });
      break;

    case actions.onFilterCheckboxChange:
      searchCursor(search => {
        const {name, value, checked} = data;
        return search.updateIn(['form', name], immutable.List(), list => {
          return checked
            ? list.push(value)
            : list.delete(list.indexOf(value));
        });
      });
      break;

    case actions.toggleFilterGroup:
      searchCursor(search => {
        const {name, shrinked} = data;
        return search.updateIn(['filter', 'shrinked'], immutable.List(), list => {
          return shrinked
            ? list.delete(list.indexOf(name))
            : list.push(name);
        });
      });
      break;

    case actions.fetchSearchResultsStart:
      searchCursor(search => {
        return search
          .set('form', data)
          .updateIn(['result'], new Result, result => {
            return result
              .set('query', data)
              .set('fetched', false);
          });
      });
      break;

    case actions.fetchSearchResultsSuccess:
      searchCursor(search => {
        return search.updateIn(['result'], new Result, result => {
          return result
            .set('fetched', true)
            .set('list', immutable.fromJS(data).map(dataset => Dataset.fromDB(dataset)));
        });
      });
      break;

  }

});
