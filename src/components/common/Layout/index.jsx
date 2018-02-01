import React, { PropTypes } from 'react';
import _ from 'lodash';
import MainHeader from '../Header';
import MerchantsMenu from '../Menus/merchants';
import InventoryMenu from '../Menus/inventory';
import MemberMenu from '../Menus/member';
import { Layout } from 'antd';
const { Sider } = Layout;

const MainLayout = ({ isLogin, showSider, userInfo, menuData, children, dispatch, location, hasItemPower, hasSupplyChain }) => {
  const headerProps = {
    isLogin,
    userInfo,
    menuData,
    children,
    dispatch,
    location,
    showSider,
    hasItemPower,
    hasSupplyChain,
  };
  const { pathname } = location;

  document.body.scrollTop = 0; // For Chrome, Safari and Opera
  document.documentElement.scrollTop = 0; // For IE and Firefox
  return (
    <div>
      <MainHeader {...headerProps} />
      <div id="container" className="container">
        <Layout>
          {
            showSider && <Sider>
              { pathname.indexOf('merchants') > -1 && <MerchantsMenu location={location} menuData={menuData} hasItemPower={hasItemPower} /> }
              { _.intersection(pathname.split('/'), ['stock', 'store', 'official', 'base', 'supplier', 'goods', 'cost', 'preview']).length > 0
                && <InventoryMenu location={location} menuData={menuData} /> }
            </Sider>
          }

          <Layout style={{background: '#fff'}}>
            { children }
          </Layout>
        </Layout>
      </div>
    </div>
  );
};

MainLayout.propTypes = {
  isLogin: PropTypes.bool,
  showSider: PropTypes.bool,
  userInfo: PropTypes.object,
};

export default MainLayout;
