import React from 'react';
import { Breadcrumb, Tag, Select, Input, DatePicker, Form } from 'antd';
import moment from 'moment';

const OrderLibDetailsFilter = ({
  opType,
  user,
  bussDate,
  currentId,
  filterNo,
  pageInfo,
  billStatus,

  // module methods
  selectedBussDate,

  // private vars and methods
  disabledDate,
}) => {
  disabledDate = (current) => {
    // Can not select days before today and today
    return current && current.valueOf() < moment().add(-1, 'days');
  };
  /*
    <Form.Item label="请购单">
      <span style={{ width: 160 }}>{filterNo}</span>
    </Form.Item>
  */
  const thisStatus = pageInfo.status === 965 ? 964 : pageInfo.status; // 门店的已提交在总部是待处理
  return (
    <div className="components-search">
      <Breadcrumb separator=">">
        <Breadcrumb.Item>供应链</Breadcrumb.Item>
        <Breadcrumb.Item>集团总部管理</Breadcrumb.Item>
        <Breadcrumb.Item>订单中心</Breadcrumb.Item>
        <Breadcrumb.Item>{{ generate: '生成订单', view: '查看订单' }[opType]}</Breadcrumb.Item>
      </Breadcrumb>
      <Form layout="inline">
        <Form.Item label="请购单" style={opType === 'generate' ? { display: 'none' } : { display: 'show' }}>
          <span style={{ width: 160 }}>{filterNo}</span>
        </Form.Item>
        <Form.Item label="请购日期" style={opType === 'generate' ? { display: 'none' } : { display: 'show' }}>
          <DatePicker disabledDate={disabledDate} defaultValue={moment(bussDate, 'YYYY-MM-DD')} disabled onChange={selectedBussDate} />
        </Form.Item>
        <Form.Item label="操作人" style={opType === 'generate' ? { display: 'none' } : { display: 'show' }}>
          <Input style={{ width: 160 }} disabled value={user && user.message} />
        </Form.Item>
        <Form.Item label="待拆分订单物资明细" style={opType === 'generate' ? { display: 'show' } : { display: 'none' }} />
      </Form>
      <Form layout="inline">
        <Form.Item label="请购状态" style={opType === 'generate' ? { display: 'none' } : { display: 'show' }}>
          <span style={{ width: 160 }}><Tag color={{ 962: 'green', 964: 'orange', 965: 'blue' }[thisStatus]}>{billStatus[thisStatus]}</Tag></span>
        </Form.Item>
        <Form.Item label="请购机构" style={opType === 'generate' ? { display: 'none' } : { display: 'show' }}>
          <span style={{ width: 160 }}>{pageInfo.storeName}</span>
        </Form.Item>
        <Form.Item label="创建人" style={opType === 'generate' ? { display: 'none' } : { display: 'show' }}>
          <span style={{ width: 160 }}>{pageInfo.createUserName}</span>
        </Form.Item>
        <Form.Item label="创建时间" style={opType === 'generate' ? { display: 'none' } : { display: 'show' }} >
          <span style={{ width: 160 }}>{pageInfo.createTime}</span>
        </Form.Item>
      </Form>
    </div>
  );
};

export default OrderLibDetailsFilter;
