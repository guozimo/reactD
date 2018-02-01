import RouterConfig from '../router';

const routes = [
  {
    path: '/merchants/register', //注册
    component: require('./Settled'),
  },
  {
    path: '/merchants/merchantsInfo(/:edit)', // 商户信息编辑
    component: require('./MerchantDisplay'),
  },
  {
    path: '/merchants/restaurantSet', // 新增餐厅
    component: require('./RestaurantSet'),
  },
  {
    path: '/merchants/deliverySet', // 配送中心
    component: require('./DeliverySet'),
  },
  {
    path: '/merchants/modifyPassword', //修改密码
    component: require('./ModifyPassword'),
  },
  {
    path: '/merchants/forgetPassword', // 忘记密码
    component: require('./ForgetPassword'),
  },
  {

    path: '/merchants/authority', // 岗位权限
    component: require('./Authority'),
  }, {
    path: '/merchants/chain-set',
    component: require('./ChainSet'),
  },
   {
    path: '/merchants/memberManagement',
    component: require('./memberManagement'),
  },
];

const Router = ({ history, app }) => {
  const routerProps = {
    history,
    app,
    routes
  };

  return <RouterConfig {...routerProps} />
};

export default Router;
