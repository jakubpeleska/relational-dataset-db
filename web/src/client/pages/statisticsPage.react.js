import React from 'react';
import immutable from 'immutable';
import DocumentTitle from 'react-document-title';
import Component from '../common/component.react';
import ContributorsChart from '../contributors/contributorsChart.react';
import ClassifiersChart from '../statistics/classifiersChart.react';
import StatisticsSummary from '../statistics/statisticsSummary.react';
import {fetchContributors} from '../contributors/actions';
import {fetchClassifiers, fetchSummary} from '../statistics/actions';

require('./statisticsPage.styl');

export default class StatisticsPage extends Component {

  static propTypes = {
    contributors: React.PropTypes.instanceOf(immutable.Map).isRequired,
    statistics: React.PropTypes.instanceOf(immutable.Map).isRequired
  }

  componentWillMount() {
    fetchSummary();
    fetchClassifiers();
    fetchContributors();
  }

  render() {
    const contributors = this.props.contributors.get('list');
    const classifiers = this.props.statistics.get('classifiers');
    const summary = this.props.statistics.get('summary');

    const leftMargin = contributors.reduce((prev, next) => {
      const x = prev.name ? prev.name.toString().length : prev;
      const y = next.name ? next.name.toString().length : next;
      return x > y ? x : y;
    }) || 100;

    return (
      <DocumentTitle title='Statistics'>
        <section className='content'>

          <section className='Statistics-section'>
            <h2>Summary Statistics</h2>
            <StatisticsSummary summary={summary} />
          </section>

          <section className='Statistics-section'>
            <h2>Classifier's Ranking</h2>
            <p>Bigger value is better.</p>
            <ClassifiersChart
              classifiers={classifiers}
              height={450}
              title = ''
              width={892}
            />
          </section>

          <section className='Statistics-section'>
            <h2>Top Contributors</h2>
            <ContributorsChart
              data={contributors}
              height={contributors.count() * 75}
              margins={{top: 0, right: 20, bottom: 20, left: (leftMargin + 2) * 8}}
              title=''
              width={992}
            />
          </section>
        </section>
      </DocumentTitle>
    );
  }

}
