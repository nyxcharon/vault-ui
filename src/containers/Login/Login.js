import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import * as authActions from 'redux/modules/auth';
import { Grid, Cell, Card, Textfield, Button } from 'react-mdl';

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
    this.props.login(username);
    // input.value = '';
  }

  render() {
    const {user, logout} = this.props;
    console.log(logout);
    // const styles = require('./Login.scss');
    return (
      <Card shadow={0} style={{width: '100%'}}>
        <Grid>
          {user &&
          <Cell col={12}>
            <h1>You are logged in. Grats.</h1>
          </Cell>
          }
          {!user &&
          <Cell col={12}>
            <h1>Login to Vault - UI</h1>
            <Textfield
                floatingLabel
                ref="username"
                onChange={() => {}}
                label="Username"
                style={{width: '100%'}}
            />
            <Textfield
                floatingLabel
                ref="password"
                onChange={() => {}}
                label="Password"
                style={{width: '100%'}}
                type="password"
            />
            <Button className="mdl-cell--bottom" style={{float: 'right'}} onClick={this.handleSubmit} raised colored ripple>Submit</Button>
          </Cell>
          }
        </Grid>
      </Card>
    );
  }
}
