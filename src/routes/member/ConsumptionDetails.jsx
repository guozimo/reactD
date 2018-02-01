import React,{ PropTypes } from 'react';
import { connect } from 'dva';
import RechargeRuleForm from '../../components/Member/ConsumptionDetails';
import { Breadcrumb } from 'antd';
const Item = Breadcrumb.Item;

function consumptionDetails() {
  return (
    <div className="infos-layout right">
      <div className="header">
        <div className="bread-nav">
          <Breadcrumb separator=">">
            <Item className="item">会员管理</Item>
            <Item className="item">会员报表</Item>
            <Item className="item">消费明细</Item>
          </Breadcrumb>
        </div>
      </div>

      <RechargeRuleForm />

    </div>
  );
}

export default connect()(consumptionDetails);
