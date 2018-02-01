import React, { PropTypes } from 'react';
import { Form, Input, Button, Select, Tooltip, Breadcrumb, DatePicker, Row, Col, message } from 'antd';
import moment from 'moment';
import { queryGoodsID } from '../../../../services/inventory/common';

const Option = Select.Option;
const FormItem = Form.Item;

const DispatchOrdersDetailsSearch = ({
  pageType,
  currRemarks, // 实时输入的备注
  billNo, // 配送订单号
  distribName, // 配送机构
  storeName, // 收货机构
  updateUserName, // 提交人
  updateTime, // 提交时间
  createUserName, // 拆单人
  createTime, // 拆单时间
  depotName, // 配送仓库
  status, // 订单状态
  remarks, // 请求数据中的备注
  // module methods
  setCurrRemarks,
  // private vars and methods
  setRemarks,
}) => {
  const statusList = {
    964: '待处理',
    968: '待出库',
    969: '部分出库',
    970: '已出库',
    966: '已关闭',
  };
  setRemarks = (e) => { setCurrRemarks(e.target.value); };
  return (
    <div className="components-search">
      <Breadcrumb separator=">">
        <Breadcrumb.Item>供应链</Breadcrumb.Item>
        <Breadcrumb.Item>集团总部管理</Breadcrumb.Item>
        <Breadcrumb.Item>配送订单</Breadcrumb.Item>
        {pageType === 'view' && <Breadcrumb.Item>查看配送订单</Breadcrumb.Item>}
        {pageType === 'edit' && <Breadcrumb.Item>编辑配送订单</Breadcrumb.Item>}
      </Breadcrumb>
      <Form layout="inline">
        <FormItem label="配送订单" >
          <span>{billNo}</span>
        </FormItem>
        <FormItem label="订单状态" value={status}>
          <span>{statusList[status]}</span>
        </FormItem>
        <FormItem label="配送机构">
          <span>{distribName}</span>
        </FormItem>
        <FormItem label="出库仓库">
          <span>{depotName}</span>
        </FormItem>
        <FormItem label="收货机构">
          <span>{storeName}</span>
        </FormItem>
        <FormItem label="提交人" style={{ display: pageType === 'edit' ? 'none' : '' }}>
          <span>{updateUserName}</span>
        </FormItem>
        <FormItem label="提交时间" style={{ display: pageType === 'edit' ? 'none' : '' }}>
          <span>{updateTime}</span>
        </FormItem>
        <FormItem label="拆单人">
          <span>{createUserName}</span>
        </FormItem>
        <FormItem label="拆单时间">
          <span>{createTime}</span>
        </FormItem>
        <FormItem label="备注" style={{ display: pageType === 'view' ? 'none' : '' }}>
          <Input placeholder="请输入" style={{ width: 300 }} value={currRemarks} onChange={setRemarks} />
        </FormItem>
        <FormItem label="备注" style={{ display: pageType === 'edit' ? 'none' : '' }}>
          <span>{currRemarks}</span>
        </FormItem>
      </Form>
      {/* <div className="attention">注：淡蓝色框可输入</div> */}
    </div>
  );
};

DispatchOrdersDetailsSearch.PropTypes = {
  storeId: PropTypes.string,
  // onSupplierQuery: PropTypes.func,
  changeBillType: PropTypes.func,
  selectBillType: PropTypes.func,
};

export default Form.create()(DispatchOrdersDetailsSearch);
