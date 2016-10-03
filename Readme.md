# Vault UI

[![Docker Registry](https://img.shields.io/docker/pulls/nyxcharon/vault-ui.svg)](https://registry.hub.docker.com/u/nyxcharon/vault-ui)

---

## Screenshots
![Login Screen](/screenshots/login.png?raw=true)
![Mount Screen](/screenshots/mounts.png?raw=true)
![Cluster Health Screen](/screenshots/cluster.png?raw=true)


## Docker

### Build

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
