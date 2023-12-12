import React from 'react';
import immutable from 'immutable';
import Component from '../common/component.react';

require('./featureFunctionDetails.styl');

export default class FeatureFunctionDetails extends Component {

  static propTypes = {
    results: React.PropTypes.instanceOf(immutable.List).isRequired
  }

  constructor() {
    super();
    this.state = {
      sortBy: 'tableName',
      order: 'asc',
      results: immutable.List(),
      showAll: false
    };
    this.toggleAll = this.toggleAll.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      results: nextProps.results
    });
  }

  sortBy(column) {
    this.setState({
      sortBy: column,
      order: (column === this.state.sortBy && this.state.order === 'asc' ? 'desc' : 'asc')
    });
  }

  toggleAll(e) {
    e.preventDefault();
    this.setState({
      showAll: !this.state.showAll
    });
  }

  renderHeaderCol(column, title) {
    let className = '';
    if (this.state.sortBy === column)
      className += 'TableCol-active-' + this.state.order;
    return (
      <th
        className={className}
        onClick={() => this.sortBy(column)}
      >{title}</th>
    );
  }

  render() {
    const results = this.state.results;

    return (
      <div className='FeatureFunctionDetails'>
        <table>
          <thead>
            <tr>
              {this.renderHeaderCol('tableName', '@table')}
              {this.renderHeaderCol('col1', '@col1')}
              {this.renderHeaderCol('col1DataType', '@col1 data type')}
              {this.renderHeaderCol('col2', '@col2')}
              {this.renderHeaderCol('col2DataType', '@col2 data type')}
              {this.renderHeaderCol('chi2', 'Chi2')}
              {this.renderHeaderCol('runTime', 'Run time')}
              {this.renderHeaderCol('errorMessage', 'Error')}
              {this.renderHeaderCol('sql', 'SQL')}
            </tr>
          </thead>
          <tbody>
            {results
              .sort((lineA, lineB) => {
                const valA = lineA.get(this.state.sortBy);
                const valB = lineB.get(this.state.sortBy);
                if (valA < valB)
                  return this.state.order === 'asc' ? -1 : 1;
                else if (valA > valB)
                  return this.state.order === 'asc' ? 1 : -1;
                return 0;
              })
              .slice(0, this.state.showAll ? results.count() : 10)
              .map((r) => {
                return (
                  <tr>
                    <td>{r.tableName}</td>
                    <td>{r.col1}</td>
                    <td>{r.col1DataType}</td>
                    <td>{r.col2}</td>
                    <td>{r.col2DataType}</td>
                    <td>{r.chi2}</td>
                    <td>{r.runTime}</td>
                    <td>{r.errorMessage}</td>
                    <td className='FeatureFunctionDetails-sql' title={r.sql}>{r.sql}</td>
                  </tr>
                );
              })}
          </tbody>
          {results.count() > 10
            ? (
              <tfoot>
                <tr>
                  <th colSpan='8'>
                    <a href='#' onClick={this.toggleAll}>
                      {!this.state.showAll
                        ? 'Show all results'
                        : 'Show only first 10 results'
                      }
                    </a>
                  </th>
                </tr>
              </tfoot>
            ) : null
          }
        </table>
      </div>
    );
  }

}
