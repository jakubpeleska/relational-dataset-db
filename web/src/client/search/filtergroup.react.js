import React from 'react';
import {List} from 'immutable';
import Component from '../common/component.react';
import {toggleFilterGroup} from './actions';
import {getTagName} from '../../lib/helpers';

require('./filtergroup.styl');

export default class FilterGroup extends Component {

  static propTypes = {
    checked: React.PropTypes.instanceOf(List),
    displayName: React.PropTypes.string.isRequired,
    name: React.PropTypes.string.isRequired,
    onChange: React.PropTypes.func.isRequired,
    shrinked: React.PropTypes.bool.isRequired,
    values: React.PropTypes.array.isRequired
  }

  onKeyPress(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      this.toggle();
    }
  }

  onClick(e) {
    e.preventDefault();
    this.toggle();
  }

  toggle() {
    toggleFilterGroup(this.props.name, this.props.shrinked);
  }

  render() {
    const className = 'FilterGroup FilterGroup--' + (this.props.shrinked ? 'shrinked' : 'expanded');
    return (
      <div className={className}>
        <h4
          className='FilterGroup-heading'
          onClick={::this.onClick}
          onKeyUp={::this.onKeyPress}
          role='button'
          tabIndex='0'
          >{this.props.displayName}
        </h4>

        <div className='FilterGroup-body'>
          {this.props.values.map((value, i) => {
            const checked = (this.props.checked.indexOf(value) !== -1);
            return (
              <label className='FilterGroup-line' key={this.props.name + '-' + i}>
                <input
                  checked={checked}
                  name={this.props.name + '[]'}
                  onChange={this.props.onChange}
                  type='checkbox'
                  value={value}
                />
                {getTagName(value)}
              </label>
            );
          })}
        </div>
      </div>
    );
  }

}
