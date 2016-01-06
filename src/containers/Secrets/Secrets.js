import React, { Component, PropTypes } from 'react';

import {secrets} from 'redux/modules/vault';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

@connect(
  state => ({butt: state.vault}),
  dispatch => bindActionCreators({secrets}, dispatch))
export default class Mounts extends Component {
  static propTypes = {
    secrets: PropTypes.func.isRequired,
    butt: PropTypes.object.isRequired,
  };

  onClick(event) {
    event.preventDefault();
    this.props.secrets('secret/test');
    console.log('I clicked');
  }

  render() {
    const {butt} = this.props; // eslint-disable-line no-shadow
    /* const styles = require('./AppTest.scss'); */
    return (
      <div>
        <h3>Secrets</h3>
        <button onClick={this.onClick.bind(this)}>Get secret/test</button>
        <pre>{ JSON.stringify(butt, null, 2) }</pre>
      </div>
    );
  }
}
