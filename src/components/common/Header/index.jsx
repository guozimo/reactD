import React, { PropTypes } from 'react';

const Header = ({ isLogin, userInfo, dispatch, showSider, hasSupplyChain, location: { pathname } }) => {
  function logout() {
    dispatch({
      type: 'merchantApp/logOut'
    })
  }

  return (
    <div id="header">
      <div className="top-bar">
        <div className="container">
          {
            isLogin && <div className="fl-l">
              { userInfo.tenName && `${userInfo.tenName} : ${userInfo.userName}` }
            </div>
          }

          <div className="fl-r">
            <ul>
              {/*<li><a href="/index.html#/site/help">帮助中心</a></li>*/}
              <li>客服/投诉电话：400-8100-167</li>
              { isLogin && <li onClick={logout}>退出</li>}
            </ul>
          </div>
        </div>
      </div>
      <div className="container" role="navigation">
        <div className="main-nav display-box">
          <a className="logo" href="/settled.html#/merchants/merchantsInfo">
            <figure />
            <span className="sub">商家后台</span>
          </a>
          {
            (isLogin && showSider) && <div className="right display-box-1">
              <ul className="fl-r nav-list">
                <li className={pathname.indexOf('merchants') > -1 && 'selected'}><a href="/settled.html#/merchants/merchantsInfo">营业资料</a></li>
                { hasSupplyChain && <li className={pathname.indexOf('stock') > -1 && 'selected'}><a href="/inventory.html#/stock/taxRate">供应链</a></li>}
              </ul>
            </div>
          }
        </div>
      </div>
    </div>
  );
};

Header.propTypes = {
  isLogin: PropTypes.bool,
  userInfo: PropTypes.object,
  location: PropTypes.object,
  showSider: PropTypes.bool,
  dispatch: PropTypes.func,
};

export default Header;
