
import { Table, Tag, Popconfirm } from 'antd';
import React, { PropTypes } from 'react';
import moment from 'moment';
import INVENTORY_PERMISSION from '../../common/Permission/inventoryPermission';
import Permission from '../../common/Permission/Permission.jsx';

const PriceListList = ({
  orgId,
  storeId,
  dataSourceAll,
  loading,
  billStatus,
  listPagination,

  toDetail,
  deleteItem,
  abolishItem,
  onPageChange,
  onPageSizeChange,
  exportPriceList,
}) => {
  const columnsConfig = [{
    title: '单据编号',
    dataIndex: 'billNo',
    key: 'billNo',
  }, {
    title: '机构名称',
    dataIndex: 'orgInfoName',
    key: 'orgInfoName',
  }, {
    title: '订单状态',
    dataIndex: 'status',
    key: 'status',
    // 状态（962：已审核，961：待审核，960：已作废）
    render: text => (<Tag color={{ '960': 'gray', '962': 'green', '961': 'orange' }[text]}>{billStatus[text]}</Tag>),
  }, {
    title: '操作人',
    dataIndex: 'updateUserName',
    key: 'updateUserName',
  }, {
    title: '操作时间',
    dataIndex: 'updateTime',
    key: 'updateTime',
    render: text => (text ? <span> {moment(text).format('YYYY-MM-DD hh:mm:ss')}</span> : ''),
  }, {
    title: '操作',
    dataIndex: 'operations',
    key: 'operations',
    render: (text, record) => (
      <div>
        <Permission path={INVENTORY_PERMISSION.PRICE_LIST.VIEW}>
          <a onClick={() => { toDetail(record, 'view'); }}>查看</a>
        </Permission>
        {record.status === 961 &&
          <Permission path={INVENTORY_PERMISSION.PRICE_LIST.EDIT}>
            <span className="ant-divider" />
            <a onClick={() => { toDetail(record, 'edit'); }}>编辑</a>
          </Permission>}
        {record.status === 962 &&
          <Permission path={INVENTORY_PERMISSION.PRICE_LIST.ABOLISH}>
            <span className="ant-divider" />
            <Popconfirm
              okText="确定作废"
              title={<div>
                <span style={{ color: 'red', fontWeight: 'bold' }}>
                  危险操作！
                </span>
                <br />
                作废后无法恢复，请慎重操作，是否确定执行作废操作？
              </div>}
              onConfirm={() => abolishItem(record)}
            >
              <a>整单作废</a>
            </Popconfirm>
          </Permission>}
        {record.status === 961 &&
          <Permission path={INVENTORY_PERMISSION.PRICE_LIST.DELETE}><span className="ant-divider" />
            <Popconfirm
              okText="继续删除"
              title={<div>
                <span style={{ color: 'red', fontWeight: 'bold' }}>
                  危险操作！
                </span>
                <br />
                删除后无法恢复，请慎重操作，是否继续删除？
              </div>}
              onConfirm={() => deleteItem(record)}
            >
              <a style={{ color: 'red' }}>删除</a>
            </Popconfirm>
          </Permission>}
      </div>
    ),
  },
  ];
  return (
    <div>
      {orgId && <Table
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

PriceListList.propTypes = {
  dataSourceAll: PropTypes.array,
  loading: PropTypes.bool,
  billStatus: PropTypes.object,
  listPagination: PropTypes.object,
  toDetail: PropTypes.func,
  deleteItem: PropTypes.func,
  onPageChange: PropTypes.func,
  onPageSizeChange: PropTypes.func,
  exportPriceList: PropTypes.func,
};
export default PriceListList;
