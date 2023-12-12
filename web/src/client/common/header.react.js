import React from 'react';
import {Link} from 'react-router';
import Component from '../common/component.react';

require('./header.styl');

export default class Header extends Component {

  render() {
    return (
      <header className='Header'>
        <div className='Header-inner'>
          <Link to='home'><h1>Relational Dataset Repository</h1></Link>
          <ul className='Header-nav'>
            <li><Link to='search'>All Datasets</Link></li>
            <li><Link to='contribute'>Contribute</Link></li>
            <li><Link to='contact'>Contact</Link></li>
            <li><Link to='featureFunction'>Feature function</Link></li>
            <li><Link to='statistics'>Statistics</Link></li>
            <li><Link to='about'>About</Link></li>
          </ul>
        </div>
      </header>
    );
  }

}
