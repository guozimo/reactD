import RouterConfig from '../router';

const routes = [
  // {
  //   path: '/member/memberType',
  //   component: require('./MemberType'),
  // },
  // {
  //   path: '/member/memberDetails',
  //   component: require('./MemberDetails'),
  // },
  // {
  //   path: '/member/rechargeRule',
  //   component: require('./RechargeRule'),
  // },
  // {
  //   path: '/member/consumptionDetails',
  //   component: require('./ConsumptionDetails'),
  // },
  // {
  //   path: '/member/rechargeDetails',
  //   component: require('./RechargeDetails'),
  // }
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
