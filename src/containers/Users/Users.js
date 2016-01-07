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
  state => ({users: state.users.data}),
  authActions)
export default class Users extends Component {
  static propTypes = {
    load: PropTypes.func,
    users: PropTypes.array
  }

  componentWillMount() {
    console.log('Calling load');
    this.props.load();
  }

  render() {
    const { users } = this.props;
    console.log(users);

/*
    if (users == null) {
      return (<p>null</p>);
    }
    */
/*

*/
    var userNames = users.map(function(userName,key) {
      return (<UserName name={userName}/>);
    });

    // console.log(`User Load ${typeof thing} ${users}`);

    return (
      <div>
        <h1>Users</h1>
        {userNames}
      </div>
    );
  }
}
