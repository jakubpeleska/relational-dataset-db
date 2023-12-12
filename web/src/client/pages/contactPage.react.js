import React from 'react';
import immutable from 'immutable';
import DocumentTitle from 'react-document-title';
import Component from '../common/component.react';
import ContactForm from '../contact/contactForm.react';

export default class ContactPage extends Component {

  static propTypes = {
    app: React.PropTypes.instanceOf(immutable.Map).isRequired
  }

  render() {
    return (
      <DocumentTitle title='Contact'>
        <section className='content'>
          <h1>Contact</h1>
          <ContactForm message={this.props.app.get('message')}/>
        </section>
      </DocumentTitle>
    );
  }

}
