# Vault UI

[![Docker Registry](https://img.shields.io/docker/pulls/nyxcharon/vault-ui.svg)](https://registry.hub.docker.com/u/nyxcharon/vault-ui)

---

## Screenshots
![Login Screen](/screenshots/login.png?raw=true)
![Mount Screen](/screenshots/mounts.png?raw=true)
![Cluster Health Screen](/screenshots/cluster.png?raw=true)


## Docker

### Build (for custom changes)

__Manually__

```
bash
docker build -t vault-ui .
```

__Docker-Compose__

```
docker-compose build
```

### Run

__Manually__

```
bash
docker run -it \
    -p 80:80 \
    -e VAULT_ADDR=my.vault.host \
        nyxcharon/vault-ui
```

__Docker-Compose__

```
docker-compose pull
docker-compose run -d
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
  * You must mount and setup the userpass or ldap backend before you can login. 
  * For more information on setting up these backends, see https://www.vaultproject.io/docs/auth/
  * The policies the user has will determine what they can view in the ui. 
  * The VAULT_AUTH_BACKEND variable is used to determine the auth backend.  Only 'userpass' and 'ldap' are currently supported
  * Other auth backends will be supported in the feature
