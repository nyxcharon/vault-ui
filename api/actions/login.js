import superagent from 'superagent';

export function login(req) {
  return new Promise((resolve, reject) => {
    superagent
      .post(`http://10.0.10.131:8200/v1/auth/userpass/login/${req.body.username}`)
      .send({ 'password': req.body.password })
      .set('Content-Type', 'application/json')
      .end((err, response) => {
        if (err) {
          console.log('Error logging into vault', err);
          reject({'status': 500, 'message': 'You could not be logged in to vault'});
        }
        req.session.vault_api_token = response.body.auth.client_token;
        resolve({'message': 'success'});
      });
  });
}

export function loadAuth(req) {
  return new Promise((resolve, reject) => {
    if (req.session.vault_api_token) {
      resolve({message: 'user authed!'});
    }
    reject({'status': 500, 'message': 'You are not logged in!'});
  });
}
