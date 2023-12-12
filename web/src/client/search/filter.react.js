import React from 'react';
import FormType from './form';
import FilterType from './filter';
import Component from '../common/component.react';
import FilterGroup from './filtergroup.react';

export default class Filter extends Component {

  static propTypes = {
    filter: React.PropTypes.instanceOf(FilterType),
    onFilterChange: React.PropTypes.func.isRequired,
    values: React.PropTypes.instanceOf(FormType)
  }

  render() {
    const values = this.props.values;
    const shrinked = this.props.filter.get('shrinked');

    return (
      <div className='Filter'>
        <FilterGroup
          checked={values.databaseSize}
          displayName='Size'
          name='databaseSize'
          onChange={this.props.onFilterChange}
          shrinked={shrinked.includes('databaseSize')}
          values={['KB', 'MB', 'GB']}
        />

        <FilterGroup
          checked={values.tableCount}
          displayName='Tables'
          name='tableCount'
          onChange={this.props.onFilterChange}
          shrinked={shrinked.includes('tableCount')}
          values={['0-10', '10-30', '30+']}
        />

        <FilterGroup
          checked={values.type}
          displayName='Type'
          name='type'
          onChange={this.props.onFilterChange}
          shrinked={shrinked.includes('type')}
          values={['Real', 'Synthetic']}
        />

        <FilterGroup
          checked={values.domain}
          displayName='Domain'
          name='domain'
          onChange={this.props.onFilterChange}
          shrinked={shrinked.includes('domain')}
          values={['Education', 'Entertainment', 'Financial', 'Geography', 'Government', 'Industry', 'Kinship', 'Medicine',  'Retail', 'Sport']}
        />

        <FilterGroup
          checked={values.task}
          displayName='Task'
          name='task'
          onChange={this.props.onFilterChange}
          shrinked={shrinked.includes('task')}
          values={['Classification', 'Regression']}
        />

        <FilterGroup
          checked={values.dataType}
          displayName='Data type'
          name='dataType'
          onChange={this.props.onFilterChange}
          shrinked={shrinked.includes('dataType')}
          values={['Temporal', 'Spatial', 'LOB', 'Numeric', 'String']}
        />

        <FilterGroup
          checked={values.missingValues}
          displayName='Missing values'
          name='missingValues'
          onChange={this.props.onFilterChange}
          shrinked={shrinked.includes('missingValues')}
          values={['With missing values', 'Without missing values']}
        />

        <FilterGroup
          checked={values.loops}
          displayName='Loops'
          name='loops'
          onChange={this.props.onFilterChange}
          shrinked={shrinked.includes('loops')}
          values={['With loops', 'Without loops']}
        />

        <FilterGroup
          checked={values.compoundKeys}
          displayName='Compound keys'
          name='compoundKeys'
          onChange={this.props.onFilterChange}
          shrinked={shrinked.includes('compoundKeys')}
          values={['With compound keys', 'Without compound keys']}
        />
      </div>
    );
  }

}
