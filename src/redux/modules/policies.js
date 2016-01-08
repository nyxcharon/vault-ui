const LOAD = 'policies/LOAD';
const SUCCESS = 'policies/LOAD/SUCCESS';
const FAIL = 'policies/LOAD/FAIL';

const initialState = {
  loaded: false,
  loading: false,
  policies: [],
  error: null
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD:
      return {
        ...state,
        loading: true,
        policies: state.policies || initialState.policies
      };
    case SUCCESS: {
      const modifiedArr = [];
      action.result.policies.map((policy, index) => {
        modifiedArr.push({
          name: policy,
          index: index,
          policy: null
        });
      });
      return {
        ...state,
        loading: false,
        loaded: true,
        policies: modifiedArr,
        error: null
      };
    }
    case FAIL: {
      return {
        ...state,
        loading: false,
        loaded: true,
        policies: [],
        error: state.error || 'ERROR'
      };
    }
    default:
      return state;
  }
}

export function load() {
  return {
    types: [LOAD, SUCCESS, FAIL],
    promise: () => {
      return Promise.resolve({
        'policies': ['root', 'deploy', 'test', 'policy1', 'policy2']
      });
    }
  };
}
