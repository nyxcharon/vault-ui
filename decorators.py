"""Custom decorators used in the app"""
from functools import wraps
from flask import request, redirect, session, url_for


def login_required(func):
    """Verifies that the user is logged into vault before accessing page"""
    @wraps(func)
    def decorated_function(*args, **kwargs):
        token = session.get('vault_token', None)
        if token is None:
            return redirect(url_for('login', next=request.url))
        return func(*args, **kwargs)
    return decorated_function
