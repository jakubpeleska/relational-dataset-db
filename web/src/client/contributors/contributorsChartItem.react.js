import React from 'react';
import Component from '../common/component.react';

export default class ContributorsChartItem extends Component {

  static propTypes = {
    label: React.PropTypes.string.isRequired,
    value: React.PropTypes.number.isRequired,
    xScale: React.PropTypes.func.isRequired,
    yScale: React.PropTypes.func.isRequired
  }

  render() {
    const xScale = this.props.xScale;
    const yScale = this.props.yScale;

    const barWidth = xScale(this.props.value) - xScale(0);
    const barHeight = yScale.rangeBand();

    const transform = 'translate(0,' + yScale(this.props.label) + ')';

    return (
      <g transform={transform}>
        <rect
          aria-label={this.props.label + ': ' + this.props.value}
          className='rd3-barchart-bar'
          height={barHeight}
          width={barWidth}
        />
        <text
          className='rd3-barchart-text'
          dy='.35em'
          x={barWidth - 10}
          y={barHeight / 2}
        >{this.props.value}</text>
      </g>
    );
  }

}
