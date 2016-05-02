import superagent from 'superagent';
import config from '../../src/config';

const Vaulted = require('vaulted');
const dns = require('dns');
const VAULT_URL = `http://${config.vault.host}:${config.vault.port}/v1`;

function getVault(req, server = config.vault.host) {
  const myVault = new Vaulted({
    vault_host: server,
    vault_port: 8200,
    vault_ssl: false
  });
  if (req.session.vault_api_token) {
    myVault.setToken(req.session.vault_api_token);
  }
  myVault.status = { sealed: false };
  return myVault;
}

export function health(req) {
  const response = [];
  return new Promise( (resolve) => {
    dns.lookup(config.vault.host, {all: true}, (err, addresses) => {
      addresses.forEach(({address}) => {
        response.push(getVault(req, address).checkHealth({standbyok: true}).then((data) => {
          const healthData = { };
          healthData[address] = data;
          return healthData;
        }));
      });

      Promise.all(response).then((data) => {
        resolve(data);
      });
    });
  });
}

export function mounts(req) {
  return getVault(req).getMounts();
}

export function policies(req) {
  return getVault(req).getPolicies();
}

export function policy(req) {
  return getVault(req).getPolicy(req.query);
}

export function secret(req) {
  return getVault(req).read(req.query);
}

export function login(req) {
  return new Promise((resolve, reject) => {
    superagent
      .post(`${VAULT_URL}/auth/userpass/login/${req.body.username}`)
      .send({ 'password': req.body.password })
      .set('Content-Type', 'application/json')
      .end((err, response) => {
        if (err) {
          console.log('Error logging into vault', err);
          reject({'status': 500, 'message': 'You could not be logged in to vault'});
        } else {
        req.session.vault_api_token = response.body.auth.client_token;
        resolve({'message': 'success', 'username': req.body.username});
      }
      });
  });
}

// /readUser?username={username}
export function readUser(req) {
  return new Promise((resolve, reject) => {
    const token = getVault(req).token;
    superagent
      .get(`${VAULT_URL}/auth/userpass/users/${req.query.username}`)
      .set('Content-Type', 'application/json')
      .set('X-Vault-Token', token)
      .end((err, response) => {
        if (err) {
          console.log('Error logging into vault', err);
          reject({'status': 500, 'message': 'You could not be logged in to vault'});
        }
        resolve(JSON.parse(response.text));
      });
  });
}

export function secretList(req){
  return new Promise((resolve, reject) => {
    const token = getVault(req).token;
    superagent
      .get(`${VAULT_URL}/secret?list=true`)
      .set('Content-Type', 'application/json')
      .set('X-Vault-Token', token)
      .end((err, response) => {
        if (err) {
          console.log('Error logging into vault', err);
          reject({'status': 500, 'message': 'You could not be logged in to vault'});
        }
        resolve(JSON.parse(response.text).data.keys);
      });
  });
}
