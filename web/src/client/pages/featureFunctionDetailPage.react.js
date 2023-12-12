import React from 'react';
import immutable from 'immutable';
import DocumentTitle from 'react-document-title';
import Component from '../common/component.react';
import exposeRouter from '../common/exposerouter.react';
import {fetchFeatureFunction} from '../featureFunction/actions';
import FeatureFunctionInfo from '../featureFunction/featureFunctionInfo.react';
import FeatureFunctionSummary from '../featureFunction/featureFunctionSummary.react';
import FeatureFunctionDetails from '../featureFunction/featureFunctionDetails.react';

@exposeRouter
export default class FeatureFunctionDetailPage extends Component {

  static propTypes = {
    featureFunctions: React.PropTypes.instanceOf(immutable.Map).isRequired,
    router: React.PropTypes.func.isRequired
  }

  componentWillMount() {
    const featureId = this.props.router.getCurrentParams().id;
    const result = this.props.featureFunctions.get('current');

    if (!fetchFeatureFunction.pending && (!result.fetched || featureId !== result.featureFunction.featureId)) {
      return fetchFeatureFunction(featureId);
    }
  }

  render() {
    const result = this.props.featureFunctions.get('current');

    if (result.error) {
      return (
        <DocumentTitle title='Feature Function'>
          <section className='content'>
            Feature function not found.
          </section>
        </DocumentTitle>
      );
    }

    return (
      <DocumentTitle title='Relational Dataset Repository'>
        {result.fetched
          ? (
            <section className='content'>
              <h1>Feature function</h1>

              <FeatureFunctionInfo featureFunction={result.featureFunction} />

              <h2>Summary:</h2>
              <FeatureFunctionSummary summary={result.featureFunction.summary} />

              <h2>Details:</h2>
              <FeatureFunctionDetails results={result.featureFunction.results} />
            </section>
          ) : null
        }
      </DocumentTitle>
    );
  }

}
