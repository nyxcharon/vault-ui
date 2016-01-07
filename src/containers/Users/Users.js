import React, { Component, PropTypes } from 'react';
import * as authActions from 'redux/modules/users';
import {connect} from 'react-redux';

class UserName extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired
  }

  render() {
    // console.log(`Rendering name ${this.props.name}`)
    return (<p>{this.props.name}</p>);
  }
}

@connect(
  state => ({users: state.users.data,
    isLoading: state.users.isLoading}),
  authActions)
export default class Users extends Component {
  static propTypes = {
    load: PropTypes.func,
    users: PropTypes.array,
    isLoading: PropTypes.bool
  }

  componentWillMount() {
    console.log('Calling load');
    this.props.load();
  }

  render() {
    const { users, isLoading } = this.props;
    let display = null;
    console.log(`Users Loading: ${isLoading}`);

    if (!isLoading && users !== null) {
      display = users.map((userName, index) => {
        return (<UserName name={userName} key={index}/>);
      });
    } else {
      display = null;
    }

    return (
      <div>
        <h1>Users</h1>
        { isLoading &&
          <p>Loading Users!</p>
        }
        { !isLoading &&
          display
        }
      </div>
    );
  }
}
