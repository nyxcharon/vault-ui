import React, { Component, PropTypes } from 'react';

import {health} from 'redux/modules/vault';


import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

@connect(
  state => ({butt: state.vault}),
  dispatch => bindActionCreators({health}, dispatch))
export default class AppTest extends Component {
  static propTypes = {
    health: PropTypes.func.isRequired,
    butt: PropTypes.object.isRequired,
  };

  onClick() {
    console.log('I clicked');
  }

  render() {
    const {health, butt} = this.props; // eslint-disable-line no-shadow
    /* const styles = require('./AppTest.scss'); */
    return (
      <div>
        <h3>Health Check</h3>
        <button onClick={health}>Check Health</button>
        <pre>{ JSON.stringify(butt, null, 2) }</pre>
      </div>
    );
  }
}
