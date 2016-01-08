
export function loadAuth(req) {
  return new Promise((resolve, reject) => {
    if (req.session.vault_api_token) {
      resolve({message: 'user authed!'});
    }
    reject({'status': 500, 'message': 'You are not logged in!'});
  });
}
