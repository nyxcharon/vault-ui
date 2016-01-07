import React, {Component, PropTypes} from 'react';

import {connect} from 'react-redux';
import * as authActions from 'redux/modules/auth';
import {
  Grid,
  Cell,
  Card,
  Textfield,
  CardTitle,
  CardText,
  CardActions,
  CardMenu,
  IconButton,
  Button
} from 'react-mdl';


@connect(
  state => ({user: state.auth.user}),
  authActions)
export default class Login extends Component {
  static propTypes = {
    user: PropTypes.object,
    login: PropTypes.func,
    logout: PropTypes.func
  }

  handleSubmit = (event) => {
    event.preventDefault();
    // This ref stuff could maybe be better?
    const username = this.refs.username.refs.input.value;
    const password = this.refs.password.refs.input.value;
    console.log(`Received username: ${username}, pw: ${password}`);
    this.props.login(username, password);
  }

  handleLogout = (event) => {
    event.preventDefault();
    this.props.logout();
  }

  render() {
    const {user} = this.props;

    const containerStyle = {
      maxWidth: "960px",
      margin: "40px auto"

    };

    const cardTitleStyle = {
      marginTop: '20px',
      height: '200px',
      background: 'url(https://hashicorp.com/images/blog/vault/list-c8bf47c8.png) center / contain',
      backgroundRepeat:  'no-repeat'
    };

    return (
      <div style={containerStyle}>
      {!user &&
        <form onSubmit={this.handleSubmit}>
          <Card shadow={0} style={{width: '512px', margin: 'auto'}}>
            <div style={cardTitleStyle}></div>
            <CardTitle>Please sign in</CardTitle>
            <CardText>
                <Textfield
                    floatingLabel
                    ref="username"
                    onChange={() => {}}
                    label="Username"
                    style={{fontSize: '1em', width: '100%'}}
                />
                <Textfield
                    floatingLabel
                    ref="password"
                    onChange={() => {}}
                    label="Password"
                    style={{width: '100%'}}
                    type="password"
                />
            </CardText>
            <CardActions border>
              <Button style={{float: 'right'}} type="submit" raised ripple>Login</Button>
            </CardActions>
          </Card>
        </form>
      }
      {user &&
        <div>
          <h1>Signed in bro</h1>

          <Button className="mdl-cell--bottom" style={{float: 'right'}} onClick={this.handleLogout} raised colored ripple>Logout</Button>
        </div>
      }
      </div>
    );
  }
}
