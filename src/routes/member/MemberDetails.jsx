import React,{ PropTypes } from 'react';
import { Breadcrumb } from 'antd';
import MemberDetailsContent from '../../components/Member/MemberDetailsContent';
const Item = Breadcrumb.Item;


function MemberDetails() {
  return (
    <div className="infos-layout right">
      <div className="header">
        <div className="bread-nav">
          <Breadcrumb separator=">">
            <Item className="item">会员管理</Item>
            <Item className="item">会员资料</Item>
            <Item className="item">会员资料</Item>
          </Breadcrumb>
        </div>
      </div>
      <MemberDetailsContent />

    </div>
  );
}

export default MemberDetails;



