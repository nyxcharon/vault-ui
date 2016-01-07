import React, { Component, PropTypes } from 'react';
import {connect} from 'react-redux';
import connectData from 'helpers/connectData';

import {mounts} from 'redux/modules/vault';


function fetchData(getState, dispatch) {
  console.log('calling load mounts');
  const promises = [];
  promises.push(dispatch(mounts()));
  return Promise.all(promises);
}


class MountData extends Component {
  static propTypes = {
    data: PropTypes.object
  }

  render() {
    console.log(`Secret group: ${this.props.data} Data: ${this.props.data}`);
  }
}


@connectData(fetchData)
@connect(
  state => ({vault: state.vault.mounts}))
export default class Mounts extends Component {
  static propTypes = {
    mounts: PropTypes.object
  };

  onClick() {
    console.log('I clicked');
  }

  render() {
    const {mounts} = this.props; // eslint-disable-line no-shadow

    console.log('reunder mounts', mounts);
    let display;
    if (mounts !== undefined) {
      console.log('derpy mounts');
      console.log(mounts);
      display = Object.keys(mounts).map((key) => {
        return (<MountData data={mounts[key]} />);
      });
      console.log(display);
    } else {
      display = null;
    }

    return (
      <div>
        <h3>Mounts</h3>
        { display }
      </div>
    );
  }
}
