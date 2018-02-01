import React, { PropTypes } from 'react';
import { Table, Tag, Tooltip} from 'antd';
import moment from 'moment';

const DirectCheckList = ({
  menuData,
  storeId,
  dataSourceAll,
  loading,
  billStatus,
  listPagination,
  selectedRows,

  toDetail,
  deleteItem,
  onPageChange,
  onPageSizeChange,
  exportDirectCheck,
  latestSelectedRows,
}) => {
  const columnsConfig = [
    {
      title: '采购单号',
      dataIndex: 'billNo',
      key: 'billNo',
    }, {
      title: '单据日期',
      dataIndex: 'bussDate',
      key: 'bussDate',
      render: text => text && moment(text).format('YYYY-MM-DD'),
    }, {
      title: '请购机构',
      dataIndex: 'storeName',
      key: 'storeName',
    }, {
      title: '供应商',
      dataIndex: 'busiName',
      key: 'busiName',
    }, {
      title: '验收状态',
      dataIndex: 'status',
      key: 'status',
      render: text => (<Tag color={{"967":"green","962":"blue"}[text]}>{{"967":"已验收","962":"待验收"}[text]}</Tag>),
    }, {
      title: '备注',
      dataIndex: 'remarks',
      key: 'remarks',
      width: 150,
      render: text => <Tooltip placement="leftTop" title={text}>
        <div className="ellipsed-line width-150">{text}</div>
      </Tooltip>,
    }, {
      title: '操作',
      dataIndex: 'operations',
      key: 'operations',
      render: (text, record) => (
        <div>
          {
            record.status === 967
            ? menuData['list'].hasOwnProperty('61400202') && <a onClick={() => { toDetail(record, 'view'); }} style={{color:'#00a854'}}>查看</a>
            : menuData['list'].hasOwnProperty('61400201') && <a onClick={() => { toDetail(record, 'check'); }}>验收</a>
          }
        </div>
      ),
    },
  ];
  const rowSelection = {
    selectedRowKeys: (() => selectedRows.map(item => item.id))(),
    onChange: (selectedRowKeys, selectingRows) => {
      latestSelectedRows(selectingRows);
    },
    getCheckboxProps: record => ({
      disabled: record.status === 967, // 已完成订单不允许再次选择
    }),
  };
  return (
    <div>
    {storeId && <Table
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

DirectCheckList.propTypes = {
  dataSourceAll: PropTypes.array,
  loading: PropTypes.bool,
  billStatus: PropTypes.object,
  listPagination: PropTypes.object,
  toDetail: PropTypes.func,
  deleteItem: PropTypes.func,
  onPageChange: PropTypes.func,
  onPageSizeChange: PropTypes.func,
  exportDirectCheck: PropTypes.func,
};
export default DirectCheckList;
