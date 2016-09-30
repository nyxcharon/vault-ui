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
    client = hvac.Client(
        url=app.config['VAULT_URL'],
        verify=not app.config['VAULT_SKIP_VERIFY']
    )
    if token:
        client.token = token
    return client

def vault_auth(username,password):
    client = __client()
    client.auth_userpass(username, password)
    return client.token


def vault_health():
    basename = urlparse(app.config['VAULT_URL']).hostname
    answers = dns.resolver.query(basename, "A")
    servers = {}
    for rdata in answers:
        address = rdata.to_text('A')
        servers[str(address)] = json.loads(requests.get(app.config['VAULT_URL'] + "/v1/sys/health").text)
    return servers

def vault_secrets(token):
    client = __client(token)
    secrets = client.list('secret')['data']['keys']
    list = []
    for secret in secrets:
         if '/' in secret:
            list += list_path(client,secret)
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
    return client.list('auth/userpass/users')['data']['keys']


def list_policies(token):
    client = __client(token)
    return client.list_policies()


def list_secret_backend(token):
    client = __client(token)
    return client.list_secret_backends()


def list_audit(token):
    client = __client(token)
    return client.list_audit_backends()


def list_auth(token):
    client = __client(token)
    return client.list_auth_backends()
