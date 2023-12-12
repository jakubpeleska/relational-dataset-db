import React from 'react';
import DatasetType from '../dataset';
import Component from '../../common/component.react.js';
import DatasetInfoSource from './datasetInfoSource.react.js';
import DatasetInfoVersions from './datasetInfoVersions.react.js';

require('./datasetInfoSummary.styl');

export default class DatasetInfoSummary extends Component {

  static propTypes = {
    dataset: React.PropTypes.instanceOf(DatasetType).isRequired
  }

  render() {
    const dataset = this.props.dataset;

    return (
      <div className='DatasetInfoSummary'>
        <h1 className='DatasetInfoSummary-heading'>{dataset.title}</h1>

        {dataset.alternativeNames
          ? (
            <p className='DatasetInfoSummary-alternativeNames'>
              <span>Alternative names: </span>
              <span>{dataset.alternativeNames}</span>
            </p>
          )
          : null}

        <p className='DatasetInfoSummary-description'>
          {dataset.description}
        </p>

        <DatasetInfoSource bibtex={dataset.bibtexPath} origin={dataset.origin} />

        {dataset.versions.size
          ? <DatasetInfoVersions versions={dataset.versions} />
          : null
        }
      </div>
    );
  }

}
