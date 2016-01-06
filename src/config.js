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
  apiHost: process.env.APIHOST || 'localhost',
  apiPort: process.env.APIPORT,
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
