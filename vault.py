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
    client = hvac.Client(
        url=app.config['VAULT_URL'],
        verify=not app.config['VAULT_SKIP_VERIFY']
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
    answers = dns.resolver.query(basename, "A")
    servers = {}
    for rdata in answers:
        address = rdata.to_text('A')
        servers[str(address)] = json.loads(requests.get(app.config['VAULT_URL'] + "/v1/sys/health").text)
    return servers


def vault_secrets(token):
    """Retrieve all of the secrets in vault for rendering"""
    client = __client(token)
    secret_list = []
    try:
        secrets = client.list('secret/')['data']['keys']
    except Exception: #pylint: disable=broad-except
        return secret_list
    for secret in secrets:
        if '/' in secret:
            try:
                secret_list += list_path(client, secret)
            except Exception: #pylint: disable=broad-except
                continue
        else:
            secret_list.append('secret/' + secret)
    return secret_list


def list_path(client, path):
    """Recursively expand the list of secrets"""
    secret_list = client.list("secret/"+path)['data']['keys']
    items = []
    for secret in secret_list:
        if '/' in secret:
            items += list_path(client, path + secret)
        else:
            items.append('secret/' + path + secret)
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
    try:
        return client.list_secret_backends()
    except Exception: #pylint: disable=broad-except
        return None


def list_audit(token):
    """List all audit backends enabled in vault"""
    client = __client(token)
    try:
        return client.list_audit_backends()
    except Exception: #pylint: disable=broad-except
        return None


def list_auth(token):
    """List all auth backends enabled in vault"""
    client = __client(token)
    try:
        return client.list_auth_backends()
    except Exception: #pylint: disable=broad-except
        return None
