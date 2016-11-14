import requests
import hvac
import dns.resolver
import dns.rdatatype
import json
from flask import current_app as app
from urlparse import urlparse

# This is mostly a thin wrapper around the vault library HVAC, as well
# as a couple other methods to fetch things not supported by it.


def __client(token=None):
    if app.config['VAULT_SSL_CERT'] and app.config['VAULT_SSL_KEY']:
       cert = (app.config['VAULT_SSL_CERT'],app.config['VAULT_SSL_KEY'])
    else:
       cert = None
    if app.config['VAULT_SSL_CA']:
       verify = app.config['VAULT_SSL_CA']
    else:
       verify = not app.config['VAULT_SKIP_VERIFY']
    client = hvac.Client(
        url=app.config['VAULT_URL'],
        verify=verify,
        cert=cert
    )
    if token:
        client.token = token
    return client

def vault_auth(username,password):
    client = __client()
    if app.config.get('VAULT_AUTH_BACKEND'):
        auth_backend = app.config.get('VAULT_AUTH_BACKEND')
    else:
        auth_backend = 'userpass'

    if auth_backend == 'ldap':
        client.auth_ldap(username, password)
    elif auth_backend == 'userpass':
        client.auth_userpass(username, password)
    else:
        raise ValueError("Unsupported VAULT_AUTH_BACKEND: %s" % auth_backend)
    return client.token


def vault_health():
    basename = urlparse(app.config['VAULT_URL']).hostname
    answers = dns.resolver.query(basename, "A")
    servers = {}
    for rdata in answers:
        address = rdata.to_text('A')
        if app.config['VAULT_SSL_CA']:
            verify = app.config['VAULT_SSL_CA']
        else:
            verify = None
        servers[str(address)] = json.loads(requests.get(app.config['VAULT_URL'] + "/v1/sys/health", verify=verify).text)
    return servers

def vault_secrets(token):
    client = __client(token)
    list = []
    try:
        secrets = client.list('secret/')['data']['keys']
    except Exception:
        return list
    for secret in secrets:
         if '/' in secret:
            try:
                list += list_path(client,secret)
            except Exception:
                continue
         else:
             list.append('secret/' + secret)
    return list


def list_path(client,path):
    list = client.list("secret/"+path)['data']['keys']
    items = []
    for l in list:
         if '/' in l:
             items += list_path(client,path+l)
         else:
             items.append('secret/' + path + l)
    return items

def list_secret(token,path):
    client = __client(token)
    return client.read(path)['data']


def list_users(token):
    client = __client(token)
    try:
        return client.list('auth/userpass/users')['data']['keys']
    except Exception:
        return None


def list_policies(token):
    client = __client(token)
    try:
        return client.list_policies()
    except Exception:
        return None


def list_secret_backend(token):
    client = __client(token)
    try:
        return client.list_secret_backends()
    except Exception:
        return None

def list_audit(token):
    client = __client(token)
    try:
        return client.list_audit_backends()
    except Exception:
        return None

def list_auth(token):
    client = __client(token)
    try:
        return client.list_auth_backends()
    except Exception:
        return None
