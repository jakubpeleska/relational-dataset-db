import React from 'react';
import immutable from 'immutable';
import Component from '../common/component.react';
import Filter from './filter.react';
import {onSearchInputChange, onFilterCheckboxChange, submitSearchForm} from './actions';

require('./search.styl');

let t;

export default class Search extends Component {

  static propTypes = {
    search: React.PropTypes.instanceOf(immutable.Map).isRequired
  }

  onSubmit(e) {
    e.preventDefault();
    this.submit();
  }

  onSearchChange(e) {
    onSearchInputChange(e.target.value);
    if (t) clearTimeout(t);
    t = setTimeout(::this.submit, 500);
  }

  onFilterChange(e) {
    onFilterCheckboxChange(e.target.name, e.target.value, e.target.checked);
    setTimeout(::this.submit, 0);
  }

  submit() {
    const form = this.props.search.get('form');
    submitSearchForm(form);
  }

  render() {
    const values = this.props.search.get('form');
    const filter = this.props.search.get('filter');

    return (
      <form action='' method='get' onSubmit={::this.onSubmit}>
        <input
          autoComplete='off'
          className='Search'
          name='q'
          onChange={::this.onSearchChange}
          placeholder='Search for datasets'
          type='search'
          value={values.q}
        />
        <Filter filter={filter} onFilterChange={::this.onFilterChange} values={values} />
      </form>
    );
  }

}
