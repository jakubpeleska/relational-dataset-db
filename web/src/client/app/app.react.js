import React from 'react';
import {RouteHandler} from 'react-router';
import Component from '../common/component.react';
import exposeRouter from '../common/exposerouter.react';
import Header from '../common/header.react';
import * as appState from '../state';

import '../app/store';
import '../contributors/store';
import '../datasets/store';
import '../featureFunction/store';
import '../search/store';
import '../statistics/store';

require('./app.styl');

@exposeRouter
export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = this.getState();
  }

  static propTypes = {
    router: React.PropTypes.func
  }

  getState() {
    return {
      app: appState.appCursor(),
      pendingActions: appState.pendingActionsCursor(),
      contributors: appState.contributorsCursor(),
      datasets: appState.datasetsCursor(),
      featureFunctions: appState.featureFunctionsCursor(),
      search: appState.searchCursor(),
      statistics: appState.statisticsCursor(),
      tags: appState.tagsCursor()
    };
  }

  componentDidMount() {
    appState.state.on('change', () => {
      this.setState(this.getState());
    });
  }

  render() {
    return (
      <div className='page'>
        <Header />
        <RouteHandler {...this.state} />
      </div>
    );
  }

}
