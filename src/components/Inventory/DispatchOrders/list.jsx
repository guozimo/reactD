import React, { PropTypes } from 'react';
import { Table, Icon, Pagination, Tag, Popconfirm} from 'antd';
import moment from 'moment';
import INVENTORY_PERMISSION from '../../common/Permission/inventoryPermission';
import Permission from '../../common/Permission/Permission.jsx';

const RequisitionList = ({
  distribId,
  dataSourceAll,
  loading,
  listPagination,

  onView, // 查看配送订单
  onEdit, // 编辑配送订单
  onClose, // 删除配送订单
  onExport, // 导出配送订单
  onPageChange,
  onPageSizeChange,
}) => {
  const columnsConfig = [{
    title: '配送订单号',
    dataIndex: 'billNo',
    key: 'billNo',
  }, {
    title: '创建日期',
    dataIndex: 'bussDate',
    key: 'bussDate',
    render: text => (text ? <span> {moment(text).format('YYYY-MM-DD')}</span> : ''),
  }, {
    title: '配送机构',
    dataIndex: 'distribName',
    key: 'distribName',
  }, {
    title: '出库仓库',
    dataIndex: 'depotName',
    key: 'depotName',
  }, {
    title: '收货机构',
    dataIndex: 'storeName',
    key: 'storeName',
  }, {
    title: '订单状态',
    dataIndex: 'status',
    key: 'status',
    render: text => (<Tag color={{ '964': 'lightSalmon', '968': 'orange', '969': 'orangeRed', '970': 'green', '966': 'gray' }[text]}>
      {{ '964': '待处理', '968': '待出库', '969': '部分出库', '970': '已出库', '966': '已关闭' }[text]}
    </Tag>),
  }, {
    title: '操作',
    dataIndex: 'operations',
    key: 'operations',
    render: (text, record) => (
      <div>
        <Permission path={INVENTORY_PERMISSION.DISPATCH_ORDERS.VIEW}>
          <a onClick={() => { onView(record.id); }}>查看</a><span className="ant-divider" />
        </Permission>
        <Permission path={INVENTORY_PERMISSION.DISPATCH_ORDERS.EXPORT}>
          <a onClick={() => { onExport(record.id, 1); }}>导出</a>
        </Permission>
        {(record.status === 964) && <Permission path={INVENTORY_PERMISSION.DISPATCH_ORDERS.EDIT}>
          <span className="ant-divider" />
          <a onClick={() => { onEdit(record.id); }}>编辑</a>
        </Permission>}
        {(record.status === 964) && <Permission path={INVENTORY_PERMISSION.DISPATCH_ORDERS.CLOSE}>
          <Popconfirm
            okText="继续关闭"
            title={<div>
              <span style={{ color: 'red', fontWeight: 'bold' }}>
                危险操作！
              </span>
              <br />
              关闭后无法恢复，请慎重操作，是否继续关闭？
            </div>}
            onConfirm={() => onClose(record.id, 966)}
          >
            <span className="ant-divider" />
            <a>关闭</a>
          </Popconfirm>
        </Permission>}
      </div>
    ),
  },
  ];
  return (
    <div>
      {distribId && <Table
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
  onView: PropTypes.func,
  onEdit: PropTypes.func,
  onClose: PropTypes.func,
  onExport: PropTypes.func,
  onPageChange: PropTypes.func,
  onPageSizeChange: PropTypes.func,
  exportRequisition: PropTypes.func,
};
export default RequisitionList;
