const USER_LOAD = 'user/USER_LOAD';
const USER_SUCCESS = 'user/USER_SUCCESS';
const USER_FAIL = 'user/USER_FAIL';

const initialState = {
  username: null,
  userData: null,
  userLoading: false,
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case USER_LOAD:
      return {
        ...state,
        userLoading: true,
        username: action.username
      };
    case USER_SUCCESS:
      return {
        ...state,
        username: action.username,
        userData: action.result,
        userLoading: false
      };
    case USER_FAIL:
      return {
        ...state,
        username: action.username,
        userError: action.error,
        userLoading: false
      };
    default:
      return state;
  }
}

export function readUser(username) {
  console.log(`Read User: ${username}`);
  return {
    types: [USER_LOAD, USER_SUCCESS, USER_FAIL],
    promise: (client) => client.get(`/readUser?username=${username}`),
    username: username
  };
}
