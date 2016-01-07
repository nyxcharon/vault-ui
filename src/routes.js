import React from 'react';
import {IndexRoute, Route} from 'react-router';


import Health from 'components/Health';

import { isLoaded as isAuthLoaded, load as loadAuth } from 'redux/modules/auth';
import {
    App,
    Policies,
    Users,
    Mounts,
    Secrets,
    Login
} from 'containers';

export default (store) => {
  const requireLogin = (nextState, replaceState, cb) => {
    function checkAuth() {
      const { auth: { user }} = store.getState();
      console.log('Checking auth: user: ', user);
      if (!user) {
        // oops, not logged in, so can't be here!
        replaceState(null, '/login');
      }
      cb();
    }
    if (!isAuthLoaded(store.getState())) {
      store.dispatch(loadAuth()).then(checkAuth);
    } else {
      checkAuth();
    }
  };

  /**
   * Please keep routes in alphabetical order
   */
  return (
    <div>

      <IndexRoute component={Login}/>

      <Route path="/" component={App}>
        <Route path="/login" component={Login} />

        <Route onEnter={requireLogin}>
          <Route path="health" component={Health} />
        </Route>

        <Route path="secrets" component={Secrets} />
        <Route path="policies" component={Policies} />
        <Route path="mounts" component={Mounts} />
        <Route path="users" component={Users} />
      </Route>
      </div>

  );
};
