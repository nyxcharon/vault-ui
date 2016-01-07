const LOAD = 'redux-example/LOAD';
const LOAD_SUCCESS = 'redux-example/LOAD_SUCESS';
const LOAD_FAIL = 'redux-example/LOAD_FAIL';

const initialState = {
  loaded: false,
  users: null,
  secrets: null
};


export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD:
      return {
        ...state,
        users: 'hello bob'
      };
    case LOAD_SUCCESS:
      return {
        ...state,
        health: action.result,
        loaded: true
      };
    case LOAD_FAIL:
      return {
        ...state,
        loaded: false,
        shit: 'yep'
      };
    default:
      return state;
  }
}

export function isLoaded(globalState) {
  return globalState.consul && globalState.consul.loaded;
}


export function load() {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (client) => client.get('consul', '/v1/kv/vault-prod/auth/d535374b-ddfd-5dca-76a7-74e28f669e29/user/apaz')
  };
}

