# Vault UI

[![Docker Registry](https://img.shields.io/docker/pulls/nyxcharon/vault-ui.svg)](https://registry.hub.docker.com/u/nyxcharon/vault-ui)

---

## Screenshots
![Login Screen](/screenshots/login.png?raw=true)
![Mount Screen](/screenshots/mounts.png?raw=true)
![Cluster Health Screen](/screenshots/cluster.png?raw=true)


## Docker

### Build (for custom changes)

```bash
docker build -t vault-ui .
```

### Run

```bash
docker run -it \
    -p 80:80 \
    -e VAULT_ADDR=my.vault.host \
        nyxcharon/vault-ui

```

## Features
* List/View Secrets
* List Policies
* List Users
* View Server(s) Status
* Health check

## Configuration
### Environment (Required)
  * `VAULT_ADDR` - the Vault host
  
### Authentication
  * You must mount and setup the userpass backend before you can login. The policies the user has will determine what they can view in the ui. For more information on setting up this backend, see https://www.vaultproject.io/docs/auth/userpass.html
  * Other auth backends will be supported in the feature
