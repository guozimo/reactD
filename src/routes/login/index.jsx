import RouterConfig from '../router';

const routes = [
  {
    path: '/login',
    component: require('./Login'),
  }
];

const Router = ({ history, app }) => {
  const routerProps = {
    history,
    app,
    routes,
  };

  return <RouterConfig {...routerProps} />;
};

export default Router;
