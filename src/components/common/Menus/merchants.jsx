import React, { PropTypes } from 'react';
import { Link } from 'dva/router';
import { Menu, Icon, Switch } from 'antd';

const { SubMenu } = Menu;

const MerchantsMenu = ({ menuData: { list } , hasItemPower, location}) => {

    let currSelectedKeys = location.pathname;
    // console.log('permission list',list);
    let subKeysObj = [{
      key: 'sub1',
      name: '商户信息',
      items: [
        { key: '/merchants/merchantsInfo', name: '商家信息', permissionCode: 101001 },
        { key: '/merchants/modifyPassword', name: '修改密码', permissionCode: 101001 },
      ],
    }, {
      key: 'sub2',
      name: '组织机构',
      items: [{ key: '/merchants/authority', name: '岗位权限', permissionCode: 102001 },
        { key: '/merchants/chain-set', name: '机构设置', permissionCode: 102002 },

{ key: '/merchants/memberManagement', name: '商户人员管理',permissionCode: 102003 },
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
          return list.hasOwnProperty(obj.permissionCode) && (obj.itemPower ? hasItemPower : true) ? <Menu.Item key={obj.key}><a href={obj.key}>{obj.name}</a></Menu.Item> : null;
        } else {
          return list.hasOwnProperty(obj.permissionCode) && (obj.itemPower ? hasItemPower : true) ? <Menu.Item key={obj.key}><Link to={obj.key}>{obj.name}</Link></Menu.Item> : null;
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

MerchantsMenu.propTypes = {
  menuData: PropTypes.object,
};

export default MerchantsMenu;
