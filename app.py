""" Main application logic
This contains all the routing information for the app
"""
import os
from flask import Flask, abort, render_template
from vault import *
from flask_material import Material
from decorators import *
import werkzeug.exceptions


app = Flask(__name__)
Material(app)
app.config.from_pyfile('settings.py', silent=True)
if "VAULT_ADDR" in os.environ:
    app.config['VAULT_URL'] = os.environ['VAULT_ADDR']
if "VAULT_SKIP_VERIFY" in os.environ:
    app.config['VAULT_SKIP_VERIFY'] = True
if "AUTH_METHODS" in os.environ:
    app.config['AUTH_METHODS'] = os.environ['AUTH_METHODS'].split(',')


@app.route('/')
@login_required
def index():
    return render_template('index.html', username=session['username'])


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        try:
            token = vault_auth(request.form['username'], request.form['password'], str(request.form.get('auth_type')))
            session['vault_token'] = token
            session['username'] = request.form['username']
            return redirect(url_for('index'))
        except Exception as error: #pylint: disable=broad-except
            print "Error logging in:", str(error)
            return render_template('login.html', error=True, methods=app.config["AUTH_METHODS"])
    else:
        return render_template('login.html', methods=app.config["AUTH_METHODS"])


@app.route('/logout')
@login_required
def logout():
    session.pop('vault_token', None)
    return redirect(url_for('index'))


@app.route("/health")
@login_required
def health():
    return render_template('health.html', servers=vault_health())


@app.route("/secrets")
@login_required
def secrets():
    return render_template('secrets.html', secrets=vault_secrets(session['vault_token']))


@app.route("/users")
@login_required
def users():
    return render_template('users.html', users=list_users(session['vault_token']))


@app.route("/policies")
@login_required
def policies():
    return render_template('policies.html', policies=list_policies(session['vault_token']))


@app.route("/mounts")
@login_required
def mounts():
    return render_template('mounts.html', secrets=list_secret_backend(session['vault_token']),
                           audits=list_audit(session['vault_token']), auths=list_auth(session['vault_token']))


@app.route("/read/<path:path>")
@login_required
def read_secret(path):
    return render_template('secret.html', path=path, secret=list_secret(session['vault_token'], path))


@app.route('/healthcheck')
def healthcheck():
    return 'Healthy'


@app.errorhandler(werkzeug.exceptions.NotFound)
def handle_404_request(error):
    return render_template('404.html', error=error)


@app.errorhandler(werkzeug.exceptions.InternalServerError)
def handle_505_request(error):
    return render_template('500.html', error=error)


# Implement HTTP 418
@app.route('/teapot')
def teapot():
    abort(418)


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=80)
