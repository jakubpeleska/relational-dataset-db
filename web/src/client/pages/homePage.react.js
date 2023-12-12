import React from 'react';
import immutable from 'immutable';
import DocumentTitle from 'react-document-title';
import Component from '../common/component.react';
import Dataset from '../datasets/dataset.react';
import {fetchTopDatasets} from '../datasets/actions';

require('./homePage.styl');

export default class HomePage extends Component {

  static propTypes = {
    datasets: React.PropTypes.instanceOf(immutable.Map).isRequired
  }

  componentWillMount() {
    const result = this.props.datasets.get('top');

    if (!fetchTopDatasets.pending && !result.fetched) {
      return fetchTopDatasets();
    }
  }

  render() {
    const topDatasets = this.props.datasets.get('top');

    return (
      <DocumentTitle title='Relational Dataset Repository'>
        <section className='content'>
          <h1>Top datasets</h1>
          {topDatasets.fetched
            ? (
              <ul className='TopDatasets'>
              {topDatasets.list.map((dataset, i) => {
                return <Dataset dataset={dataset} key={dataset.title} />;
              })}
              </ul>
            ) : null
          }
        </section>
      </DocumentTitle>
    );
  }

}
