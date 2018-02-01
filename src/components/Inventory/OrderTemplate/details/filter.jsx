import React from 'react';
import { Select, Input, Radio, DatePicker, Spin, Breadcrumb, Form } from 'antd';
import moment from 'moment';
const Option = Select.Option;

const OrderTempDetailsFilter = ({
  pageType,
  templateNo,
  templateName,
  status,
}) => {
  return (
    <div>
      <div className="components-search">
        <Breadcrumb separator=">">
          <Breadcrumb.Item>供应链</Breadcrumb.Item>
          <Breadcrumb.Item>基础设置</Breadcrumb.Item>
          <Breadcrumb.Item>订货模板</Breadcrumb.Item>
          <Breadcrumb.Item>{ pageType === 'edit' ? '编辑' : pageType === 'view' ? '查看' : '新增'}模板</Breadcrumb.Item>
        </Breadcrumb>
      </div>
    </div>
  );
};
export default Form.create()(OrderTempDetailsFilter);
