# Vault UI


[![Dependency Status](https://david-dm.org/nyxcharon/vault-ui.svg?style=flat-square)](https://david-dm.org/nyxcharon/vault-ui)
[![devDependency Status](https://david-dm.org/nyxcharon/vault-ui/dev-status.svg?style=flat-square)](https://david-dm.org/nyxcharon/vault-ui#info=devDependencies)

[![Image Layers](https://badge.imagelayers.io/nyxcharon/vault-ui:latest.svg)](https://imagelayers.io/?images=nyxcharon/vault-ui:latest)
[![Docker Registry](https://img.shields.io/docker/pulls/nyxcharon/vault-ui.svg)](https://registry.hub.docker.com/u/nyxcharon/vault-ui)

---


## Setup

```bash
npm install
npm run dev
```

## Docker

```bash
docker run -it -p 3030:3030 -p 8080:8080 nyxcharon/vault-ui
```


## Documentation

## Configuration
### Environment (Required)
  * VAULT_HOST 
  * VAULT_PORT (default: 8200)
  * CONSUL_HOST 
  * CONSUL_PORT (default: 8500)
### The following will attempt to auto discover, but if that is not working set them
  * To use the auto discovery create a user called 'vault-ui' and write a secret called 'vault-ui'
  * CONSUL_MOUNT - This is the top level key value location vault is configured to use
  * CONSUL_KEYS_MOUNT - The location of secrets Example(VAULT-PROD/AUTH/xxxxxx-xxxx-xxxx-xxxx-xxxxxx/USER/) - the value to set would be xxxxxx-xxxx-xxxx-xxxx-xxxxxx
  * CONSUL_USERS_MOUNT - The location of users Example(VAULT-PROD/LOGICAL/xxxxx-xxxx-xxxx-xxxx-xxxxxxx/) - the value to set would be xxxxx-xxxx-xxxx-xxxx-xxxxxxx


## Explanation

Boiler plate was taken from (https://github.com/awestbro/react-redux-mdl-boilerplate)
