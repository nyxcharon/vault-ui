# Vault UI


[![Dependency Status](https://david-dm.org/nyxcharon/vault-ui.svg?style=flat-square)](https://david-dm.org/nyxcharon/vault-ui)
[![devDependency Status](https://david-dm.org/nyxcharon/vault-ui/dev-status.svg?style=flat-square)](https://david-dm.org/nyxcharon/vault-ui#info=devDependencies)

[![Image Layers](https://badge.imagelayers.io/nyxcharon/vault-ui:latest.svg)](https://imagelayers.io/?images=nyxcharon/vault-ui:latest)
[![Docker Registry](https://img.shields.io/docker/pulls/nyxcharon/vault-ui.svg)](https://registry.hub.docker.com/u/nyxcharon/vault-ui)

---

##Screenshots
![Welcome Screen](/screenshots/welcome.png?raw=true "Welcome Screen")
![Mounts](/screenshots/mounts.png?raw=true "Mounts")

## Setup

```bash
npm install
npm run dev
```

## Docker

### Build

```bash
docker build -t vault-ui .
```

### Run

```bash
docker run -it \
    -p 3030:3030 \
    -p 8080:8080 \
    -e VAULT_HOST=my.vault.host \
    -e CONSUL_HOST=my.consul.host \
        nyxcharon/vault-ui

```
## Features
* List/View Secrets
* List/View Policies
* List/View Users
* View Server(s) Status

## Requirements
Certain parts of this UI such as the secrets page depends on your Vault server to use Consul as the backend. This is only the case until https://github.com/hashicorp/vault/issues/111 is fixed in Vault, all backends will work after that and  this project is updated.  
The userpass backend must be configured in order to login to the UI. LDAP/Other backends may be supported later.  

## Configuration
### Environment (Required)
  * `VAULT_HOST` - the Vault host
  * `VAULT_PORT` - the Vault port (default: 8200)
  * `CONSUL_HOST` - the Consul host
  * `CONSUL_PORT` - the Consul port (default: 8500)  

### The following will attempt to auto discover, but if that is not working set them
  To use the auto discovery create a user called 'vault-ui' and write a secret called 'vault-ui'
  * `CONSUL_MOUNT` - This is the top level key value location vault is configured to use
  * `CONSUL_KEYS_MOUNT` - The location of secrets Example(VAULT-PROD/AUTH/xxxxxx-xxxx-xxxx-xxxx-xxxxxx/USER/) - the value to set would be xxxxxx-xxxx-xxxx-xxxx-xxxxxx
  * `CONSUL_USERS_MOUNT` - The location of users Example(VAULT-PROD/LOGICAL/xxxxx-xxxx-xxxx-xxxx-xxxxxxx/) - the value to set would be xxxxx-xxxx-xxxx-xxxx-xxxxxxx
