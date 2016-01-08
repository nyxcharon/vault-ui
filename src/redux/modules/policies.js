const LOAD = 'policies/LOAD';
const SUCCESS = 'policies/LOAD/SUCCESS';
const FAIL = 'policies/LOAD/FAIL';

const LOAD_INDIVIDUAL = 'policies/LOAD_INDIVIDUAL';
const SUCCESS_INDIVIDUAL = 'policies/LOAD/SUCCESS_INDIVIDUAL';
const FAIL_INDIVIDUAL = 'policies/LOAD/FAIL_INDIVIDUAL';

const initialState = {
  loaded: false,
  loading: false,
  policies: [],
  error: null,
  loadingIndividual: false
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
      action.result.map((policy, index) => {
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
    case LOAD_INDIVIDUAL: {
      return {
        ...state,
        loadingIndividual: true
      };
    }
    case FAIL_INDIVIDUAL: {
      return {
        ...state,
        error: state.error || 'ERROR INDIVIDUAL',
        loadingIndividual: false
      };
    }
    case SUCCESS_INDIVIDUAL: {
      const newPoliciesState = [...state.policies];
      newPoliciesState.map((policy) => {
        if (policy.name === action.policy) {
          policy.policy = action.result.rules;
        }
      });
      return {
        ...state,
        error: null,
        policies: newPoliciesState,
        loadingIndividual: false
      };
    }
    default:
      return state;
  }
}

export function load() {
  return {
    types: [LOAD, SUCCESS, FAIL],
    promise: (client) => client.get('/policies')
  };
}

export function loadIndividualPolicy(policy) {
  return {
    types: [LOAD_INDIVIDUAL, SUCCESS_INDIVIDUAL, FAIL_INDIVIDUAL],
    promise: (client) => { return client.get(`/policy?id=${policy}`); },
    policy: policy
  };
}
