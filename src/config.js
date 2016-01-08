require('babel/polyfill');

const environment = {
  development: {
    isProduction: false
  },
  production: {
    isProduction: true
  }
}[process.env.NODE_ENV || 'development'];

module.exports = Object.assign({
  host: process.env.HOST || 'localhost',
  port: process.env.PORT,
  apiHost: process.env.API_HOST || 'localhost',
  apiPort: process.env.API_PORT,
  vault: {
    host: process.env.VAULT_HOST,
    port: process.env.VAULT_PORT || 8200
  },
  consul: {
    host: process.env.CONSUL_HOST,
    port: process.env.CONSUL_PORT || 8500,
    mount: process.env.CONSUL_MOUNT,
    keysMount: process.env.CONSUL_KEYS_MOUNT,
    usersMount: process.env.CONSUL_USERS_MOUNT
  },
  app: {
    title: 'Vault UI',
    description: 'Vault UI for hashicorps Vault.',
    meta: {
      charSet: 'utf-8',
      property: {
        'og:site_name': 'Vault UI',
        'og:locale': 'en_US',
        'og:title': 'Vault UI',
        'og:description': 'Vault UI for hashicorps Vault.',
      }
    }
  }
}, environment);
