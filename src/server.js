import Express from 'express';
import session from 'express-session';
import React from 'react';
import ReactDOM from 'react-dom/server';
import config from './config';
import favicon from 'serve-favicon';
import compression from 'compression';
import httpProxy from 'http-proxy';
import path from 'path';
import createStore from './redux/create';
import ApiClient from './helpers/ApiClient';
import Html from './helpers/Html';
import PrettyError from 'pretty-error';
import http from 'http';
import SocketIo from 'socket.io';
import superagent from 'superagent';

import {ReduxRouter} from 'redux-router';
import createHistory from 'history/lib/createMemoryHistory';
import {reduxReactRouter, match} from 'redux-router/server';
import {Provider} from 'react-redux';
import qs from 'query-string';
import getRoutes from './routes';
import getStatusFromRoutes from './helpers/getStatusFromRoutes';
import bodyParser from 'body-parser';

import * as consul from './utils/consul.js';

const pretty = new PrettyError();
const app = new Express();
const server = new http.Server(app);


app.use(compression());
app.use(favicon(path.join(__dirname, '..', 'static', 'favicon.ico')));
app.use(bodyParser.json());
app.use(session({
  secret: 'ayylmaoimasecret',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 86400000 } // One Day
}));

app.use(Express.static(path.join(__dirname, '..', 'static')));

app.use('/scripts/react-mdl', Express.static(path.join(__dirname, '..', 'node_modules/react-mdl/extra')));

/* AUTH ROUTES */
app.post('/login', (req, res) => {
  superagent
    .post(`http://${config.api.vault.host}:${config.api.vault.port}/v1/auth/userpass/login/${req.body.username}`)
    .send({ 'password': req.body.password })
    .set('Content-Type', 'application/json')
    .end((err, response) => {
      if (err) {
        console.log('Error logging into vault', err);
        res.send(500, 'You could not be logged in to vault');
      }
      req.session.vault_api_token = response.body.auth.client_token;
      res.send({'message': 'success'});
    });
});

app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    req.session = null;
    res.send(200);
  });
});

app.get('/loadAuth', (req, res) => {
  if (req.session.vault_api_token) {
    res.send({message: 'user authed!'});
    return;
  }
  res.sendStatus(500);
  return;
});


// Proxy to API server
function createProxy(value, key) {
  const proxy = httpProxy.createProxyServer({
    target: 'http://' + key.host + ':' + key.port,
    ws: true
  });

  app.use(`/api/${value}`, (req, res) => {
    if (!req.session.vault_api_token) {
      res.send(401);
    }
    if (value === 'vault') {
      req.headers['X-Vault-Token'] = req.session.vault_api_token;
    }
    proxy.web(req, res);
  });

  // added the error handling to avoid https://github.com/nodejitsu/node-http-proxy/issues/527
  proxy.on('error', (error, req, res) => {
    let json;
    if (error.code !== 'ECONNRESET') {
      console.error('proxy error', error);
    }
    if (!res.headersSent) {
      res.writeHead(500, {'content-type': 'application/json'});
    }

    json = {error: 'proxy_error', reason: error.message};
    res.end(JSON.stringify(json));
  });
}

createProxy('vault', config.api.vault);
createProxy('consul', config.api.consul);

app.post('/login', (req, res) => {
  console.log(`http://10.0.10.131:8200/v1/auth/userpass/login/${req.body.username}`);
  superagent
    .post(`http://10.0.10.131:8200/v1/auth/userpass/login/${req.body.username}`)
    .send({ 'password': req.body.password })
    .set('Content-Type', 'application/json')
    .end((err, response) => {
      if (err) {
        console.log('Error logging into vault', err);
        res.status(500).send({'message': 'You could not be logged in to vault'});
      }
      console.log(response.body.auth.client_token);
      req.session.vault_api_token = response.body.auth.client_token;
      res.send({'message': 'success'});
    });
});


app.get('/loadUsers', (req, res) => {
  consul.users().then((data) => {
    res.send(data);
  }, (err) => {
    console.log(err);
    res.send(err);
  });
});

app.get('/loadSecrets', (req, res) => {
  consul.keys().then((data) => {
    res.send(data);
  }, (err) => {
    console.log(err);
    res.send(err);
  });
});

// If vault api token not on request, redirect to login
app.use((req, res, next) => {
  if (req.session && req.session.vault_api_token) {
    next();
  } else {
    if (req.path !== '/login') {
      console.log(`Request to path: ${req.path} Unauthorized, redirecting to /login`);
      res.redirect('/login');
    } else {
      next();
    }
  }
});


app.use((req, res) => {
  if (__DEVELOPMENT__) {
    // Do not cache webpack stats: the script file would change since
    // hot module replacement is enabled in the development env
    webpackIsomorphicTools.refresh();
  }
  const client = new ApiClient(req);

  const store = createStore(reduxReactRouter, getRoutes, createHistory, client);

  function hydrateOnClient() {
    res.send('<!doctype html>\n' +
      ReactDOM.renderToString(<Html assets={webpackIsomorphicTools.assets()} store={store}/>));
  }

  if (__DISABLE_SSR__) {
    hydrateOnClient();
    return;
  }

  store.dispatch(match(req.originalUrl, (error, redirectLocation, routerState) => {
    if (redirectLocation) {
      res.redirect(redirectLocation.pathname + redirectLocation.search);
    } else if (error) {
      console.error('ROUTER ERROR:', pretty.render(error));
      res.status(500);
      hydrateOnClient();
    } else if (!routerState) {
      res.status(500);
      hydrateOnClient();
    } else {
      // Workaround redux-router query string issue:
      // https://github.com/rackt/redux-router/issues/106
      if (routerState.location.search && !routerState.location.query) {
        routerState.location.query = qs.parse(routerState.location.search);
      }

      store.getState().router.then(() => {
        const component = (
          <Provider store={store} key="provider">
            <ReduxRouter/>
          </Provider>
        );

        const status = getStatusFromRoutes(routerState.routes);
        if (status) {
          res.status(status);
        }
        res.send('<!doctype html>\n' +
          ReactDOM.renderToString(<Html assets={webpackIsomorphicTools.assets()} component={component} store={store}/>));
      }).catch((err) => {
        console.error('DATA FETCHING ERROR:', pretty.render(err));
        res.status(500);
        hydrateOnClient();
      });
    }
  }));
});

if (config.port) {
  if (config.isProduction) {
    const io = new SocketIo(server);
    io.path('/api/ws');
  }

  server.listen(config.port, (err) => {
    if (err) {
      console.error(err);
    }
    console.info('----\n==> ✅  %s is running, talking to API server on %s.', config.app.title, config.apiPort);
    console.info('==> 💻  Open http://%s:%s in a browser to view the app.', config.host, config.port);
  });
} else {
  console.error('==>     ERROR: No PORT environment variable has been specified');
}
