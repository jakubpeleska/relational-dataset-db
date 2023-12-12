import React from 'react';
import {Link} from 'react-router';
import Component from '../../common/component.react';
import TagType from './tag';
import {getTagName} from '../../../lib/helpers';

require('./tag.styl');

export default class Tag extends Component {

  static propTypes = {
    tag: React.PropTypes.instanceOf(TagType)
  }

  render() {
    const tag = this.props.tag;
    const className = 'Tag Tag--' + tag.type;
    let query = {};
    query[tag.type] = tag.value;

    return (
      <Link className={className} query={query} title={tag.name} to='search'>
        {getTagName(tag.text)}
      </Link>
    );
  }

}
