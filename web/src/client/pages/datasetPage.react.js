import React from 'react';
import immutable from 'immutable';
import DocumentTitle from 'react-document-title';
import Component from '../common/component.react';
import DatasetInfo from '../datasets/datasetInfo/datasetInfo.react.js';
import exposeRouter from '../common/exposerouter.react';
import {fetchDataset} from '../datasets/actions';

@exposeRouter
export default class DatasetPage extends Component {

  static propTypes = {
    datasets: React.PropTypes.instanceOf(immutable.Map).isRequired,
    router: React.PropTypes.func.isRequired
  }

  componentWillMount() {
    const datasetTitle = this.props.router.getCurrentParams().title;
    const result = this.props.datasets.get('current');

    if (!fetchDataset.pending && (!result.fetched || datasetTitle !== result.dataset.title)) {
      return fetchDataset(datasetTitle);
    }
  }

  render() {
    const result = this.props.datasets.get('current');

    if (result.error) {
      return (
        <DocumentTitle title='Dataset'>
          <section className='content'>
            Dataset not found.
          </section>
        </DocumentTitle>
      );
    }

    return (
      <DocumentTitle title='Dataset'>
        <section className='content'>
          {result.fetched
            ? <DatasetInfo dataset={result.dataset} />
            : null
          }
        </section>
      </DocumentTitle>
    );
  }
}

