import React,{ PropTypes } from 'react';
import { connect } from 'dva';
import RestaurantSetForm from '../../components/Settled/RestaurantSet';
import { Breadcrumb } from 'antd';
const Item = Breadcrumb.Item;

function RestaurantSet() {
  return (
    <div className="infos-layout right">
      <div className="header">
        <div className="bread-nav">
          <Breadcrumb separator=">">
            <Item className="item">营业资料</Item>
            <Item className="item">组织机构</Item>
            <Item className="item" href="settled.html#/merchants/chain-set">机构设置</Item>
            <Item className="item">餐厅设置</Item>
          </Breadcrumb>
        </div>
      </div>
      <RestaurantSetForm />
    </div>
  );
}

export default connect()(RestaurantSet);
