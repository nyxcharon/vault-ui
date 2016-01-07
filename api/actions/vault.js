var Vaulted = require('vaulted');

function getVault(req){
  const token = {
    name: req.session.vault_api_token
  };
  var myVault = new Vaulted({
    vault_host: '10.0.10.131',
    vault_port: 8200,
    vault_ssl: false
  });
  //myVault.setToken(token);
  myVault.setToken('');
  return myVault;
}

export function health(req) {
  return getVault(req).checkHealth();
}

export function mounts(req) {
  var myVault = new Vaulted({
    vault_host: '10.0.10.131',
    vault_port: 8200,
    vault_ssl: false
  });
  //myVault.setToken(token);
  myVault.setToken('');
  return myVault.getMounts();
}
