import React,{ PropTypes } from 'react';
import { connect } from 'dva';
import MerchantInfo from '../../components/Settled/MerchantDisplay';
import CompletionForm from '../../components/Settled/Completion';
import { Breadcrumb } from 'antd';
const Item = Breadcrumb.Item;

function MerchantDisplay({ params }) {
  return (
    <div className="infos-layout right">
      <div className="header">
        <div className="bread-nav">
          <Breadcrumb separator=">">
            <Item className="item">营业资料</Item>
            <Item className="item">商户信息</Item>
            <Item className="item">商家信息</Item>
          </Breadcrumb>
        </div>
      </div>
      { params.edit ? <CompletionForm /> : <MerchantInfo /> }
    </div>
  );
}

export default connect()(MerchantDisplay);


