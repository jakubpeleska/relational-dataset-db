import React from 'react';
import {Link} from 'react-router';
import Component from '../../common/component.react.js';
import DatasetType from '../dataset';
import {capitalize, getSizeWithUnit, getLocaleString, getTagName, getNameWithTooltip, tooltips} from '../../../lib/helpers';
import {getTableCountValue, getDataTypeText} from '../tags/store';

require('./datasetInfoDetails.styl');

export default class DatasetInfoDetails extends Component {

  static propTypes = {
    dataset: React.PropTypes.instanceOf(DatasetType).isRequired
  }

  render() {
    const dataset = this.props.dataset;
    const size = getSizeWithUnit(dataset.databaseSize);

    return (
      <div className='DatasetInfoDetails'>
        <h2>Dataset details</h2>
        <dl>
          <dt>{getNameWithTooltip('Associated task')}:</dt>
          <dd>
            {dataset.task
              ? <Link query={{task: [capitalize(dataset.task)]}} to='search'>
                  {getNameWithTooltip(dataset.task)}
                </Link>
              : '?'}
          </dd>

          <dt>{getNameWithTooltip('Domain')}:</dt>
          <dd>
            {dataset.domain
              ? <Link query={{domain: [dataset.domain]}} to='search'>
                  {getNameWithTooltip(dataset.domain)}
                </Link>
              : '?'}
          </dd>

          <dt>{getNameWithTooltip('Data types')}:</dt>
          <dd>
            <ul className='DatasetInfoDetails-dataTypes'>
              {this.getDataTypes(dataset)}
            </ul>
          </dd>

          <dt>{getNameWithTooltip('Size')}:</dt>
          <dd>
            {dataset.databaseSize
              ? <Link query={{databaseSize: [size.slice(-2)]}} to='search'>
                  {size}
                </Link>
              : '?'}
          </dd>

          <dt>{getNameWithTooltip('Count of tables')}:</dt>
          <dd>
            {dataset.tableCount
              ? <Link query={{tableCount: [getTableCountValue(dataset.tableCount)]}} to='search'>
                  {getLocaleString(dataset.tableCount)}
                </Link>
              : '?'}
          </dd>

          <dt>{getNameWithTooltip('Count of rows')}:</dt>
          <dd>{dataset.rowCount ? getLocaleString(dataset.rowCount) : '?'}</dd>

          <dt>{getNameWithTooltip('Count of columns')}:</dt>
          <dd>{dataset.columnCount ? getLocaleString(dataset.columnCount) : '?'}</dd>

          <dt>{getNameWithTooltip('Missing values')}:</dt>
          <dd>
            {dataset.missingValues !== null
              ? (dataset.missingValues
                  ? <Link query={{missingValues: ['With missing values']}} to='search'>Yes</Link>
                  : <Link query={{missingValues: ['Without missing values']}} to='search'>No</Link>)
              : '?'}
          </dd>

          <dt>{getNameWithTooltip('Compound keys')}:</dt>
          <dd>
            {dataset.compositeKeys !== null
              ? (dataset.compositeKeys
                  ? <Link query={{compoundKeys: ['With compound keys']}} to='search'>
                      <abbr title={tooltips['With compound keys']}>Yes</abbr>
                    </Link>
                  : <Link query={{compoundKeys: ['Without compound keys']}} to='search'>
                      <abbr title={tooltips['Without compound keys']}>No</abbr>
                    </Link>)
              : '?'}
          </dd>

          <dt>{getNameWithTooltip('Loops')}:</dt>
          <dd>
            {dataset.loops !== null
              ? (dataset.loops
                  ? <Link query={{loops: ['With loops']}} to='search'>
                      <abbr title={tooltips['With loops']}>Yes</abbr>
                    </Link>
                  : <Link query={{loops: ['Without loops']}} to='search'>
                      <abbr title={tooltips['Without loops']}>No</abbr>
                    </Link>)
              : '?'}
          </dd>
        </dl>
        <dl>
          <dt>{getNameWithTooltip('Type')}:</dt>
          <dd>
            {dataset.isArtificial !== null
              ? (dataset.isArtificial
                ? <Link query={{type: ['Synthetic']}} to='search'>{getNameWithTooltip('Synthetic')}</Link>
                : <Link query={{type: ['Real']}} to='search'>{getNameWithTooltip('Real')}</Link>)
              : '?'}
          </dd>

          <dt>{getNameWithTooltip('Instance count')}:</dt>
          <dd>{dataset.instanceCount ? getLocaleString(dataset.instanceCount) : '?'}</dd>

          <dt>{getNameWithTooltip('Target table')}:</dt>
          <dd>{dataset.targetTable ? dataset.targetTable : '?'}</dd>

          <dt>{getNameWithTooltip('Target column')}:</dt>
          <dd>{dataset.targetColumn ? dataset.targetColumn : '?'}</dd>

          <dt>{getNameWithTooltip('Target ID')}:</dt>
          <dd>{dataset.targetId ? dataset.targetId : '?'}</dd>

          <dt>{getNameWithTooltip('Target timestamp')}:</dt>
          <dd>{dataset.targetTimestamp ? dataset.targetTimestamp : '?'}</dd>
        </dl>
      </div>
    );
  }

  getDataTypes(dataset) {
    return dataset.dataTypes
      .map((dataType) => {
        return (
          <li key={dataType}>
            <Link query={{dataType: [getDataTypeText(dataType)]}} to='search'>
              {getTagName(dataType)}
            </Link>
          </li>
        );
      });
  }

}
