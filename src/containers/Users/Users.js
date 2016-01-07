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
    console.log(users);
    console.log(isLoading);

    const userNames = users.map((userName) => {
      return (<UserName name={userName}/>);
    });

    return (
      <div>
        <h1>Users</h1>
          {userNames}
      </div>
    );
  }
}
