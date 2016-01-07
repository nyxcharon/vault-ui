import React, { Component, PropTypes } from 'react';

import {health} from 'redux/modules/vault';


import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

@connect(
  state => ({data: state.vault}),
  dispatch => bindActionCreators({health}, dispatch))
export default class AppTest extends Component {
  static propTypes = {
    health: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired,
  };

  handleHealthClick = (event) => {
    event.preventDefault();
    this.props.health();
    return;
  }

  render() {
    const {data} = this.props; // eslint-disable-line no-shadow
    /* const styles = require('./AppTest.scss'); */
    return (
      <div>
        <h3>Health Check</h3>
        <button onClick={this.handleHealthClick}>Check Health</button>
        <pre>{ JSON.stringify(data, null, 2) }</pre>
      </div>
    );
  }
}
