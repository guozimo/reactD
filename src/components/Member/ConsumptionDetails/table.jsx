import React from 'react';
import { Table, Form } from 'antd';
import './index.less';

function consumeTable({ rechargeReportList, loading }) {

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
      title: '消费金额',
      dataIndex: 'sum',
      key: 'sum',
    }, {
      title: '消费本金',
      dataIndex: 'capital',
      key: 'capital',
    }, {
      title: '消费赠送',
      dataIndex: 'price',
      key: 'price',
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
      title: '账单号',
      dataIndex: 'id',
      key: 'id',
    }, {
      title: '消费门店',
      dataIndex: 'storeName',
      key: 'storeName',
    }, {
      title: '操作员',
      dataIndex: 'operateName',
      key: 'operateName',
    }, {
      title: '消费时间',
      dataIndex: 'date',
      key: 'date',
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


export default Form.create()(consumeTable);
