import React from 'react';
import Component from './component.react';

export default function exposeRouter(BaseComponent) {

  class ExposeRouter extends Component {

    static contextTypes = {
      router: React.PropTypes.func.isRequired
    }

    static displayName = `${BaseComponent.name}ExposeRouter`

    render() {
      return <BaseComponent {...this.props} router={this.context.router} />;
    }

  }

  return ExposeRouter;

}
