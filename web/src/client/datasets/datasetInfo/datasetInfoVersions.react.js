import React from 'react';
import immutable from 'immutable';
import Component from '../../common/component.react.js';
import {capitalize} from '../../../lib/helpers';

require('./datasetInfoVersions.styl');

export default class DatasetInfoVersions extends Component {

  static propTypes = {
    versions: React.PropTypes.instanceOf(immutable.List).isRequired
  }

  render() {
    const versions = this.props.versions;

    return (
      <div className='DatasetInfoVersions'>
        <h3 className='DatasetInfoVersions-heading'>Versions</h3>
        <ul className='DatasetInfoVersions-list'>
          {versions.map((version, i) => {
            const modifications = (version.modifications ? version.modifications.split(/\n/) : null);
            return (
              <li key={'version-' + i}>
                <h4>
                  {capitalize(version.schema)}
                  {version.uploader
                    ? <small> (by {version.uploader})</small>
                    : null
                  }
                </h4>

                {modifications
                  ? (
                    <ul className='DatasetInfoVersions-modifications'>
                      {modifications.map((modification, j) => {
                        return (
                          <li key={'modification-' + i + '-' + j}>{modification}</li>
                        );
                      })}
                    </ul>
                  ) : null
                }

              </li>
            );
          })}
        </ul>
      </div>
    );
  }

}
