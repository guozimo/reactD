import React,{ PropTypes } from 'react';
import { connect } from 'dva';
import KeyshopSetForm from '../../components/Settled/KeyShop';
import { Breadcrumb } from 'antd';
import { isEmptyObject } from '../../utils'
const Item = Breadcrumb.Item;

function KeyshopSet({ params, location, initData }) {
  const form = <KeyshopSetForm storeCode={location.query.storeCode} />;

  return (
    <div className="infos-layout right">
      <div className="header">
        <div className="bread-nav">
          <Breadcrumb separator=">">
            <Item className="item">营业资料</Item>
            <Item className="item">组织机构</Item>
            <Item className="item" href="/index.html#/infos/chain-set">机构设置</Item>
            <Item className="item">口碑立即开店</Item>
          </Breadcrumb>
        </div>
      </div>
      {
        params.edit ? !isEmptyObject(initData) && form : form
      }
    </div>
  );
}

function mapStateToProps(state) {
  const { initData } = state.keyShop;

  return {
    initData,
  };
}

export default connect(mapStateToProps)(KeyshopSet);
