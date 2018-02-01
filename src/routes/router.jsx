import React from 'react';
import { Router } from 'dva/router';
import App from './App';

function RouterConfig({ history, app, routes }) {
  const router = [
    {
      path: '/',
      name: 'app',
      component: App,
      onEnter(nextState) {
        
        const { pathname } = nextState.location;
        if (pathname !== '/merchants/register' && pathname !== '/merchants/forgetPassword' && pathname !== '/login') {
          app._store.dispatch({
            type: 'merchantApp/checkLogin',
          });
          app._store.dispatch({
            type: 'merchantApp/queryAuthority',
          });
        }
      },
      childRoutes: routes,
    },
  ];

  return (
    <Router history={history} routes={router} />
  );
}

export default RouterConfig;
