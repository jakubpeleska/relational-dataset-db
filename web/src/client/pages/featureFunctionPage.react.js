import React from 'react';
import immutable from 'immutable';
import DocumentTitle from 'react-document-title';
import Component from '../common/component.react';
import {fetchPastResults} from '../featureFunction/actions';
import FeatureFunctionForm from '../featureFunction/featureFunctionForm.react';
import FeatureFunctionPastResults from '../featureFunction/featureFunctionPastResults.react';

require('./featureFunctionPage.styl');

export default class FeatureFunctionPage extends Component {

  static propTypes = {
    app: React.PropTypes.instanceOf(immutable.Map).isRequired,
    featureFunctions: React.PropTypes.instanceOf(immutable.Map).isRequired
  }

  componentWillMount() {
    return fetchPastResults();
  }

  render() {
    const pastResults = this.props.featureFunctions.get('pastResults');

    return (
      <DocumentTitle title='Relational Dataset Repository'>
        <section className='content'>
          <h1>Feature function</h1>
          <p>
            Feature functions define construction of a feature.
            For example sum pattern, which sums column by subject in table could be described as:
            <pre className='FeatureFunctionPage-example'>
              SELECT subject, SUM(COLUMN) AS feature FROM TABLE GROUP BY subject;
            </pre>
          </p>
          <p>
            To make the features transferable, it is a good idea to parametrize them.
            Following variables are automatically defined by the engine:
            <dl>
              <dt>@table</dt>
              <dd><strong>Required</strong>: The name of the relation.</dd>
              <dt>@col1, @col2</dt>
              <dd>Optional: Names of the input attributes. Use either @col1 alone or together with @col2.</dd>
              <dt>@id</dt>
              <dd>Optional: An attribute with the entity id.</dd>
              <dt>@timestamp</dt>
              <dd>Optional: An attribute, which defines a time sequence.</dd>
              <dt>@target</dt>
              <dd><strong>Required</strong>: An attribute with the label.</dd>
              <dt>@feature</dt>
              <dd><strong>Required</strong>: The name of the attribute with the created feature.</dd>
            </dl>
          </p>

          <h2>MySQL query:</h2>
          <FeatureFunctionForm message={this.props.app.get('message')} />

          <h2>Past results:</h2>
          <FeatureFunctionPastResults results={pastResults} />
        </section>
      </DocumentTitle>
    );
  }

}
