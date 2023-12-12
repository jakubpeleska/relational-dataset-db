import React from 'react';
import Component from '../common/component.react';
import {focusInvalidField} from '../lib/validation';
import {submitContributeForm} from './actions';
import Message from '../app/message';

require('./contributeForm.styl');

export default class ContributeForm extends Component {

  static propTypes = {
    message: React.PropTypes.instanceOf(Message).isRequired
  }

  onSubmit(e) {
    e.preventDefault();

    const values = {
      name: e.target['name'].value,
      origin: e.target['origin'].value,
      dataset: e.target['dataset'].value,
      description: e.target['description'].value,
      comment: e.target['comment'].value
    };

    submitContributeForm(values)
      .then(() => this.resetForm())
      .catch(focusInvalidField(this));
  }

  resetForm() {
    this.refs.name.getDOMNode().value = '';
    this.refs.origin.getDOMNode().value = '';
    this.refs.dataset.getDOMNode().value = '';
    this.refs.description.getDOMNode().value = '';
    this.refs.comment.getDOMNode().value = '';
  }

  renderMessage(message) {
    return message.error
      ? (
        <div className='ContributeForm-error'>{message.text}</div>
      )
      : (
        <div className='ContributeForm-success'>{message.text}</div>
      );
  }

  render() {
    return (
      <div className='ContributeForm'>
        <h3>If you have a relational dataset, please, consider sharing it: </h3>
        <form action='' method='post' onSubmit={::this.onSubmit}>
          {this.props.message.text
            ? this.renderMessage(this.props.message)
            : null
          }
          <label htmlFor='ContributeForm-name'>Your name:</label>
          <input
            className='ContributeForm-input'
            id='ContributeForm-name'
            name='name'
            placeholder='John Doe'
            ref='name'
            type='text'
          />

          <label htmlFor='ContributeForm-origin'>Dataset origin:</label>
          <input
            className='ContributeForm-input'
            id='ContributeForm-origin'
            name='origin'
            placeholder='http://relational.fit.cvut.cz'
            ref='origin'
            type='text'
          />

          <label className='ContributeForm-required' htmlFor='ContributeForm-dataset'>Dataset name:</label>
          <input
            className='ContributeForm-input'
            id='ContributeForm-dataset'
            name='dataset'
            placeholder='Dataset'
            ref='dataset'
            required
            type='text'
          />

          <label className='ContributeForm-required' htmlFor='ContributeForm-description'>Dataset description:</label>
          <textarea
            className='ContributeForm-input'
            id='ContributeForm-description'
            name='description'
            ref='description'
            required
          ></textarea>

          <label htmlFor='ContributeForm-comment'>
            <span className='ContributeForm-required'>Comment:</span>
            <small>(with the description how and where to obtain the dataset - csv/dump on web/Dropbox/FTP, live database, ...)</small>
          </label>
          <textarea
            className='ContributeForm-input'
            id='ContributeForm-comment'
            name='comment'
            placeholder='The dataset is publicly available directly from MySQL database. Use following credentials: ...'
            ref='comment'
            required
          ></textarea>

          <button
            className='ContributeForm-button'
            name='submit'
            type='submit'
          >Send</button>
        </form>
      </div>
    );
  }

}
