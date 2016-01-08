import React, { Component, PropTypes } from 'react';
import { readUser } from 'redux/modules/user';
import { Button, Spinner } from 'react-mdl';
import { connect } from 'react-redux';

@connect(
  state => ({user: state.user.userData,
    userQuery: state.user.username,
    isLoading: state.user.userLoading,
    error: state.user.userError
    }),
  )
export default class UserView extends Component {
  static propTypes = {
    userName: PropTypes.string.isRequired,
    userQuery: PropTypes.string,
    isLoading: PropTypes.bool,
    user: PropTypes.object,
    dispatch: PropTypes.func,
    error: PropTypes.object
  }

  static defaultProps = {
    user: undefined,
    error: undefined
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.userQuery === this.props.userName;
  }

  fetchUser = () => {
    if (!this.props.isLoading) {
      this.props.dispatch(readUser(this.props.userName));
    }
  }

  render() {
    return (<div>
      <Button onClick={this.fetchUser}>Read!!</Button>
      <p>User Name: {this.props.userName}</p>
      <p>Policy: Awesome</p>
      <p>Changes</p>
      <Button onClick={this.fetchUser}>Read!</Button>
      { this.props.isLoading &&
        <Spinner/>
      }
      { !this.props.isLoading &&
        <div>
        { this.props.user &&
          <pre>{this.props.user.data.policies}</pre>
        }
        { this.props.error &&
        <pre>{this.props.error.message}</pre>
        }
        </div>
      }
    </div>);
  }
}
