""" Vault Helpers
This is mostly a thin wrapper around the vault library HVAC, as well
as a couple other methods to fetch things not supported by it.
"""

import json
from urlparse import urlparse

import dns.rdatatype
import dns.resolver
import hvac
import requests
from flask import current_app as app


def __client(token=None):
    """Setup a basic vault client"""
    if 'VAULT_SSL_CERT' in app.config and 'VAULT_SSL_KEY' in app.config:
        cert = (app.config['VAULT_SSL_CERT'], app.config['VAULT_SSL_KEY'])
    else:
        cert = None
    if 'VAULT_SSL_CA' in app.config:
        verify = app.config['VAULT_SSL_CA']
    elif 'VAULT_SKIP_VERIFY' in app.config:
        verify = not app.config['VAULT_SKIP_VERIFY']
    else:
        verify = True
    client = hvac.Client(
        url=app.config['VAULT_URL'],
        verify=verify,
        cert=cert
    )
    if token:
        client.token = token
    return client


def vault_auth(username, password, auth_type):
    """Authenticate to vault based on auth_type"""
    client = __client()
    if auth_type.lower() == 'ldap':
        client.auth_ldap(username, password)
    elif auth_type.lower() == 'userpass':
        client.auth_userpass(username, password)
    else:
        client.auth_userpass(username, password, mount_point=auth_type.lower())
    return client.token


def vault_health():
    """Retrieve the health information for all vault servers"""
    basename = urlparse(app.config['VAULT_URL']).hostname
    scheme = urlparse(app.config['VAULT_URL']).scheme
    answers = dns.resolver.query(basename, "A")
    servers = {}
    session = requests.Session()
    if ('VAULT_SKIP_VERIFY' not in app.config) or (not app.config['VAULT_SKIP_VERIFY']):
        if 'VAULT_SSL_CA' in app.config:
            session.verify = app.config['VAULT_SSL_CA']
        else:
            session.verify = True
    else:
        session.verify = False
    for rdata in answers:
        try:
            address = rdata.to_text('A')
            url = scheme + "://" + str(address) + ":" + str(app.config['VAULT_PORT']).strip('[\']')
            servers[str(address)] = json.loads(session.get(url + '/v1/sys/health').text)
        except Exception as error:  # pylint: disable=broad-except
            print "Error fetching health information:", str(error)
            continue
    return servers


def vault_secrets(token):
    """Retrieve all of the secrets in vault for rendering"""
    client = __client(token)
    secret_list = []
    try:
        for backend in list_secret_backend(token):
            data = client.list(str(backend))
            if data is None:
                continue
            secrets = data['data']['keys']
            for secret in secrets:
                if '/' in secret:
                    try:
                        secret_list += list_path(client, secret, backend)
                    except Exception:  # pylint: disable=broad-except
                        continue
                else:
                    secret_list.append(backend + secret)
    except Exception: #pylint: disable=broad-except
        return secret_list
    return secret_list


def list_path(client, path, backend):
    """Recursively expand the list of secrets"""
    secret_list = client.list(backend+path)['data']['keys']
    items = []
    for secret in secret_list:
        if '/' in secret:
            items += list_path(client, path + secret, backend)
        else:
            items.append(backend + path + secret)
    return items


def list_secret(token, path):
    """Fetch the data for a given secret"""
    client = __client(token)
    return client.read(path)['data']


def list_users(token):
    """List all users in vault"""
    client = __client(token)
    try:
        return client.list('auth/userpass/users')['data']['keys']
    except Exception: #pylint: disable=broad-except
        return None


def list_policies(token):
    """List all policies in vault"""
    client = __client(token)
    try:
        return client.list_policies()
    except Exception: #pylint: disable=broad-except
        return None


def list_secret_backend(token):
    """List all secret backends enabled in vault"""
    client = __client(token)
    backends = []
    try:
        for backend in client.list_secret_backends():
            if "/" in backend:
                backends.append(backend)
        return backends
    except Exception: #pylint: disable=broad-except
        return None


def list_audit(token):
    """List all audit backends enabled in vault"""
    client = __client(token)
    backends = []
    try:
        for backend in client.list_audit_backends():
            if "/" in backend:
                backends.append(backend)
        return backends
    except Exception: #pylint: disable=broad-except
        return None


def list_auth(token):
    """List all auth backends enabled in vault"""
    client = __client(token)
    backends = []
    try:
        for backend in client.list_auth_backends():
            if "/" in backend:
                backends.append(backend)
        return backends
    except Exception: #pylint: disable=broad-except
        return None
