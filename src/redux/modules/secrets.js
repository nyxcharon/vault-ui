const LOAD = 'secrets/LOAD';
const SUCCESS = 'secrets/SUCCESS';
const FAIL = 'secrets/FAIL';

const initialState = { data: null };

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD:
      return {
        ...state,
      };
    case SUCCESS:
      return {
        ...state,
        data: action.result,
      };
    case FAIL:
      console.log(action.result);
      return {
        ...state,
        error: action.result,
      };
    default:
      return state;
  }
}

export function isLoaded(globalState) {
  return globalState.secrets;
}

export function load() {
  return {
    types: [LOAD, SUCCESS, FAIL],
    promise: (client) => client.get('app', '/loadSecrets')
  };
}
