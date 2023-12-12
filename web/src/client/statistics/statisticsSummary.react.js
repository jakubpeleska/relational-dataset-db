import React from 'react';
import {Link} from 'react-router';
import immutable from 'immutable';
import Component from '../common/component.react';
import {capitalize, getNameWithTooltip, getSizeWithUnit} from '../../lib/helpers';

require('./statisticsSummary.styl');

export default class StatisticsSummary extends Component {

  static propTypes = {
    summary: React.PropTypes.instanceOf(immutable.List).isRequired
  }

  constructor() {
    super();
    this.state = {
      sortBy: 'title',
      order: 'asc',
      summary: immutable.List()
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      summary: nextProps.summary
    });
  }

  sortBy(column) {
    this.setState({
      sortBy: column,
      order: (column === this.state.sortBy && this.state.order === 'asc' ? 'desc' : 'asc')
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
      >{getNameWithTooltip(title)}</th>
    );
  }

  render() {
    const summary = this.state.summary;

    return (
      <table className='StatisticsSummary'>
        <thead>
          <tr>
            {this.renderHeaderCol('title', 'Name')}
            {this.renderHeaderCol('tableCount', '#Relations')}
            {this.renderHeaderCol('columnCount', '#Attributes')}
            {this.renderHeaderCol('rowCount', '#Tuples')}
            {this.renderHeaderCol('instanceCount', '#Instances')}
            {this.renderHeaderCol('databaseSize', 'Size')}
            {this.renderHeaderCol('isArtificial', 'Type')}
            {this.renderHeaderCol('domain', 'Domain')}
            {this.renderHeaderCol('task', 'Task')}
            {this.renderHeaderCol('missingValues', 'Missing values')}
            {this.renderHeaderCol('loops', 'Loops')}
            {this.renderHeaderCol('compositeKeys', 'Compound keys')}
          </tr>
        </thead>

        <tbody>
          {summary
            .sort((lineA, lineB) => {
              const valA = lineA.get(this.state.sortBy);
              const valB = lineB.get(this.state.sortBy);
              if (valA < valB)
                return this.state.order === 'asc' ? -1 : 1;
              else if (valA > valB)
                return this.state.order === 'asc' ? 1 : -1;
              return 0;
            })
            .map(s => {
              return (
                <tr key={s.title}>
                  <td><Link params={{title: s.title}} to='dataset'>{s.title}</Link></td>
                  <td>{s.tableCount}</td>
                  <td>{s.columnCount}</td>
                  <td>{s.rowCount}</td>
                  <td>{s.instanceCount}</td>
                  <td>{getSizeWithUnit(s.databaseSize)}</td>
                  <td>{s.isArtificial ? 'Synthetic' : 'Real'}</td>
                  <td>{s.domain}</td>
                  <td><abbr title={capitalize(s.task)}>{s.task.substr(0, 2).toUpperCase()}</abbr></td>
                  <td>{s.missingValues ? 'Yes' : 'No'}</td>
                  <td>{s.loops ? 'Yes' : 'No'}</td>
                  <td>{s.compositeKeys ? 'Yes' : 'No'}</td>
                </tr>
              );
            })}
        </tbody>

        <tfoot>
          <tr>
            <th>{summary.count()} datasets</th>
            <th colSpan='11'>&nbsp;</th>
          </tr>
        </tfoot>
      </table>
    );
  }
}
