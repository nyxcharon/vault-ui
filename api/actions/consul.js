import config from '../../src/config';
const Bluebird = require('bluebird');
let MOUNT = config.consul.mount;
let keysMount = `${MOUNT}/logical/${config.consul.keysMount}/`;
let usersMount = `${MOUNT}/auth/${config.consul.usersMount}/user/`;
const SPECIAL_KEY = 'vault_ui';
const CONSUL_HOST = config.consul.host;

function pathsToObject(paths, result = {}) {
  for (const path of paths) {
    const values = path.split('/');
    let depth = result;

    for ( const value of values ) {
      if (! depth[value] ) {
        depth[value] = {};
      }

      depth = depth[value];
    }
  }
  return result;
}

function fromCallback(fn) {
  return new Bluebird((resolve, reject) => {
    try {
      return fn((err, data, res) => {
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
const consul = require('consul')({'host': CONSUL_HOST, promisify: fromCallback});


if ( MOUNT === undefined ) {
  console.log('Attempting to discover location of consul data');
  consul.kv.keys('').then((data) => {
    let result = data[0].find((key) => key.includes('sys/token/salt') );
    MOUNT = result.split('/')[0];

    result = data[0].find((key) =>
      key.includes(`${MOUNT}/logical/`) && key.includes(SPECIAL_KEY));
    keysMount = result.split('/').slice(0, -1).join('/') + '/';

    result = data[0].find((key) =>
      key.includes(`${MOUNT}/auth/`) && key.includes(SPECIAL_KEY));
    usersMount = result.split('/').slice(0, -1).join('/') + '/';

    console.log('consul data located at ', MOUNT);
  });
}


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
    return pathsToObject(data.map((value) => {
      return value.substring(startString);
    }));
  }, (err) => {
    console.log(err);
    return err;
  });
}

