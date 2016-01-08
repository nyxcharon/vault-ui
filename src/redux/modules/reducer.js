import { combineReducers } from 'redux';
import { routerStateReducer } from 'redux-router';
import {reducer as form} from 'redux-form';

import auth from './auth';
import vault from './vault';
import secrets from './secrets';
import users from './users';
import user from './user';
import policies from './policies';

export default combineReducers({
  router: routerStateReducer,
  form,
  auth,
  vault,
  secrets,
  users,
  user,
  policies
});
