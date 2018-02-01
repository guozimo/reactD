import React,{ PropTypes } from 'react';
import { connect } from 'dva';
import DeliverySetForm from '../../components/Settled/DeliverySet';
import { Breadcrumb } from 'antd';
const Item = Breadcrumb.Item;

function DeliverySet() {
  return (
    <div className="infos-layout right">
      <div className="header">
        <div className="bread-nav">
          <Breadcrumb separator=">">
            <Item className="item">营业资料</Item>
            <Item className="item">组织机构</Item>
            <Item className="item" href="/settled.html#/merchants/chain-set">机构设置</Item>
            <Item className="item">配送中心设置</Item>
          </Breadcrumb>
        </div>
      </div>
      <DeliverySetForm />
    </div>
  );
}

export default connect()(DeliverySet);
