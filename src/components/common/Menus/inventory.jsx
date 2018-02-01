import React, { PropTypes } from 'react';
import _ from 'lodash';
import { Link } from 'dva/router';
import { Menu, Icon } from 'antd';
import INVENTORY_PERMISSION from '../Permission/inventoryPermission';

const { SubMenu } = Menu;
const InventoryMenu = ({ menuData: { list }, location }) => {
  const currSelectedKeys = location.pathname;
  // console.log('permission list', list);
  const subKeysObj = [{
    key: 'sub1',
    name: '基本设置',
    items: [
      { key: '/stock/taxRate', name: '税率设置', permissionCode: 611001 },
      { key: '/stock/supplyRelation', name: '供货关系设置', permissionCode: 611002 },
      { key: '/stock/depotRelationSetting', name: '仓库配送关系设置', permissionCode: INVENTORY_PERMISSION.DEPOT_RELATION.PAGE.code },
      // { key: '/stock/orderTemplate', name: '订货模板' },
      // { key: '/stock/supplierType', name: '供应商类型', permissionCode: INVENTORY_PERMISSION.SUPPLIER_TYPE.PAGE.code },
      { key: '/index.html#/scm/unit', name: '单位管理', permissionCode: 611003 },
      { key: '/index.html#/scm/depot', name: '仓库档案', permissionCode: 611004 },
    ],
  }, {
    key: 'sub2',
    name: '物品管理',
    items: [
      { key: '/index.html#/scm/itemType', name: '物品类别', permissionCode: 612001 },
      { key: '/index.html#/scm/itemList', name: '物品档案', permissionCode: 612002 },
    ],
  }, {
    key: 'sub3',
    name: '供应商管理',
    items: [{ key: '/index.html#/scm/supplier', name: '供应商档案', permissionCode: 613001 }],
  }, {
    key: 'sub4',
    name: '门店进销存管理',
    items: [
      { key: '/stock/requisition', name: '门店请购', permissionCode: 614001 },
      { key: '/stock/dispatchCheck', name: '配送验收', permissionCode: INVENTORY_PERMISSION.DISPATCH_CHECK.PAGE.code },
      { key: '/stock/directCheck', name: '直运验收', permissionCode: 614002 },
      // { key: '/stock/purchase', name: '采购管理', permissionCode: 614003 },
      { key: '/index.html#/scm/stockInList/0/0/0/0/0/0/0/0', name: '入库管理', permissionCode: 614004 },
      { key: '/index.html#/scm/stockOutList/0/0/0/0/0/0/0/0', name: '出库管理', permissionCode: 614005 },
      { key: '/index.html#/scm/stockTransferList/0/0/0/0/0/0/0', name: '调拨管理', permissionCode: 614006 },
      { key: '/index.html#/scm/stockCheckList/0/0/0/0/0/0/0', name: '盘点管理', permissionCode: 614007 },
      { key: '/stock/monthEnd', name: '门店月结', permissionCode: 614008 },
      { key: '/index.html#/scm/stockReport', name: '库存报表', permissionCode: 614009 },
      { key: '/index.html#/scm/stockInOutSummary', name: '进销存汇总表', permissionCode: 614010 },
      { key: '/index.html#/scm/stockInOutDetail', name: '进销存明细', permissionCode: 614011 },
      { key: '/index.html#/scm/stockCheckDetailReport', name: '盘存明细表', permissionCode: 614012 },
    ],
  }, {
    key: 'sub9',
    name: '集团总部管理',
    items: [
      { key: '/stock/orderLib', name: '订单中心', permissionCode: 615001 },
      { key: '/stock/supplyOrder', name: '直运采购', permissionCode: 615002 },
      { key: '/stock/dispatchOrders', name: '配送订单', permissionCode: INVENTORY_PERMISSION.DISPATCH_ORDERS.PAGE.code },
      { key: '/stock/stockOutDistribution', name: '配送出库', permissionCode: INVENTORY_PERMISSION.DISPATCH_OUT.PAGE.code },
      { key: '/official/price_list', name: '配送售价单', permissionCode: INVENTORY_PERMISSION.PRICE_LIST.PAGE.code },
      { key: '/stock/deliveryPriceReport', name: '配送售价综合查询', permissionCode: INVENTORY_PERMISSION.DELIVERY_PRICE_LIST.PAGE.code },
      { key: '/stock/zb/stockIn', name: '入库管理', permissionCode: 615003 },
      { key: '/stock/stockOut', name: '出库管理', permissionCode: 615004 },
      { key: '/stock/cannManage', name: '调拨管理', permissionCode: 615005 },
      { key: '/stock/officialCheck', name: '盘点管理', permissionCode: 615006 },
      { key: '/stock/zbMonthEnd', name: '总部月结', permissionCode: 615007 },
      { key: '/stock/stockGlobalReport', name: '库存报表', permissionCode: 615008 },
      { key: '/stock/stockGlobalInOutSummary', name: '进销存汇总表', permissionCode: 615009 },
      // { key: '/stock/stockGlobalInOutDetail', name: '进销存明细报表' },
      // { key: '/stock/stockCheckDetailReport', name: '盘存明细表' },
      { key: '/stock/distributionDetailReport', name: '配送明细报表', permissionCode: INVENTORY_PERMISSION.DISTRIBUTION_DETAILS.PAGE.code },
      { key: '/stock/purchaseDetailsReports', name: '采购明细报表', permissionCode: INVENTORY_PERMISSION.PURCHASE_DETAILS.PAGE.code },
    ],
  }, {
    key: 'sub5',
    name: '成本管理',
    items: [
      { key: '/stock/utilities', name: '水电气设置', permissionCode: 616001 },
      { key: '/stock/cut', name: '核减明细查询', permissionCode: 616002 },
      { key: '/stock/reportCost', name: '成本综合分析', permissionCode: 616003 },
      { key: '/stock/reportDiff', name: '物资差异分析', permissionCode: 616004 },
      { key: '/stock/reportDish', name: '单菜毛利分析', permissionCode: 616005 },
    ],
  }, {
    key: 'sub6',
    name: '预估管理',
    items: [{ key: '/stock/forecast', name: '营业预估', permissionCode: 617001 },
      { key: '/stock/dishRates', name: '菜品点击率', permissionCode: 617002 },
      { key: '/stock/posPlans', name: '菜品销售计划', permissionCode: 617003 }],
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
      }
      return list.hasOwnProperty(obj.permissionCode) ? <Menu.Item key={obj.key}><Link to={obj.key}>{obj.name}</Link></Menu.Item> : null;
    }
    if (obj.key.lastIndexOf('index.html') >= 0) {
      return <Menu.Item key={obj.key}><a href={obj.key}>{obj.name}</a></Menu.Item>;
    }
    return <Menu.Item key={obj.key}><Link to={obj.key}>{obj.name}</Link></Menu.Item>;
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

InventoryMenu.propTypes = {
  menuData: PropTypes.object,
};

export default InventoryMenu;
