from flask import Flask, abort, render_template, g, session, redirect, url_for, escape, request
from vault import *
from flask_material import Material
from decorators import *
import werkzeug.exceptions
import os



app = Flask(__name__)
Material(app)
app.config.from_pyfile('settings.py',silent=True)
if "VAULT_ADDR" in os.environ:
    app.config['VAULT_URL'] = os.environ['VAULT_ADDR']

if "VAULT_SKIP_VERIFY" in os.environ:
    if os.environ['VAULT_SKIP_VERIFY'] == "1":
       app.config['VERIFY'] = False
    else:
       app.config['VERIFY'] = True

@app.route('/')
@login_required
def index():
    return render_template('index.html', username=session['username'])
    # if 'vault_token' in session:
    #     return 'Logged in with token: %s' % escape(session['vault_token'])
    # return 'You are not logged in'


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        try:
            if request.form['ghetoken'] != "":
                token = vault_auth_github(request.form['ghetoken'])
                session['username'] = "Github User"
            else:
                token = vault_auth(request.form['username'], request.form['password'])
                session['username'] = request.form['username']
            session['vault_token'] = token
            return redirect(url_for('index'))
        except:
            print "error logging in"
            return render_template('login.html', error=True)
    else:
        return render_template('login.html')


@app.route('/logout')
@login_required
def logout():
    # remove the username from the session if it's there
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


# Health check, useful for monitoring #
@app.route('/healthcheck')
def healtcheck():
    return 'Healthy'


# Error Handling #
@app.errorhandler(werkzeug.exceptions.NotFound)
def handle_bad_request(e):
    return render_template('404.html', error=e)


@app.errorhandler(werkzeug.exceptions.InternalServerError)
def handle_bad_request(e):
    return render_template('500.html', error=e)


# Implement HTTP 418
@app.route('/teapot')
def teapot():
    abort(418)


if __name__ == "__main__":
    app.run(host='0.0.0.0',  port=80)
