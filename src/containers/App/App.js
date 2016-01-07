import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { IndexLink, Link } from 'react-router';
import DocumentMeta from 'react-document-meta';
import { isLoaded as isAuthLoaded, load as loadAuth, logout } from 'redux/modules/auth';
import { isLoaded as isConsulLoaded, load as loadConsul } from 'redux/modules/consul';
import { pushState } from 'redux-router';
import connectData from 'helpers/connectData';
import config from '../../config';
import {Layout, Header, Navigation, Drawer, Content} from 'react-mdl/lib/Layout';


function fetchData(getState, dispatch) {
  const promises = [];
  if (!isAuthLoaded(getState())) {
    promises.push(dispatch(loadAuth()));
  }
  if (!isConsulLoaded(getState())) {
    promises.push(dispatch(loadConsul()));
  }
  return Promise.all(promises);
}

@connectData(fetchData)
@connect(
  state => ({user: state.auth.user}),
  {logout, pushState})
export default class App extends Component {
  static propTypes = {
    children: PropTypes.object.isRequired,
    user: PropTypes.object,
    logout: PropTypes.func.isRequired,
    pushState: PropTypes.func.isRequired
  };

  static contextTypes = {
    store: PropTypes.object.isRequired
  };

  componentWillReceiveProps(nextProps) {
    if (!this.props.user && nextProps.user) {
      // login
      this.props.pushState(null, '/loginSuccess');
    } else if (this.props.user && !nextProps.user) {
      // logout
      this.props.pushState(null, '/');
    }
  }

  handleLogout = (event) => {
    event.preventDefault();
    this.props.logout();
  }

  render() {
    // const {user} = this.props;
    const styles = require('./App.scss');
    const appName = 'Vault - UI';

    return (
      <div className={styles.app}>
        <Layout fixedHeader fixedDrawer>
          <Header className="mdl-color--blue-grey"
                  title={<IndexLink to="/" className={styles.title}>{appName}</IndexLink>}>
            <Navigation>
              <Link to="/login">Login</Link>
            </Navigation>
          </Header>
          <Drawer title={<IndexLink to="/" className={styles.title}>{appName}</IndexLink>} className="mdl-color--blue-grey mdl-color-text--white" style={{borderRight: 'none'}}>
            <Navigation>
              <Link to="/secrets" className="mdl-color-text--white">Secrets</Link>
              <Link to="/mounts" className="mdl-color-text--white">Mounts</Link>
              <Link to="/policies" className="mdl-color-text--white">Policies</Link>
              <Link to="/users" className="mdl-color-text--white">Users</Link>
              <Link to="/paz" className="mdl-color-text--white">Vault Healthcheck</Link>
            </Navigation>
          </Drawer>
          <Content>
            <DocumentMeta {...config.app}/>
            <div className={styles.appContent}>
              {this.props.children}
            </div>
          </Content>
        </Layout>
      </div>
    );
  }
}
