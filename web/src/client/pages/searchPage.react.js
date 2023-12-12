import React from 'react';
import immutable from 'immutable';
import DocumentTitle from 'react-document-title';
import FormType from '../search/form';
import Component from '../common/component.react';
import DatasetList from '../datasets/datasetlist.react';
import Sidebar from '../common/sidebar.react';
import exposeRouter from '../common/exposerouter.react';
import {fetchSearchResults} from '../search/actions';

require('./searchPage.styl');

@exposeRouter
export default class SearchPage extends Component {

  static propTypes = {
    router: React.PropTypes.func.isRequired,
    search: React.PropTypes.instanceOf(immutable.Map).isRequired
  }

  componentWillMount() {
    const query = FormType.fromJS(this.props.router.getCurrentQuery());
    const result = this.props.search.get('result');

    if (!fetchSearchResults.pending && (!result.fetched || !query.equals(result.query))) {
      return fetchSearchResults(query);
    }
  }

  componentWillReceiveProps(props) {
    const query = FormType.fromJS(this.props.router.getCurrentQuery());
    const result = this.props.search.get('result');

    if (!fetchSearchResults.pending && (!result.fetched || !query.equals(result.query))) {
      return fetchSearchResults(query);
    }
  }

  renderContent() {
    const result = this.props.search.get('result');

    if (!result.fetched)
      return <div className='SearchPage-header'>Loading...</div>;
    if (result.list.count() === 0)
      return <div className='SearchPage-header'>No results</div>;
    return [
      <div className='SearchPage-header' key='header'>{result.list.count()} datasets found...</div>,
      <DatasetList datasets={result.list} key='list' />
    ];
  }

  render() {
    return (
      <DocumentTitle title='Search'>
        <section className='content'>
          <section className='primary'>
            {this.renderContent()}
          </section>
          <Sidebar {...this.props} />
        </section>
      </DocumentTitle>
    );
  }

}
