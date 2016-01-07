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
        loaded: false
      };
    case LOAD_SUCCESS:
      const {users, secrets} = action.result;
      return {
        ...state,
        secrets: secrets,
        users: users,
        loaded: true
      };
    case LOAD_FAIL:
      return {
        ...state,
        loaded: false,
        error: action.result
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
    promise: (client) => client.get('app', '/test')
  };
}

