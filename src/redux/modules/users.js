const LOAD = 'users/LOAD';
const SUCCESS = 'users/SUCCESS';
const FAIL = 'users/FAIL';

const initialState = {
  data: null,
  isLoading: false
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
