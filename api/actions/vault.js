var Vaulted = require('vaulted');

function getVault(req){
  var myVault = new Vaulted({
    vault_host: '10.0.10.131',
    vault_port: 8200,
    vault_ssl: false
  });
  myVault.status = { sealed: false };
  myVault.setToken('req.session.vault_auth_token');
  //myVault.setToken('');
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
