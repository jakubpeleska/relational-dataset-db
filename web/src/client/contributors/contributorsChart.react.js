import React from 'react';
import immutable from 'immutable';
import d3 from 'd3';
import {Chart, XAxis, YAxis} from 'react-d3/common';
import Component from '../common/component.react';
import ContributorsChartItem from './contributorsChartItem.react';

require('./contributorsChart.styl');

export default class ContributorsChart extends Component {

  static propTypes = {
    data: React.PropTypes.instanceOf(immutable.List).isRequired,
    height: React.PropTypes.number,
    margins: React.PropTypes.object,
    title: React.PropTypes.string,
    width: React.PropTypes.number
  }

  static defaultProps = {
    width: 600,
    height: 200,
    title: '',
    margins: {top: 0, right: 20, bottom: 20, left: 100}
  }

  render() {
    const data = this.props.data;
    const margins = this.props.margins;
    const width = this.props.width;
    const height = this.props.height;
    const padding = 0.25;

    const labels = data.map((item) => { return item.name; }).toArray();
    const values = data.map((item) => { return item.count; }).toArray();

    const sideMargins = margins.left + margins.right;
    const topBottomMargins = margins.top + margins.bottom;

    const xScale = d3.scale.linear()
      .domain([d3.min([d3.min(values), 0]), d3.max(values)])
      .range([0, width - sideMargins]);

    const yScale = d3.scale.ordinal()
      .domain(labels)
      .rangeRoundBands([0, height - topBottomMargins], padding);

    const transform = 'translate(' + margins.left + ',' + margins.top + ')';

    return (
      <Chart height={height} title={this.props.title} width={width}>
        <g className='rd3-barchart' transform={transform}>
          <g>
            {values.map((value, i) => {
              return (
                <ContributorsChartItem
                  key={i}
                  label={labels[i]}
                  value={value}
                  xScale={xScale}
                  yScale={yScale}
                />
              );
            })}
          </g>
          <YAxis
            height={height - topBottomMargins}
            margins={margins}
            tickFormatting={(d) => {
              const url = this.props.data.find((value) => d === value.name).url;
              return url
                ? <tspan dangerouslySetInnerHTML={{__html: `<a xlink:href="${url}">${d}</a>`}} />
                : d;
            }}
            tickSize={0}
            width={width - sideMargins}
            yAxisClassName='rd3-barchart-yaxis'
            yAxisOffset={-10}
            yScale={yScale}
          />
          <XAxis
            height={height - topBottomMargins}
            margins={margins}
            stroke={'#000'}
            width={width - sideMargins}
            xAxisClassName='rd3-barchart-xaxis'
            xScale={xScale}
          />
        </g>
      </Chart>
    );
  }

}
