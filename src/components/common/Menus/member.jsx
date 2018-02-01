import React, { PropTypes } from 'react';
import { Link } from 'dva/router';
import { Menu, Icon, Switch } from 'antd';

const { SubMenu } = Menu;

const MemberMenu = ({ menuData: { list } , location}) => {
    let currSelectedKeys = location.pathname;
    let subKeysObj = [{
      key: 'sub1',
      name: '会员资料',
      items: [
        { key: '/member/memberDetails', name: '会员资料' }
      ],
    }, {
      key: 'sub2',
      name: '规则设置',
      items: [
        { key: '/member/memberType', name: '会员类型' },
        { key: '/member/rechargeRule', name: '充值规则' }
      ],
    }, {
      key: 'sub3',
      name: '会员报表',
      items: [
        { key: '/member/rechargeDetails', name: '会员充值明细' },
        { key: '/member/consumptionDetails', name: '会员消费明细' }
      ],
    }];
    // console.log('currSelectedKeys',currSelectedKeys);
    const currOpenKeys = _.find(subKeysObj, (obj) => {
      const index = _.findIndex(obj.items, item => item.key === currSelectedKeys);
      if (index > -1) {
        return true;
      }
      return false;
    });
    // console.log('currOpenKeys',currOpenKeys);
    const genMenuItem = ((obj) => {
      if (obj.items) {
        return (<SubMenu key={obj.key} title={<span><Icon type="appstore" /><span>{obj.name}</span></span>}>{
          obj.items.map(item => genMenuItem(item))
        }</SubMenu>);
      } else if (obj.permissionCode) {
        if (obj.key.lastIndexOf('index.html') >= 0) {
          return list.hasOwnProperty(obj.permissionCode) ? <Menu.Item key={obj.key}><a href={obj.key}>{obj.name}</a></Menu.Item> : null;
        } else {
          return list.hasOwnProperty(obj.permissionCode) ? <Menu.Item key={obj.key}><Link to={obj.key}>{obj.name}</Link></Menu.Item> : null;
        }
      } else {
        if (obj.key.lastIndexOf('index.html') >= 0) {
          return <Menu.Item key={obj.key}><a href={obj.key}>{obj.name}</a></Menu.Item>;
        } else {
          return <Menu.Item key={obj.key}><Link to={obj.key}>{obj.name}</Link></Menu.Item>;
        }
      }
    });
    const menuTree = subKeysObj.map(obj => genMenuItem(obj));
    return (
      <div>
        <Menu
          style={{ width: 200 }}
          defaultSelectedKeys={[currSelectedKeys]}
          defaultOpenKeys={[currOpenKeys && currOpenKeys.key]}
          mode="inline"
        >
        {menuTree}
        </Menu>
      </div>
    );
};

MemberMenu.propTypes = {
  menuData: PropTypes.object,
};

export default MemberMenu;
