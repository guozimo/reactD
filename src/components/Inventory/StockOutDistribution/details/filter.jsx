import React, { PropTypes } from 'react';
import { Form, Breadcrumb, Tag } from 'antd';
import moment from 'moment';

const FormItem = Form.Item;

const StockOutDetailsSearch = ({
  pageType,
  storeId,
  findList,
}) => {
  const arrivalDate = moment(findList.arrivalDate).format('YYYY-MM-DD');
  return (
    <div className="components-search">
      <Breadcrumb separator=">">
        <Breadcrumb.Item>供应链</Breadcrumb.Item>
        <Breadcrumb.Item>集团总部管理</Breadcrumb.Item>
        <Breadcrumb.Item>配送出库</Breadcrumb.Item>
        {pageType === 'edit' && <Breadcrumb.Item>出库</Breadcrumb.Item>}
        {pageType === 'view' && <Breadcrumb.Item>查看出库单</Breadcrumb.Item>}
      </Breadcrumb>
      <Form layout="inline" style={!storeId ? { display: 'none' } : {}}>
        <FormItem label="配送订单">
          {findList.billNo}
        </FormItem>
        <FormItem label="订单状态">
          <Tag color={{ '968': 'lightSalmon', '969': 'orange', '970': 'green' }[findList.status]}>
            {{ '968': '待出库', '969': '部分出库', '970': '已出库' }[findList.status]}
          </Tag>
        </FormItem>
        <FormItem label="配送机构">
          {findList.distribName}
        </FormItem>
        <FormItem label="出库仓库">
          {findList.depotName}
        </FormItem>
        <FormItem label="收货机构">
          {findList.storeName}
        </FormItem>
        <FormItem label="提交人">
          {findList.updateUserName}
        </FormItem>
        <FormItem label="提交时间">
          {findList.createTime}
        </FormItem>
        <FormItem label="到货日期">
          {arrivalDate}
        </FormItem>
        {
          pageType === 'view' &&
          <div style={{ display: 'inline-block' }}>
            <FormItem label="出库人">
              {findList.updateUserName}
            </FormItem>
            <FormItem label="出库时间">
              {findList.updateTime}
            </FormItem>
          </div>
        }
        <FormItem label="备注">
          {findList.remarks}
        </FormItem>
      </Form>
        <span className="attention-left">出库数为零的物品将不出现在本次出库单中</span>
      {/* <span className="attention">注：淡蓝色框可输入</span> */}
    </div>
  );
};

StockOutDetailsSearch.PropTypes = {
  storeId: PropTypes.string,
};

export default Form.create()(StockOutDetailsSearch);
