import React from 'react';
import Component from '../common/component.react';
import {focusInvalidField} from '../lib/validation';
import {submitFeatureFunctionForm} from './actions';
import exposeRouter from '../common/exposerouter.react';
import LaddaButton from 'react-ladda';
import Message from '../app/message';

require('ladda/dist/ladda.min.css');
require('./featureFunctionForm.styl');

@exposeRouter
export default class FeatureFunctionForm extends Component {

  static propTypes = {
    message: React.PropTypes.instanceOf(Message).isRequired,
    router: React.PropTypes.func.isRequired
  }

  constructor() {
    super();
    this.state = { loading: false };
  }

  onSubmit(e) {
    e.preventDefault();

    const values = {
      author: e.target['author'].value,
      featureName: e.target['feature_name'].value,
      featureDescription: e.target['feature_description'].value,
      featureApplication: e.target['feature_application'].value,
      sql: e.target['sql'].value
    };

    this.setState({ loading: true });

    submitFeatureFunctionForm(values)
      .then((data) => this.resetForm(data))
      .catch((err) => {
        this.setState({ loading: false });
        focusInvalidField(this)(err);
      });
  }

  resetForm(data) {
    this.setState({ loading: false });
    this.refs.author.getDOMNode().value = '';
    this.refs.featureName.getDOMNode().value = '';
    this.refs.featureDescription.getDOMNode().value = '';
    this.refs.featureApplication.getDOMNode().value = '';
    this.refs.sql.getDOMNode().value = '';
    this.props.router.transitionTo('featureFunctionDetail', {id: data});
  }

  renderMessage(message) {
    return message.error
      ? (
        <div className='FeatureFunctionForm-error'>{message.text}</div>
      )
      : (
        <div className='FeatureFunctionForm-success'>{message.text}</div>
      );
  }

  render() {
    return (
      <div className='FeatureFunctionForm'>
        <form action='' method='post' onSubmit={::this.onSubmit}>
          {this.props.message.text
            ? this.renderMessage(this.props.message)
            : null
          }
          <label htmlFor='author'>Your name:</label>
          <input
            className='FeatureFunctionForm-input'
            id='author'
            name='author'
            placeholder='John Doe'
            ref='author'
            type='text'
          />

          <label className='FeatureFunctionForm-required' htmlFor='feature_name'>Feature function name:</label>
          <input
            className='FeatureFunctionForm-input'
            id='feature_name'
            name='feature_name'
            placeholder='aggregate_max'
            ref='featureName'
            required
            type='text'
          />

          <label htmlFor='feature_description'>Feature function description:</label>
          <textarea
            className='FeatureFunctionForm-input'
            id='feature_description'
            name='feature_description'
            placeholder='Aggregates a numerical attribute with a maximum function.'
            ref='featureDescription'
          ></textarea>

          <label htmlFor='feature_application'>Example application:</label>
          <textarea
            className='FeatureFunctionForm-input'
            id='feature_application'
            name='feature_application'
            placeholder='The maximum withdrawal from an ATM.'
            ref='featureApplication'
          ></textarea>

          <label className='FeatureFunctionForm-required' htmlFor='sql'>Your query:</label>
          <textarea
            className='FeatureFunctionForm-input'
            id='sql'
            name='sql'
            placeholder='SELECT @id, @target, max(@col1) as @feature FROM @table GROUP BY @id, @target'
            ref='sql'
            required
          ></textarea>

          <LaddaButton
            buttonStyle='expand-right'
            className='FeatureFunctionForm-button'
            loading={this.state.loading}
          >Submit</LaddaButton>
        </form>
      </div>
    );
  }
}
