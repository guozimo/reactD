import React, { PropTypes } from 'react';
import { Table, Icon, Pagination, Tag, Popconfirm} from 'antd';
import moment from 'moment';

const OrderTemplateList = ({
  storeId,
  dataSourceAll,
  loading,
  listPagination,
  selectedRows,
  // module func
  toDetail,
  deleteItem,
  onPageChange,
  onPageSizeChange,
  latestSelectedRows,
}) => {
  const columnsConfig = [{
    title: '序号',
    dataIndex: 'key',
    key: 'key',
    render: (text, record, index) => (parseInt(index) + 1),
  }, {
    title: '模板编号',
    dataIndex: 'templateNo',
    key: 'templateNo',
  }, {
    title: '模板名称',
    dataIndex: 'templateName',
    key: 'templateName',
  }, {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    render: (text) => {
      let status = '';
      switch (text) {
        case 1:
          status = '启用';
          break;
        case 0:
          status = '停用';
          break;
        default:
          break;
      }
      return status;
    },
  }, {
    title: '操作',
    dataIndex: 'operations',
    key: 'operations',
    render: (text, record) => (
      <div>
        {record.status === 1 && <span><a onClick={() => { toDetail(record, 'edit'); }}> 分配 </a><span className="ant-divider" /></span>}
        <a onClick={() => { toDetail(record, 'view'); }}>查看</a><span className="ant-divider" />
        <a onClick={() => { toDetail(record, 'edit'); }}>编辑</a><span className="ant-divider" />
        {record.status === 1 && <span>
          <Popconfirm
            okText="继续删除"
            title={<div>
              <span style={{ color: 'red', fontWeight: 'bold' }}>
                危险操作！
              </span>
              <br />
              删除后无法恢复，请慎重操作，是否继续删除？
            </div>}
            onConfirm={() => deleteItem(record.id)}
          >
            <a>删除</a>
          </Popconfirm>
          <span className="ant-divider" />
        </span>}
      </div>
    ),
  }];
  const rowSelection = {
    selectedRowKeys: (() => selectedRows.map(item => item.id))(),
    onChange: (selectedRowKeys, selectedRows) => {
      latestSelectedRows(selectedRows);
    },
    getCheckboxProps: record => ({
      disabled: record.status === 962, // 已完成订单不允许再次选择
    }),
  };
  return (
    <div>
      <Table
        rowSelection={rowSelection}
        columns={columnsConfig}
        dataSource={dataSourceAll}
        loading={loading}
        rowKey={record => record.id}

        pagination={listPagination}
        onChange={onPageChange}
        onShowSizeChange={onPageSizeChange}
      />
    </div>
  );
};

OrderTemplateList.PropTypes = {
  dataSourceAll: PropTypes.array,
  loading: PropTypes.bool,
  listPagination: PropTypes.object,
  toDetail: PropTypes.func,
  deleteItem: PropTypes.func,
  onPageChange: PropTypes.func,
  onPageSizeChange: PropTypes.func,
  latestSelectedRows: PropTypes.func,
};

export default OrderTemplateList;
