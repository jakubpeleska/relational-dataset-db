import React from 'react';
import Component from '../../common/component.react.js';

export default class DatasetInfoSource extends Component {

  static propTypes = {
    bibtex: React.PropTypes.string,
    origin: React.PropTypes.string
  }

  render() {
    const origin = this.props.origin;
    const originText = (origin && origin.split('/').length >= 2 ? origin.split('/')[2] : origin);

    const bibtex = this.props.bibtex
      ? (
        <span> (<a href={'/assets/bibtex/' + this.props.bibtex}>BibTeX</a>)</span>
      ) : null;

    return origin
      ? (
        <p>
          Original source: <a href={origin}>{originText}</a>
          {bibtex}
        </p>
      ) : bibtex;
  }

}
