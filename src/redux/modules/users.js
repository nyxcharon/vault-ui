const LOAD = 'users/LOAD';
const SUCCESS = 'users/SUCCESS';
const FAIL = 'users/FAIL';
const USER_LOAD = 'users/USER_READ';
const USER_SUCCESS = 'users/USER_READ';
const USER_FAIL = 'users/USER_READ';

const initialState = {
  data: null,
  userData: null,
  isLoading: false,
  userLoading: false
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD:
      return {
        ...state,
        isLoading: true
      };
    case SUCCESS:
      console.log(action.result);
      return {
        ...state,
        data: action.result,
        isLoading: false
      };
    case FAIL:
      console.log(action.result);
      return {
        ...state,
        error: action.result,
        isLoading: false
      };
    case USER_LOAD:
      return {
        ...state,
        userLoading: true
      };
    case USER_SUCCESS:
      return {
        ...state,
        userData: action.result,
        userLoading: false
      };
    case USER_FAIL:
      return {
        ...state,
        error: action.result,
        userLoading: false
      };
    default:
      return state;
  }
}

export function isLoaded(globalState) {
  return globalState.users;
}

export function load() {
  return {
    types: [LOAD, SUCCESS, FAIL],
    promise: (client) => client.get('/users')
  };
}

export function readUser(username) {
  return {
    types: [USER_LOAD, USER_SUCCESS, USER_FAIL],
    promise: (client) => client.get(`/readUser?id=${username}`)
  };
}
