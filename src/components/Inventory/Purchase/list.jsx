import React, { PropTypes } from 'react';
import { Table,Icon, Pagination } from 'antd';


const list = ({
  loading,
  storeId,
  dataSourceAll,
  page,
  pagination,
  onPageChange,
  onPageSizeChange,
  updateItem,
  exportItem,
}) => {
  const listColumns = [{
    title: '单据号',
    dataIndex: 'billNo',
    key: 'billNo',
    render: text => <a href="#">{text}</a>,
  }, {
    title: '单据类型',
    dataIndex: 'billType',
    key: 'billType',
  }, {
    title: '供应商名称',
    dataIndex: 'suppName',
    key: 'suppName',
  }, {
    title: '仓库名称',
    dataIndex: 'depotName',
    key: 'depotName',
  }, {
    title: '采购日期',
    dataIndex: 'bussDate',
    key: 'bussDate',
  }, {
    title: '税前金额',
    dataIndex: 'totalAmt',
    key: 'totalAmt',
  }, {
    title: '操作',
    key: 'action',
    render: (text, record) => (
      <span>
        <a href="#" onClick={()=>{updateItem(record)}}>查看</a>
        <span className="ant-divider" />
        <a  onClick={()=>{exportItem(record)}}><Icon type="export" />导出</a>

      </span>
    ),
  }];
  return (
    <div>
    {storeId && <Table
      columns={listColumns}
      dataSource={dataSourceAll}
      loading={loading}
      pagination={pagination}
      onChange={onPageChange}
      onShowSizeChange={onPageSizeChange}
      rowKey={record => record.id}
      />}

    </div>
  );
};
list.propTypes = {
  onPageChange: PropTypes.func,
  onPageSizeChange: PropTypes.func,
  updateItem: PropTypes.func,
  dataSourceAll: PropTypes.object,
  pagination: PropTypes.object,
};
export default list;
