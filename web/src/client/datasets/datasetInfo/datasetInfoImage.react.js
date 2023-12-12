import React from 'react';
import Component from '../../common/component.react.js';
import {getImagePath} from '../../../lib/helpers';

require('./datasetInfoImage.styl');

export default class DatasetInfoImage extends Component {

  static propTypes = {
    image: React.PropTypes.string,
    schema: React.PropTypes.string,
    title: React.PropTypes.string
  }

  constructor(props) {
    super(props);

    this.state = {image: props ? getImagePath(props.image, props.schema) : null};
  }

  componentWillReceiveProps(props) {
    this.setState({
      image: props ? getImagePath(props.image, props.schema) : null
    });
  }

  render() {
    const title = this.props.title;
    const image = this.state.image;

    return (
      <div className='DatasetInfoImage'>
        { image
          ? <a href={image}><img alt={title} src={image} title={title} /></a>
          : null}
      </div>
    );
  }
}
