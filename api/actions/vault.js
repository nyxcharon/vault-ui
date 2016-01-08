import superagent from 'superagent';
import config from '../../src/config';

const VAULT_LEADER = '10.0.10.131';
const Vaulted = require('vaulted');
const dns = require('dns');

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
          console.log(data);
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
      .post(`http://${VAULT_LEADER}:8200/v1/auth/userpass/login/${req.body.username}`)
      .send({ 'password': req.body.password })
      .set('Content-Type', 'application/json')
      .end((err, response) => {
        if (err) {
          console.log('Error logging into vault', err);
          reject({'status': 500, 'message': 'You could not be logged in to vault'});
        }
        req.session.vault_api_token = response.body.auth.client_token;
        resolve({'message': 'success'});
      });
  });
}

// /readUser?username={username}
export function readUser(req) {
  console.log(`http://${VAULT_LEADER}:8200/v1/auth/userpass/users/${req.query.username}`);
  return new Promise((resolve, reject) => {
    const token = getVault(req).token;
    console.log(token);
    superagent
      .get(`http://${VAULT_LEADER}:8200/v1/auth/userpass/users/${req.query.username}`)
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
