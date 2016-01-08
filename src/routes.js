import React from 'react';
import {IndexRoute, Route} from 'react-router';

import { isLoaded as isAuthLoaded, load as loadAuth } from 'redux/modules/auth';
import {
    App,
    Policies,
    Users,
    Mounts,
    Secrets,
    Login,
    Health
} from 'containers';

export default (store) => {
  const requireLogin = (nextState, replaceState, cb) => {
    function checkAuth() {
      const { auth: { user }} = store.getState();

      if (!user) {
        // oops, not logged in, so can't be here!
        replaceState(null, '/');
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
      <Route path="/" component={App}>
        <IndexRoute component={Login}/>

        <Route onEnter={requireLogin}>
          <Route path="health" component={Health} />
          <Route path="secrets" component={Secrets} />
          <Route path="policies" component={Policies} />
          <Route path="mounts" component={Mounts} />
          <Route path="users" component={Users} />
        </Route>
        <Route path="*" component={Login}/>
      </Route>
      </div>

  );
};
