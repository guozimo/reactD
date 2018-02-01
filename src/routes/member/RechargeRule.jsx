import React,{ PropTypes } from 'react';
import { connect } from 'dva';
import RechargeRuleForm from '../../components/Member/RechargeRule';
import { Breadcrumb } from 'antd';
const Item = Breadcrumb.Item;


function RechargeRule() {
  return (
    <div className="infos-layout right">
      <div className="header">
        <div className="bread-nav">
          <Breadcrumb separator=">">
            <Item className="item">营业资料</Item>
            <Item className="item">会员资料</Item>
            <Item className="item">充值规则</Item>
          </Breadcrumb>
        </div>
      </div>

      <RechargeRuleForm />

    </div>
  );
}

export default connect()(RechargeRule);



