import React from 'react';
import immutable from 'immutable';
import Component from '../common/component.react';
import exposeRouter from '../common/exposerouter.react';

require('./featureFunctionPastResults.styl');

@exposeRouter
export default class FeatureFunctionPastResults extends Component {

  static propTypes = {
    results: React.PropTypes.instanceOf(immutable.List).isRequired,
    router: React.PropTypes.func.isRequired
  }

  constructor() {
    super();
    this.state = {
      sortBy: 'datasetVersion',
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

  rowClicked(id) {
    this.props.router.transitionTo('featureFunctionDetail', {id: id});
  }

  render() {
    const results = this.props.results;

    return (
      <div className='FeatureFunctionPastResults'>
        <table>
          <thead>
            <tr>
              {this.renderHeaderCol('author', 'Author')}
              {this.renderHeaderCol('featureName', 'Feature name')}
              {this.renderHeaderCol('chi2Avg', 'Chi2 (avg)')}
              {this.renderHeaderCol('chi2Max', 'Chi2 (max)')}
              {this.renderHeaderCol('runTimeAvg', 'Run time (avg)')}
              {this.renderHeaderCol('runTimeMax', 'Run time (max)')}
              {this.renderHeaderCol('sqlOriginal', 'SQL')}
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
                  <tr key={r.featureId} onClick={() => this.rowClicked(r.featureId)}>
                    <td className='FeatureFunctionPastResults-author'>{r.author}</td>
                    <td className='FeatureFunctionPastResults-featureName'>{r.featureName}</td>
                    <td className='FeatureFunctionPastResults-chi2'>{r.chi2Avg}</td>
                    <td className='FeatureFunctionPastResults-chi2'>{r.chi2Max}</td>
                    <td className='FeatureFunctionPastResults-runTime'>{r.runTimeAvg} s</td>
                    <td className='FeatureFunctionPastResults-runTime'>{r.runTimeMax} s</td>
                    <td className='FeatureFunctionPastResults-sql' title={r.sqlOriginal}>{r.sqlOriginal}</td>
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
