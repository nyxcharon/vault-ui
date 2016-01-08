import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';
import * as authActions from 'redux/modules/auth';
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

class LoggedInScreen extends Component {
    static propTypes = {
      user: PropTypes.string
    }

    componentDidMount() {
      let elem = ReactDOM.findDOMNode(this);
      elem.style.opacity = 0;
      window.requestAnimationFrame(function() {
        elem.style.transition = 'opacity 4000ms';
        elem.style.opacity = 1;
      });
    }

    getRedirectFunc = (pth) => {
      return () => {
        console.log('REdirecting to ' + pth);
        console.log('REdirected to ' + pth);
      };
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
                  Welcome, <span style={{fontSize: '3em', fontWeight: 'bold'}}>{this.props.user}</span>!
              </CardText>
              <CardTitle style={cardTitleStyle}/>

              <CardActions border>
                  <Button style={buttonStyle} onClick={this.getRedirectFunc('secrets')} colored>Secrets</Button>
                  <Button style={buttonStyle} onClick={this.getRedirectFunc('mounts')} colored>Mounts</Button>
                  <Button style={buttonStyle} onClick={this.getRedirectFunc('policies')} colored>Policies</Button>
                  <Button style={buttonStyle} onClick={this.getRedirectFunc('users')} colored>Users</Button>
                  <Button style={buttonStyle} onClick={this.getRedirectFunc('health')} colored>Vault Health</Button>
              </CardActions>
              <CardMenu style={{color: '#fff'}}>
                  <IconButton name="share" />
              </CardMenu>
          </Card>);
    }
  }


@connect(
  state => ({user: state.auth.user}),
  authActions)
export default class Login extends Component {
  static propTypes = {
    user: PropTypes.object,
    login: PropTypes.func,
    logout: PropTypes.func
  };

  handleSubmit = (event) => {
    event.preventDefault();
    // This ref stuff could maybe be better?
    const username = this.refs.username.refs.input.value;
    const password = this.refs.password.refs.input.value;
    this.props.login(username, password);
  }

  handleLogout = (event) => {
    event.preventDefault();
    this.props.logout();
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
          <LoggedInScreen user={user.username}/>
          <Button className="mdl-cell--bottom" style={{float: 'right'}} onClick={this.handleLogout} raised colored ripple>Logout</Button>
        </div>
      }
      </div>
    );
  }
}
