import React,{ PropTypes } from 'react';
import { Breadcrumb } from 'antd';
import MemberMainContent from '../../components/Member/MemberMainContent';
const Item = Breadcrumb.Item;


function MemberType() {
  return (
    <div className="infos-layout right">
      <div className="header">
        <div className="bread-nav">
          <Breadcrumb separator=">">
            <Item className="item">会员管理</Item>
            <Item className="item">会员资料</Item>
            <Item className="item">会员类型</Item>
          </Breadcrumb>
        </div>
      </div>
      <MemberMainContent />

    </div>
  );
}

export default MemberType;



