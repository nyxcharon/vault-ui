export default function clientMiddleware(client) {
  return ({dispatch, getState}) => {
    return next => action => {
      if (typeof action === 'function') {
        return action(dispatch, getState);
      }

      const { promise, types, ...rest } = action; // eslint-disable-line no-redeclare
      if (!promise) {
        return next(action);
      }

      const [REQUEST, SUCCESS, FAILURE] = types;
      next({...rest, type: REQUEST});
      return promise(client).then(
        (result) => next({...rest, result, type: SUCCESS}),
        (error) => {
          console.log('ERROR: ', error.status);
          // If unauthed ajax occurs, redirect to login
          if (error.status === 401 && window) {
            window.location.href = `${window.location.protocol}${window.location.host}/login`;
          }
          next({...rest, error, type: FAILURE});
        }
      ).catch((error)=> {
        console.log('MIDDLEWARE ERROR:', error);
        next({...rest, error, type: FAILURE});
      });
    };
  };
}
