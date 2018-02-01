import React,{ PropTypes } from 'react';
import { connect } from 'dva';
import PrinterTemplateForm from '../../components/Settled/PrinterTemplate';
import { Breadcrumb } from 'antd';
const Item = Breadcrumb.Item;

function PrinterTemplate() {
  return (
    <div className="infos-layout right">
      <div className="header">
        <div className="bread-nav">
          <Breadcrumb separator=">">
            <Item className="item">营业资料</Item>
            <Item className="item">硬件管理</Item>
            <Item className="item">打印机设置</Item>
            <Item className="item">设置结账单图片</Item>
          </Breadcrumb>
        </div>
      </div>
      <PrinterTemplateForm />
    </div>
  );
}

export default connect()(PrinterTemplate);


