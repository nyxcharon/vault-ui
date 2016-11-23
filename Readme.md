# Vault UI

[![Docker Registry](https://img.shields.io/docker/pulls/nyxcharon/vault-ui.svg)](https://registry.hub.docker.com/u/nyxcharon/vault-ui)

---

## Screenshots
![Login Screen](/screenshots/login.png?raw=true)
![Mount Screen](/screenshots/mounts.png?raw=true)
![Cluster Health Screen](/screenshots/cluster.png?raw=true)

## Features
* List/View Secrets
* List Policies
* List Users
* View Server(s) Status
* Health check
* Userpass and LDAP Authentication

## Getting Started

### Requirements
  * Vault UI Assumes you already have vault setup and unsealed. If you don't, see the official [docs](https://www.vaultproject.io/intro/getting-started/install.html)
  * Any storage backend is fine
  
### Configuration
  These varaibles can either be set in settings.py, or via environment variables. Environment variables will always override settings.py
  * `VAULT_ADDR` - (Required) the Vault host to connect to. Default is "https://localhost:8200"
  * `VAULT_SKIP_VERIFY` - 	If set, do not verify Vault's presented certificate before communicating with it. Setting this variable is not recommended except during testing.
  * `AUTH_METHODS` - Defines the auth types users can use. Supports "LDAP" and "Userpass". Specifying anything else will be seen as a custom userpass mount. Default is "Userpass"
  * `VAULT_PORT` - Defines the port vault uses for the health check. Default is 8200
  * `VAULT_SSL_CERT` - Full path to the SSL cert used for https support
  * `VAULT_SSL_KEY` - Full path to the SSL key used for the https support 
  * `VAULT_SSL_CA` - Full path to the SSL certificate authority used to verify VAUT_URL's cert when it uses https.
  
### Authentication
  * You must mount and setup an authentication backend before you can login to Vault UI. The easiest to get started with is userpass. For more information on setting up this backend, see the userpass [docs](https://www.vaultproject.io/docs/auth/userpass.html)
  * When logging in, the policies the user has will determine what they can view in the ui. 
  * Currently only userpass (including custom mounts) and LDAP authentication backends are supported
  
### Running it
  You have two options, docker (preferred) or using flask directly.
  
  __Docker__
  ```
  docker run -p 80:80 -e VAULT_ADDR=https://vault.example.com:8200 nyxcharon/vault-ui:1.0.0
  ```

  __Python__
  ```
  git clone https://github.com/nyxcharon/vault-ui && cd vault-ui
  pip install -r requirements.txt
  FLASK_APP=app.py
  flask run
  ```
  
## Docker

### Build (for custom changes)

__Manually__

```
docker build -t vault-ui .
```

__Docker-Compose__

```
docker-compose build
```

### Run

__Manually__

```
docker run -it \
    -p 80:80 \
    -e VAULT_ADDR=my.vault.host \
        nyxcharon/vault-ui:latest
```

__Docker-Compose__

```
docker-compose pull
docker-compose run -d
```
