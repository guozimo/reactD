import React, { PropTypes } from 'react';
import { connect } from 'dva';
import Layout from '../components/common/Layout';
import { openPages } from '../utils/config';
const App = ({
    isLogin,
    userInfo,
    showSider,
    menuData,
    children,
    dispatch,
    location,
    hasItemPower,
   hasSupplyChain,
}) => {
  const layoutProps = {
    isLogin,
    userInfo,
    menuData,
    dispatch,
    location,
    showSider,
    hasItemPower,
    hasSupplyChain,
    handleClickLogOut: function (e) {
      e.preventDefault();
      // message.success('Log out successfully :)');
      dispatch({type: 'app/logout'});
    }
  };
  let { pathname } = location;
  pathname = pathname.startsWith('/') ? pathname : `/${pathname}`
  if (openPages && openPages.includes(pathname)) {
    return (<div>
      {children}
    </div>)
  }
  return <Layout {...layoutProps} >{children}</Layout>
};

App.propTypes = {
  children: PropTypes.element,
  isLogin: PropTypes.bool,
  dispatch: PropTypes.func,
  showSider: PropTypes.bool,
  hasItemPower: PropTypes.bool,
  menuData: PropTypes.object,
};


export default connect((state) => {
  const { isLogin, userInfo, showSider, menuData, hasItemPower, hasSupplyChain } = state.merchantApp;

  return {
    isLogin,
    userInfo,
    showSider,
    menuData,
    hasItemPower,
    hasSupplyChain,
  };
})(App);
