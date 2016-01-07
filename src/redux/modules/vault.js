const HEALTH = 'vault/HEALTH';
const HEALTH_SUCCESS = 'vault/HEALTH_SUCCESS';
const HEALTH_FAIL = 'vault/HEALTH_FAIL';

const MOUNTS = 'vault/MOUNTS';
const MOUNTS_SUCCESS = 'vault/MOUNTS_SUCCESS';
const MOUNTS_FAIL = 'vault/MOUNTS_FAIL';

const PATH = 'vault/PATH';
const PATH_SUCCESS = 'vault/PATH_SUCCESS';
const PATH_FAIL = 'vault/PATH_FAIL';

const initialState = {
  health: {
  }
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case HEALTH:
      return {
        ...state,
        error: null,
        loading: true
      };
    case HEALTH_SUCCESS:
      return {
        ...state,
        health: action.result,
        loading: false
      };
    case HEALTH_FAIL:
      return {
        ...state,
        error: action.error,
        loading: false
      };

    case MOUNTS:
      return {
        ...state,
        error: null,
        loading: true
      };
    case MOUNTS_SUCCESS:
      return {
        ...state,
        mounts: action.result,
        loading: false
      };
    case MOUNTS_FAIL:
      return {
        ...state,
        error: action.error,
        loading: false
      };

    case PATH:
      return {
        ...state,
        error: null,
        loading: true
      };
    case PATH_SUCCESS:
      return {
        ...state,
        path: action.result,
        loading: false
      };
    case PATH_FAIL:
      return {
        ...state,
        paths: action.error,
        loading: false
      };

    default:
      return state;
  }
}

export function secrets(path) {
  return {
    types: [PATH, PATH_SUCCESS, PATH],
    promise: (client) => client.get(`v1/${path}`)
  };
}

export function mounts() {
  return {
    types: [MOUNTS, MOUNTS_SUCCESS, MOUNTS],
    promise: (client) => client.get('v1/sys/mounts')
  };
}

export function health() {
  return {
    types: [HEALTH, HEALTH_SUCCESS, HEALTH_FAIL],
    promise: (client) => client.get('v1/sys/health')
  };
}
