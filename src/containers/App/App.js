import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { IndexLink, Link } from 'react-router';
import DocumentMeta from 'react-document-meta';
import { isLoaded as isAuthLoaded, load as loadAuth, logout } from 'redux/modules/auth';
import { pushState } from 'redux-router';
import connectData from 'helpers/connectData';
import config from '../../config';
import {Layout, Header, Navigation, Drawer, Content, Button} from 'react-mdl/lib/Layout';


function fetchData(getState, dispatch) {
  const promises = [];
  if (!isAuthLoaded(getState())) {
    promises.push(dispatch(loadAuth()));
  }
  return Promise.all(promises);
}

@connectData(fetchData)
@connect(
  state => ({user: state.auth.user,
             currentRoute: state.router.location.pathname}),
  {logout, pushState})
export default class App extends Component {
  static propTypes = {
    children: PropTypes.object.isRequired,
    user: PropTypes.object,
    logout: PropTypes.func.isRequired,
    pushState: PropTypes.func.isRequired,
    currentRoute: PropTypes.string
  };

  static contextTypes = {
    store: PropTypes.object.isRequired
  };

  componentWillReceiveProps(nextProps) {
    if (!this.props.user && nextProps.user) {
      // login
      this.props.pushState(null, '/');
    } else if (this.props.user && !nextProps.user) {
      // logout
      this.props.pushState(null, '/');
    }
  }


  getSidebarLinkClass = (path) => {
    const defaultClass = 'mdl-color-text--white';
    const activeLinkClass = 'mdl-navigation__link--current';
    return this.props.currentRoute === path ? `${defaultClass} ${activeLinkClass}` : defaultClass;
  }

  handleLogout = (event) => {
    event.preventDefault();
    this.props.logout();
  }

  logOutThing = () => {
    console.log('Logout thing');
  }

  render() {
    const styles = require('./App.scss');
    const appName = 'Vault - UI';
    const sideBarLinks = [{ name: 'Secrets', 'path': '/secrets'},
                          { name: 'Mounts', 'path': '/mounts'},
                          { name: 'Policies', 'path': '/policies'},
                          { name: 'Users', 'path': '/users'},
                          { name: 'Vault Health Check', 'path': '/health'}];
    // const {user} = this.props;

    return (
      <Layout className={styles.app} fixedHeader fixedDrawer>
        <Header className="mdl-color--blue-grey"
                title={<IndexLink to="/" className={styles.title}>{appName}</IndexLink>}>
          <Navigation>
            {this.props.user &&
              <Link to="/logout">Logout</Link>
            }
          </Navigation>
        </Header>
        <Drawer title={<IndexLink to="/" className={styles.title}>{appName}</IndexLink>} className="mdl-color--blue-grey mdl-color-text--white" style={{borderRight: 'none'}}>
          <Navigation className={styles.sideNav}>
            {sideBarLinks.map((link, index) => {
              return <Link key={index} to={link.path} className={this.getSidebarLinkClass(link.path)}>{link.name}</Link>;
            })}
          </Navigation>
        </Drawer>
        <Content>
          <DocumentMeta {...config.app}/>
          <div className={styles.appContent}>
            {this.props.children}
          </div>
        </Content>
      </Layout>
    );
  }
}
