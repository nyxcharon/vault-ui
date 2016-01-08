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
    data: PropTypes.object,
    id: PropTypes.string
  }

  render() {
    console.log('data', this.props.data);
    console.log('id', this.props.id);
    return (
      <div>
        <div>name = { this.props.id }</div>
        <div>description = { this.props.data.description }</div>
      </div>
    );
  }
}


@connectData(fetchData)
@connect(
  state => ({mounts: state.vault.mounts}))
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
        return (<MountData id={key} data={mounts[key]} />);
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
