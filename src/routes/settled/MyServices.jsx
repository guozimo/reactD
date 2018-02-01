import React,{ PropTypes } from 'react';
import MyServicesTable from '../../components/Settled/MyServices';
import { Breadcrumb } from 'antd';
const Item = Breadcrumb.Item;

function MyServices() {
  return (
    <div className="infos-layout right">
      <div className="header">
        <div className="bread-nav">
          <Breadcrumb separator=">">
            <Item className="item">营业资料</Item>
            <Item className="item">我的信息</Item>
            <Item className="item">我的服务</Item>
          </Breadcrumb>
        </div>
      </div>
      <MyServicesTable/>
    </div>
  );
}


export default MyServices;
