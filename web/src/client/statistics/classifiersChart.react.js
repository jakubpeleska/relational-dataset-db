import React from 'react';
import immutable from 'immutable';
import {ScatterChart} from 'react-d3';
import Component from '../common/component.react';
import _ from 'underscore';

require('./classifiersChart.styl');

export default class ClassifiersChart extends Component {

  static propTypes = {
    classifiers: React.PropTypes.instanceOf(immutable.List).isRequired,
    height: React.PropTypes.number,
    margins: React.PropTypes.object,
    title: React.PropTypes.string,
    width: React.PropTypes.number
  }

  static defaultProps = {
    width: 600,
    height: 400,
    margins: {top: 10, right: 20, bottom: 50, left: 50},
    title: ''
  }

  preprocessData(classifiers) {
    const types = _.groupBy(classifiers.toJS(), (classifier) => { return classifier.type; });
    const data = Object.keys(types).map((name) => {
      const values = types[name].map((classifier) => { return { x: classifier.released, y: classifier.ranking, data: {height: 220} }; });
      return {
        name: name,
        values: values
      };
    });
    return data;
  }

  render() {
    const data = this.preprocessData(this.props.classifiers);
    const width = this.props.width;
    const height = this.props.height;
    const margins = this.props.margins;
    const title = this.props.title;

    return (
      <div className='ClassifiersChart'>
        <ScatterChart
          data={data}
          height={height}
          legend={true}
          margins={margins}
          pointRadius={5}
          title={title}
          width={width}
          xAxisLabel="Released"
          yAxisLabel="Ranking"
        />
      </div>
    );
  }

}
