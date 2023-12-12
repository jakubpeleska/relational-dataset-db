import React from 'react';
import Component from '../common/component.react';
import FeatureFunctionType from './featureFunction';

require('./featureFunctionInfo.styl');

export default class FeatureFunctionInfo extends Component {

  static propTypes = {
    featureFunction: React.PropTypes.instanceOf(FeatureFunctionType).isRequired
  }

  render() {
    const featureFunction = this.props.featureFunction;

    return (
      <div className='FeatureFunctionInfo'>
        {featureFunction.author
          ? (
            <div className='FeatureFunctionInfo-row'>
              <strong>Author: </strong>
              {featureFunction.author}
            </div>
          ) : null
        }
        <div className='FeatureFunctionInfo-row'>
          <strong>Feature name: </strong>
          {featureFunction.featureName}
        </div>
        {featureFunction.featureDescription
          ? (
            <div className='FeatureFunctionInfo-row'>
              <strong>Feature function description: </strong>
              <div className='FeatureFunctionInfo-value'>{featureFunction.featureDescription}</div>
            </div>
          ) : null
        }
        {featureFunction.featureApplication
          ? (
            <div className='FeatureFunctionInfo-row'>
              <strong>Example application: </strong>
              <div className='FeatureFunctionInfo-value'>{featureFunction.featureApplication}</div>
            </div>
          ) : null
        }
        <div className='FeatureFunctionInfo-row'>
          <strong>Query: </strong>
          <div className='FeatureFunctionInfo-value'>{featureFunction.sqlOriginal}</div>
        </div>
      </div>
    );
  }
}
