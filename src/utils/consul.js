const Bluebird = require('bluebird');
const mount = 'vault-prod';
const keysMount = `${mount}/logical/ff7e747e-baa3-6739-2c9d-6ec2a044f7ba/`;
const usersMount = `${mount}/auth/d535374b-ddfd-5dca-76a7-74e28f669e29/user/`;


function fromCallback(fn) {
  return new Bluebird(function(resolve, reject) {
    try {
      return fn(function(err, data, res) {
        if (err) {
          err.res = res;
          return reject(err);
        }
        return resolve([data, res]);
      });
    } catch (err) {
      return reject(err);
    }
  });
}

const consul = require('consul')({'host': 'consul.service.consul', promisify: fromCallback});

export function users() {
  return consul.kv.keys(usersMount).spread((data) => {
    const startString = usersMount.length;
    return data.map((value) => {
      return value.substring(startString);
    });
  }, (err) => {
    console.log(err);
    return err;
  });
}


export function keys() {
  return consul.kv.keys(keysMount).spread((data) => {
    const startString = keysMount.length;
    return data.map((value) => {
      return value.substring(startString);
    });
  }, (err) => {
    console.log(err);
    return err;
  });
}

