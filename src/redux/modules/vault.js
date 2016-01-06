const HEALTH = 'vault/HEALTH';
const HEALTH_SUCCESS = 'vault/HEALTH_SUCCESS';
const HEALTH_FAIL = 'vault/HEALTH_FAIL';

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

    default:
      return state;
  }
}

export function login(username, password) {
  return {
    types: [HEALTH, HEALTH_SUCCESS, HEALTH],
    promise: (client) => client.post(`/v1/auth/userpass/login/$(username)`, {
      data: {
        password: password
      }
    })
  };
}

// This builds an action map that the dispatcher will use to pass into the reducer ^^^^
export function health() {
  return {
    types: [HEALTH, HEALTH_SUCCESS, HEALTH_FAIL],
    promise: (client) => client.get('/v1/sys/health', {
      params: {
        standbyok: true
      }
    })
  };
}
