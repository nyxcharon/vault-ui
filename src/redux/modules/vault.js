const HEALTH = 'vault/HEALTH';
const HEALTH_SUCCESS = 'vault/HEALTH_SUCCESS';

const initialState = {
  health: {
    init: '1'
  }
};

export default function reducer(state = initialState, action = {}) {
  console.log(state, action);
  switch (action.type) {
    case HEALTH:
      return {
        ...state,
        loading: true
      };
    case HEALTH_SUCCESS:
      return {
        ...state,
        health: action.result,
        loading: false
      };
    default:
      return state;
  }
}

export function login(username, password) {
  return {
    types: [HEALTH, HEALTH_SUCCESS],
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
    types: [HEALTH, HEALTH_SUCCESS],
    promise: (client) => client.get('/v1/sys/health')
  };
}
