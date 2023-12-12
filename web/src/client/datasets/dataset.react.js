import React from 'react';
import {Link} from 'react-router';
import DatasetType from './dataset';
import Component from '../common/component.react';
import {truncateString} from '../lib/truncateString';
import TagList from './tags/taglist.react';
import {getTagsFromDataset} from './tags/store';

require('./dataset.styl');

export default class Dataset extends Component {

  static propTypes = {
    dataset: React.PropTypes.instanceOf(DatasetType)
  }

  render() {
    const dataset = this.props.dataset;

    return (
      <li className='Dataset'>
        <h3 className='Dataset-title'>
          <Link params={{title: dataset.title}} to='dataset'>{dataset.title}</Link>
        </h3>
        {dataset.description
          ? <p>{truncateString(dataset.description)}</p>
          : null
        }
        <TagList tags={getTagsFromDataset(dataset)} />
      </li>
    );
  }

}
