const Vaulted = require('vaulted');

function getVault(req) {
  const myVault = new Vaulted({
    vault_host: 'vault.service.consul',
    vault_port: 8200,
    vault_ssl: false
  });
  myVault.setToken(req.session.vault_api_token);
  return myVault;
}

export function health(req) {
  return getVault(req).checkHealth();
}

export function mounts(req) {
  return getVault(req).getMounts();
}

// export function secret(req) {
//   return getVault(req).read(req.);
// }
