import React,{ PropTypes } from 'react';
import { connect } from 'dva';
import ImportManagement from '../../components/Settled/ManagementImport';
import { Breadcrumb, Button } from 'antd';
const Item = Breadcrumb.Item;

function ManagementImport() {

  return (
    <div className="infos-layout right">
      <div className="header">
        <div className="bread-nav">
          <Breadcrumb separator=">">
            <Item className="item">营业资料</Item>
            <Item className="item">组织机构</Item>
            <Item className="item">商户人员管理</Item>
          </Breadcrumb>
        </div>
      </div>
    {/*  <ImportTable />*/}
      <ImportManagement />
    </div>
  );
}

export default connect()(ManagementImport);
