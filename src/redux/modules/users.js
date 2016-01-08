const LOAD = 'users/LOAD';
const SUCCESS = 'users/SUCCESS';
const FAIL = 'users/FAIL';

const initialState = {
  data: null,
  usersLoading: false
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD:
      console.log('USERS ACTION: ', LOAD);
      return {
        ...state,
        usersLoading: true
      };
    case SUCCESS:
      console.log('USERS ACTION: ', SUCCESS);
      console.log(action.result);
      return {
        ...state,
        data: action.result,
        usersLoading: false
      };
    case FAIL:
      console.log('USERS ACTION: ', FAIL);
      console.log(action.result);
      return {
        ...state,
        error: action.result,
        usersLoading: false
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
