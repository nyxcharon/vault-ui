import React, { Component, PropTypes } from 'react';

import {mounts} from 'redux/modules/vault';


import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

@connect(
  state => ({butt: state.vault}),
  dispatch => bindActionCreators({mounts}, dispatch))
export default class Mounts extends Component {
  static propTypes = {
    mounts: PropTypes.func.isRequired,
    butt: PropTypes.object.isRequired,
  };

  onClick() {
    console.log('I clicked');
  }

  render() {
    const {mounts, butt} = this.props; // eslint-disable-line no-shadow
    /* const styles = require('./AppTest.scss'); */
    return (
      <div>
        <h3>Mounts</h3>
        <button onClick={mounts}>Check Health</button>
        <pre>{ JSON.stringify(butt, null, 2) }</pre>
      </div>
    );
  }
}
