import React,{ PropTypes } from 'react';
import { connect } from 'dva';
import ImportTable from '../../components/Settled/BatchImport';
import { Breadcrumb, Button } from 'antd';
const Item = Breadcrumb.Item;

function BatchImport() {

  return (
    <div className="infos-layout right">
      <div className="header">
        <div className="bread-nav">
          <Breadcrumb separator=">">
            <Item className="item">营业资料</Item>
            <Item className="item">其他设置</Item>
            <Item className="item">批量导入</Item>
          </Breadcrumb>
        </div>
      </div>
      <ImportTable />
    </div>
  );
}

export default connect()(BatchImport);
