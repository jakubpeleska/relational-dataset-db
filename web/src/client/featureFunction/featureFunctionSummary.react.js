import React from 'react';
import immutable from 'immutable';
import Component from '../common/component.react';

require('./featureFunctionSummary.styl');

export default class FeatureFunctionSummary extends Component {

  static propTypes = {
    summary: React.PropTypes.instanceOf(immutable.List).isRequired
  }

  constructor() {
    super();
    this.state = {
      sortBy: 'col1DataType',
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
      >{title}</th>
    );
  }

  render() {
    const summary = this.state.summary;

    return (
      <div className='FeatureFunctionSummary'>
        <table>
          <thead>
            <tr>
              {this.renderHeaderCol('col1DataType', 'Attribute data type')}
              {this.renderHeaderCol('appliedCount', 'Applied/Applicable')}
              {this.renderHeaderCol('chi2Avg', 'Mean(Chi2) (avg)')}
              {this.renderHeaderCol('chi2Max', 'Mean(Chi2) (max)')}
              {this.renderHeaderCol('runTimeAvg', 'Run time [s] (avg)')}
              {this.renderHeaderCol('runTimeMax', 'Run time [s] (max)')}
            </tr>
          </thead>
          <tbody>
            {summary
              .sort((lineA, lineB) => {
                let valA = lineA.get(this.state.sortBy);
                let valB = lineB.get(this.state.sortBy);

                if (this.state.sortBy === 'col1DataType') {
                  valA += (lineA.col2DataType === 'null' ? ', ' + lineA.col2DataType : '');
                  valB += (lineB.col2DataType === 'null' ? ', ' + lineB.col2DataType : '');
                } else if (this.state.sortBy === 'appliedCount') {
                  valA += '/' + lineA.applicableCount;
                  valB += '/' + lineB.applicableCount;
                }

                if (valA < valB)
                  return this.state.order === 'asc' ? -1 : 1;
                else if (valA > valB)
                  return this.state.order === 'asc' ? 1 : -1;
                return 0;
              })
              .map((s, i) => {
                return (
                  <tr key={i}>
                    <td>{s.col1DataType + (s.col2DataType === 'null' ? ', ' + s.col2DataType : '')}</td>
                    <td>{s.appliedCount}/{s.applicableCount}</td>
                    <td>{s.chi2Avg}</td>
                    <td>{s.chi2Max}</td>
                    <td>{s.runTimeAvg}</td>
                    <td>{s.runTimeMax}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    );
  }
}
