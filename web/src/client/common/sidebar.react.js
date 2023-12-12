import React from 'react';
import immutable from 'immutable';
import Component from '../common/component.react';
import Search from '../search/search.react';

require('./sidebar.styl');

export default class Sidebar extends Component {

  static propTypes = {
    search: React.PropTypes.instanceOf(immutable.Map).isRequired
  }

  render() {
    return (
      <section className='Sidebar'>
        <Search search={this.props.search} />
      </section>
    );
  }

}
