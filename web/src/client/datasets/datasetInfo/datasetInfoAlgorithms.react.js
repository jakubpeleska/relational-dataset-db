import React from 'react';
import immutable from 'immutable';
import Component from '../../common/component.react.js';

require('./datasetInfoAlgorithms.styl');

export default class DatasetInfoAlgorithms extends Component {

  static propTypes = {
    algorithms: React.PropTypes.instanceOf(immutable.List).isRequired
  };

  constructor() {
    super();
    this.state = {
      sortBy: 'datasetVersion',
      order: 'asc',
      algorithms: null,
      showAll: false
    };
    this.toggleAll = this.toggleAll.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      algorithms: nextProps.algorithms
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
    const algorithms = this.state.algorithms || this.props.algorithms;

    return algorithms.count() === 0
      ? null
      : (
        <div className='DatasetInfoAlgorithms'>
          <h2>Algorithms</h2>
          <table>
            <thead>
              <tr>
                {this.renderHeaderCol('datasetVersion', 'Dataset version')}
                {this.renderHeaderCol('target', 'Target')}
                {this.renderHeaderCol('algorithm', 'Algorithm')}
                {this.renderHeaderCol('authorText', 'Author text')}
                {this.renderHeaderCol('measure', 'Measure')}
                {this.renderHeaderCol('value', 'Value')}
              </tr>
            </thead>
            <tbody>
              {algorithms
                .sort((lineA, lineB) => {
                  const valA = lineA.get(this.state.sortBy);
                  const valB = lineB.get(this.state.sortBy);
                  if (valA < valB)
                    return this.state.order === 'asc' ? -1 : 1;
                  else if (valA > valB)
                    return this.state.order === 'asc' ? 1 : -1;
                  return 0;
                })
                .slice(0, this.state.showAll ? algorithms.count() : 10)
                .map(a => {
                  return (
                    <tr>
                      <td>{a.datasetVersion}</td>
                      <td>{a.target}</td>
                      <td>{a.algorithm}</td>
                      <td className='DatasetInfoAlgorithms-authorText'><a href={a.authorUrl} target='_blank' title={a.authorText}>{a.authorText}</a></td>
                      <td>{a.measure}</td>
                      <td>{a.value}</td>
                    </tr>
                  );
                })}
            </tbody>
            {algorithms.count() > 10
              ? (
                <tfoot>
                  <tr>
                    <th colSpan='6'>
                      <a href='#' onClick={this.toggleAll}>
                        {!this.state.showAll
                          ? 'Show all algorithms'
                          : 'Show only first 10 algorithms'
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
