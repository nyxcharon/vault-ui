import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
// import { IndexLink } from 'react-router';
import DocumentMeta from 'react-document-meta';
import { isLoaded as isInfoLoaded, load as loadInfo } from 'redux/modules/info';
import { isLoaded as isAuthLoaded, load as loadAuth, logout } from 'redux/modules/auth';
import { pushState } from 'redux-router';
import connectData from 'helpers/connectData';
import config from '../../config';
import {Layout, Header, Navigation, Drawer, Content} from 'react-mdl/lib/Layout';

function fetchData(getState, dispatch) {
  const promises = [];
  if (!isInfoLoaded(getState())) {
    promises.push(dispatch(loadInfo()));
  }
  if (!isAuthLoaded(getState())) {
    promises.push(dispatch(loadAuth()));
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
          <Header title={<strong>{appName}</strong>} className="mdl-color--blue-grey">
            <Navigation>
              <a href="#">Link</a>
            </Navigation>
          </Header>
          <Drawer title={appName} className="mdl-color--blue-grey mdl-color-text--white" style={{borderRight: 'none'}}>
            <Navigation>
              <a href="#" className="mdl-color-text--white">Drawer Link 2</a>
              <a href="#" className="mdl-color-text--white">Drawer Link 3</a>
              <a href="#" className="mdl-color-text--white">Drawer Link 2s</a>
              <a href="#" className="mdl-color-text--white">Drawer Link 4</a>
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
