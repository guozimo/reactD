import React, { PropTypes } from 'react';
import { Table, Tag, Tooltip } from 'antd';
import moment from 'moment';
import INVENTORY_PERMISSION from '../../common/Permission/inventoryPermission';
import Permission from '../../common/Permission/Permission.jsx';

const DispatchCheckList = ({
  storeId,
  dataSourceAll, // 数据数组
  loading,
  listPagination, // 分页器
  toDetail,
  onPageChange, // 页码改变的回调，参数是改变后的页码及每页条数
  onPageSizeChange, // pageSize 变化的回调
}) => {
  // 在dataIndex、key中填后台传的参数
  const columnsConfig = [
    {
      title: '配送出库单号',
      dataIndex: 'billNo',
      key: 'billNo',
    }, {
      title: '单号创建日期',
      dataIndex: 'orderDate',
      key: 'orderDate',
      render: text => text && moment(text).format('YYYY-MM-DD'),
    }, {
      title: '配送中心',
      dataIndex: 'distribName',
      key: 'distribName',
    }, {
      title: '出库仓库',
      dataIndex: 'depotName',
      key: 'depotName',
    }, {
      title: '验收状态',
      dataIndex: 'auditStatus',
      key: 'auditStatus',
      render: text => ( // text:当前数据的值
        <Tag color={{ 1: 'green', 0: 'blue' }[text]}>
          {{ 1: '已验收', 0: '待验收' }[text]}
        </Tag>
      ),
    }, {
      title: '配送单号',
      dataIndex: 'upBillNo',
      key: 'upBillNo',
    },
    // {
    //   title: '备注',
    //   dataIndex: 'remarks',
    //   key: 'remarks',
    //   width: 150,
    //   render: text =>
    //     <Tooltip placement="leftTop" title={text}>
    //       <div className="ellipsed-line width-150">{text}</div>
    //     </Tooltip>,
    // },
    {
      title: '操作',
      dataIndex: 'operations',
      key: 'operations',
      render: (text, record) => (
        <div>
          {
            record.auditStatus === 1
            ? <Permission path={INVENTORY_PERMISSION.DISPATCH_CHECK.VIEW}>
              <a onClick={() => { toDetail(record, 'view'); }} style={{ color: '#00a854' }}>查看</a>
            </Permission>
            : <Permission path={INVENTORY_PERMISSION.DISPATCH_CHECK.CHECK}>
              <a onClick={() => { toDetail(record, 'check'); }}>验收</a>
            </Permission>
          }
          {/* {
            record.auditStatus === 1
            ?
              <a onClick={() => { toDetail(record, 'view'); }} style={{ color: '#00a854' }}>查看</a>
            :
              <a onClick={() => { toDetail(record, 'check'); }}>验收</a>
          } */}
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
        rowKey={record => record.id} // 表格行 key 的取值
        pagination={listPagination} // 分页器
        onChange={onPageChange} // 换页
        onShowSizeChange={onPageSizeChange} // pageSize 变化的回调
      />}
    </div>
  );
};

DispatchCheckList.propTypes = {
  dataSourceAll: PropTypes.array,
  loading: PropTypes.bool,
  listPagination: PropTypes.object,
  toDetail: PropTypes.func,
  onPageChange: PropTypes.func,
  onPageSizeChange: PropTypes.func,
};
export default DispatchCheckList;
