import React from 'react';
import { Table, Form } from 'antd';
import './index.less';

function ConsumptionDetailsTable({ rechargeReportList, loading }) {
  const columns = [
    {
      title: '会员类型',
      dataIndex: 'memberType',
      key: 'memberType',
    },{
      title: '会员卡号',
      dataIndex: 'memberCard',
      key: 'memberCard',
    }, {
      title: '手机号',
      dataIndex: 'mobile',
      key: 'mobile',
    }, {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '充值金额',
      dataIndex: 'volume',
      key: 'volume',
    }, {
      title: '赠送金额',
      dataIndex: 'donate',
      key: 'donate',
    }, {
      title: '充值总额',
      dataIndex: 'sum',
      key: 'sum',
    }, {
      title: '期初金额',
      dataIndex: 'beforeSum',
      key: 'beforeSum',
    },
    {
      title: '期末金额',
      dataIndex: 'afterSum',
      key: 'afterSum',
    }, {
      title: '支付方式',
      dataIndex: 'paymodeName',
      key: 'paymodeName',
    }, {
      title: '充值门店',
      dataIndex: 'storeName',
      key: 'storeName',
    }, {
      title: '操作员',
      dataIndex: 'empName',
      key: 'empName',
    }, {
      title: '充值时间',
      dataIndex: 'time',
      key: 'time',
    },
  ];
  return (
    <div>
      <Table
        columns={columns}
        dataSource={rechargeReportList}
        loading={loading}
        bordered
      />
    </div>
  );
};

export default Form.create()(ConsumptionDetailsTable);
