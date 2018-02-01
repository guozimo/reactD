import React, { PropTypes } from 'react';
import { Table, Pagination, Tag, Popconfirm} from 'antd';
import moment from 'moment';

const OrderLibList = ({
  menuData,
  orgId,
  storeId,
  dataSourceAll,
  loading,
  billStatus,
  listPagination,
  selectedRows,

  // module methods
  toDetail,
  retreatItem,
  onPageChange,
  onPageSizeChange,
  exportOrderLib,
  latestSelectedRows,
}) => {
  const columnsConfig = [{
      title: '请购单号',
      dataIndex: 'billNo',
      key: 'billNo',
    }, {
      title: '请购机构',
      dataIndex: 'storeName',
      key: 'storeName',
    }, {
      title: '请购日期',
      dataIndex: 'bussDate',
      key: 'bussDate',
      render: text => text && moment(text).format('YYYY-MM-DD'),
    }, {
      title: '订单状态',
      dataIndex: 'status',
      key: 'status',
      render: text => {
        text=text===965?964:text;  // 门店的已提交在总部是待处理
        return (<Tag color={{"962":"green","964":"orange","965":"blue"}[text]}>{billStatus[text]}</Tag>)},
    }, {
      title: '操作',
      dataIndex: 'operations',
      key: 'operations',
      render: (text, record) => (
        <div>
          { menuData['list'].hasOwnProperty('61500102') && <a onClick={() => { toDetail(record, 'view'); }}>查看</a> }<span className="ant-divider" />
          {record.status!=962 && menuData['list'].hasOwnProperty('61500103') ?<span><Popconfirm
            okText="确认退回"
            title={<div>
              <span style={{ color: 'red', fontWeight: 'bold' }}>
                危险操作！
              </span>
              <br />
              此订单将会退回到门店，请慎重操作，是否继续退回？
            </div>}
            onConfirm={() => retreatItem(record.id)}
          >
            <a>退回</a>
          </Popconfirm>
          <span className="ant-divider" /></span>:null}
          { menuData['list'].hasOwnProperty('61500104') && <a onClick={() => { exportOrderLib(record.id, record.storeId); }}>导出</a> }
        </div>
      ),
    },
  ];
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
    {orgId && <Table
      rowSelection={rowSelection}
      columns={columnsConfig}
      dataSource={dataSourceAll}
      loading={loading}
      rowKey={record => record.id}

      pagination={listPagination}
      onChange={onPageChange}
      onShowSizeChange={onPageSizeChange}
      />}
    </div>
  );
};

OrderLibList.propTypes = {
  dataSourceAll: PropTypes.array,
  loading: PropTypes.bool,
  billStatus: PropTypes.object,
  listPagination: PropTypes.object,
  toDetail: PropTypes.func,
  retreatItem: PropTypes.func,
  onPageChange: PropTypes.func,
  onPageSizeChange: PropTypes.func,
  exportOrderLib: PropTypes.func,
  latestSelectedRows: PropTypes.func,
};
export default OrderLibList;
