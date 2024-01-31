import React from 'react';
import Component from '../../common/component.react.js';
import DatasetType from '../dataset';

export default class DatasetInfoDownload extends Component {

  static propTypes = {
    dataset: React.PropTypes.instanceOf(DatasetType).isRequired
  }

  render() {
    const dataset = this.props.dataset;

    return (
      <div className='DatasetInfoDownload'>
        <h2>How to download the dataset</h2>
        <p>
          The datasets are publicly available directly from MariaDB database.
        </p>
        <ol>
          <li>
            Open your favourite MariaDB client (<a href='http://www.mysql.com/products/workbench/'>MySQL Workbench</a> works, but see <a href="https://relational.fit.cvut.cz/about">FAQ</a>)
          </li>
          <li>
            Use following credentials:
            <ul>
              <li>hostname: {dataset.dbInfo.host}</li>
              <li>port: {dataset.dbInfo.port}</li>
              <li>username: {dataset.dbInfo.user}</li>
              <li>password: {dataset.dbInfo.password}</li>
            </ul>
          </li>
          <li>
            Export "{this.props.dataset.schema}" database (or other version of the dataset, if available) in your favourite format (e.g. CSV or SQL dump).
          </li>
        </ol>
      </div>
    );
  }

}
