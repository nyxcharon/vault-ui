const HOST = 'vault.service.consul';
const Vaulted = require('vaulted');
const dns = require('dns');


function getVault(req, server = HOST) {
  const myVault = new Vaulted({
    vault_host: server,
    vault_port: 8200,
    vault_ssl: false
  });
  myVault.setToken(req.session.vault_api_token);
  myVault.status = { sealed: false };
  return myVault;
}

export function health(req) {
  const response = [];
  return new Promise( (resolve) => {
    dns.lookup(HOST, {all: true}, (err, addresses) => {
      addresses.forEach(({address}) => {
        response.push(getVault(req, address).checkHealth().then((data) => {
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
