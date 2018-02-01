import React,{ PropTypes } from 'react';
import { connect } from 'dva';
import ModifyPasswordForm from '../../components/Settled/ModifyPassword';
import { Breadcrumb } from 'antd';
const Item = Breadcrumb.Item;


function ModifyPassword() {
  return (
    <div className="infos-layout right">
      <div className="header">
        <div className="bread-nav">
          <Breadcrumb separator=">">
            <Item className="item">营业资料</Item>
            <Item className="item">商户信息</Item>
            <Item className="item">修改密码</Item>
          </Breadcrumb>
        </div>
      </div>


      <ModifyPasswordForm />
    </div>
  );
}

export default connect()(ModifyPassword);
