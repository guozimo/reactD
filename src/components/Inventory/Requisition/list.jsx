import React, { PropTypes } from 'react';
import { Table, Icon, Pagination, Tag, Popconfirm} from 'antd';
import moment from 'moment';

const RequisitionList = ({
  menuData,
  storeId,
  dataSourceAll,
  loading,
  billStatus,
  listPagination,

  toDetail,
  deleteItem,
  onPageChange,
  onPageSizeChange,
  exportRequisition,
}) => {
  const columnsConfig = [{
    title: '请购单',
    dataIndex: 'billNo',
    key: 'billNo',
  }, {
    title: '请购日期',
    dataIndex: 'bussDate',
    key: 'bussDate',
    render: text => (text ? <span> {moment(text).format('YYYY-MM-DD')}</span> : ''),
  }, {
    title: '订单状态',
    dataIndex: 'status',
    key: 'status',
    render: text => (<Tag color={{ '962': 'green', '964': 'orange', '965': 'blue' }[text]}>{billStatus[text]}</Tag>),
  }, {
    title: '操作人',
    dataIndex: 'createUserName',
    key: 'createUserName',
  }, {
    title: '更新时间',
    dataIndex: 'updateTime',
    key: 'updateTime',
    render: text => (text ? <span>{moment(text).format('MM-DD HH:mm')}</span> : ''),
  }, {
    title: '操作',
    dataIndex: 'operations',
    key: 'operations',
    render: (text, record) => (
      <div>
        { menuData['list'].hasOwnProperty('61400102') && <span><a onClick={() => { toDetail(record, 'view'); }}>查看</a><span className="ant-divider" /></span> }
        {record.status === 964 && menuData['list'].hasOwnProperty('61400104') && <span><a onClick={() => { toDetail(record, 'edit'); }}>编辑</a><span className="ant-divider" /></span>}
        {record.status === 964 && menuData['list'].hasOwnProperty('61400105') && <span>
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
            <a style={{ color: 'red' }}>删除</a>
          </Popconfirm>
          <span className="ant-divider" />
        </span>}
        { menuData['list'].hasOwnProperty('61400103') && <a onClick={() => { exportRequisition(record.id); }}>导出</a>}
      </div>
    ),
  },
  ];
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

RequisitionList.propTypes = {
  dataSourceAll: PropTypes.array,
  loading: PropTypes.bool,
  billStatus: PropTypes.object,
  listPagination: PropTypes.object,
  toDetail: PropTypes.func,
  deleteItem: PropTypes.func,
  onPageChange: PropTypes.func,
  onPageSizeChange: PropTypes.func,
  exportRequisition: PropTypes.func,
};
export default RequisitionList;
