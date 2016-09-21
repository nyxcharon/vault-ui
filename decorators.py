from functools import wraps
from flask import request, redirect, session, url_for

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token  = session.get('vault_token', None)
        if token is None:
            return redirect(url_for('login', next=request.url))
        return f(*args, **kwargs)
    return decorated_function
