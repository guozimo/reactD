import React, { PropTypes } from 'react';
import { Table, Icon, Pagination, Tag, Popconfirm} from 'antd';
import moment from 'moment';
import INVENTORY_PERMISSION from '../../common/Permission/inventoryPermission';
import Permission from '../../common/Permission/Permission';

const RequisitionList = ({
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
    title: '调拨单号',
    dataIndex: 'billNo',
    key: 'billNo',
  }, {
    title: '调出库',
    dataIndex: 'outDepotName',
    key: 'outDepotName',
  }, {
    title: '调入库',
    dataIndex: 'inDepotName',
    key: 'inDepotName',
  }, {
    title: '调拨日期',
    dataIndex: 'bussDate',
    key: 'bussDate',
    render: text => (text ? <span> {moment(text).format('YYYY-MM-DD')}</span> : ''),
  }, {
    title: '金额',
    dataIndex: 'totalAmt',
    key: 'totalAmt',
  }, {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    render: text => (<Tag color={{ '962': 'green', '961': 'orange', '966': 'gray' }[text]}>
      {{ '962': '已完成', '961': '未完成', '966': '已关闭' }[text]}
    </Tag>),
  }, {
    title: '创建日期',
    dataIndex: 'createTime',
    key: 'createTime',
    render: text => (text ? <span> {moment(text).format('YYYY-MM-DD')}</span> : ''),
  }, {
    title: '操作',
    dataIndex: 'operations',
    key: 'operations',
    render: (text, record) => (
      <div>
        {record.status === 961 &&
          <Permission path={INVENTORY_PERMISSION.CANN_MANAGE.DELETE}>
          <span>
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
        </span>
        </Permission>
      }
        {record.status === 961 && <Permission path={INVENTORY_PERMISSION.CANN_MANAGE.SUBMIT}>
           <span><a onClick={() => { toDetail(record, 'edit'); }}> 调单 </a><span className="ant-divider" /></span></Permission>}
         <Permission path={INVENTORY_PERMISSION.CANN_MANAGE.VIEW}>
          <span><a onClick={() => { toDetail(record, 'view'); }}>查看</a><span className="ant-divider" /></span>
        </Permission>

         <Permission path={INVENTORY_PERMISSION.CANN_MANAGE.EXPORT}> <a onClick={() => { exportRequisition(record.id); }}>导出</a></Permission>
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
