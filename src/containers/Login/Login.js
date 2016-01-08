import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import { pushState } from 'redux-router';
import {connect} from 'react-redux';
import { login } from 'redux/modules/auth';
import {
  Card,
  Textfield,
  CardTitle,
  CardText,
  CardActions,
  Button,
  CardMenu,
  IconButton
} from 'react-mdl';

@connect(
  state => ({user: state.auth.user, router: state.router}),
  {pushState})
class LoggedInScreen extends Component {
    static propTypes = {
      username: PropTypes.string,
      pushState: PropTypes.func.isRequired
    }

    componentDidMount() {
      const elem = ReactDOM.findDOMNode(this);
      elem.style.opacity = 0;
      window.requestAnimationFrame(() => {
        elem.style.transition = 'opacity 4000ms';
        elem.style.opacity = 1;
      });
    }

    getNavigationFunc = (pth) => () => {
      this.props.pushState(null, pth);
    };

    render() {
      const cardTitleStyle = {
        marginTop: '20px',
        marginBottom: '20px',
        height: '200px',
        background: 'url(https://hashicorp.com/images/blog/vault/list-c8bf47c8.png) center / contain',
        backgroundRepeat: 'no-repeat'
      };

      const buttonStyle = {
        fontSize: '1.1em',
        width: '18%',
        padding: '0 2% 0 2%'
      };

      return (
          <Card shadow={0} style={{width: '100%', margin: 'auto'}}>
              <CardText style={{marginTop: '20px', fontSize: '2em', width: '100%', textAlign: 'center'}}>
                  Welcome, <span style={{fontSize: '3em', fontWeight: 'bold'}}>{this.props.username}</span>!
              </CardText>
              <CardTitle style={cardTitleStyle}/>

              <CardActions border>
                  <Button style={buttonStyle} onClick={this.getNavigationFunc('secrets')} colored>Secrets</Button>
                  <Button style={buttonStyle} onClick={this.getNavigationFunc('mounts')} colored>Mounts</Button>
                  <Button style={buttonStyle} onClick={this.getNavigationFunc('policies')} colored>Policies</Button>
                  <Button style={buttonStyle} onClick={this.getNavigationFunc('users')} colored>Users</Button>
                  <Button style={buttonStyle} onClick={this.getNavigationFunc('health')} colored>Vault Health</Button>
              </CardActions>
              <CardMenu style={{color: '#fff'}}>
                  <IconButton name="share" />
              </CardMenu>
          </Card>);
    }
  }


@connect(
  state => ({user: state.auth.user, router: state.router}),
  {login})
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
    this.props.login(username, password);
  }

  render() {
    const {user} = this.props;
    const containerStyle = {
      maxWidth: '960px',
      margin: '40px auto'

    };

    const cardTitleStyle = {
      marginTop: '20px',
      height: '200px',
      background: 'url(https://hashicorp.com/images/blog/vault/list-c8bf47c8.png) center / contain',
      backgroundRepeat: 'no-repeat'
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
          <LoggedInScreen username={user.username}/>
          <Button className="mdl-cell--bottom" style={{float: 'right'}} onClick={this.handleLogout} raised colored ripple>Logout</Button>
        </div>
      }
      </div>
    );
  }
}
