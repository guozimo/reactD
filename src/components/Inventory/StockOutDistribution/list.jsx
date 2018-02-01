import React, { PropTypes } from 'react'
import { Table, Icon, Popconfirm, Pagination, Alert, Tag, Tooltip} from 'antd';
import moment from 'moment';
import INVENTORY_PERMISSION from '../../common/Permission/inventoryPermission';
import Permission from '../../common/Permission/Permission.jsx';

const list = ({
  storeList,
  searchList,
  loading,
  distribId,
  pagination,
  onPageChange,
  onPageSizeChange,
  dataQuerySupplyList,
  onDetails, // 编辑/查看
  onClose, // 关闭
  exportItem, // 导出
}) => {
  // id 转名称
  const idToName = (text, type) => {
    let name = '';
    if(type === 'distribId'){
      storeList.map((value) => {
        if (text === value.id) {
          name = value.name;
          return true;
        }
      })
    } else if (type === 'depotId'){
      searchList.warehouseList.map((value) => {
        if (text === value.id) {
          name = value.depotName;
          return true;
        }
      })
    }
    return name;
  }
  const columns = [{
    title: '配送订单号',
    dataIndex: 'billNo',
    key: 'billNo',
  }, {
    title: '提交日期',
    dataIndex: 'updateTime',
    key: 'updateTime',
    render: text => (text ? <span> {moment(text).format('YYYY-MM-DD')} {moment(text).format('H:mm:ss')}</span> : ''),
  }, {
    title: '配送机构',
    dataIndex: 'distribId',
    key: 'distribId',
    render: text => <span>{idToName(text, 'distribId')}</span>
  }, {
    title: '出库仓库',
    dataIndex: 'depotName',
    key: 'depotName',
    // render: text => <span>{idToName(text, 'depotId')}</span>
  }, {
    title: '收货机构',
    dataIndex: 'storeName',
    key: 'storeName',
  }, {
    title: '订单状态',
    dataIndex: 'status',
    key: 'status',
    render: text => (<Tag color={{ '968': 'lightSalmon', '969': 'orange', '970': 'green' }[text]}>
      {{ '968': '待出库', '969': '部分出库', '970': '已出库' }[text]}
    </Tag>),
  },
  {
    title: '出库日期',
    dataIndex: 'outTime',
    key: 'outTime',
    render: text => (text ? <span> {moment(text).format('YYYY-MM-DD')} {moment(text).format('H:mm:ss')}</span> : ''),
  }, {
    title: '操作',
    key: 'action',
    render: (text, record) => (
      <span>
        <Permission path={INVENTORY_PERMISSION.DISPATCH_OUT.VIEW}>
          <a onClick={() => onDetails(record.id, 0, record.status)} >查看</a>
        </Permission>
        <Permission path={INVENTORY_PERMISSION.DISPATCH_OUT.OUT}>
          <span className="ant-divider" />
          {record.status!=970?<span>
            <a  onClick={() => onDetails(record.id, 1, record.status)} >出库</a>
            <span className="ant-divider" />
          </span>:null}
        </Permission>
        <Permission path={INVENTORY_PERMISSION.DISPATCH_OUT.EXPORT}>
          <a onClick={() => exportItem(record.id)} >导出</a>
        </Permission>
      </span>
    ),
  }];
  return (
    <div >
      {distribId &&
        <div>
          <Table
            columns={columns}
            loading={loading}
            dataSource={dataQuerySupplyList}
            pagination={pagination}
            onChange={onPageChange}
            onShowSizeChange={onPageSizeChange}
            rowKey={record => record.id}
          />
        </div>
      }
      {!distribId && <div className="page-no-shop icon-mg-t"></div>}
    </div>
  )
}

list.propTypes={
  loading: PropTypes.bool,
  storeId: PropTypes.string,
  onPageChange: PropTypes.func,
  onPageSizeChange: PropTypes.func,
  onDetails: PropTypes.func,
}
export default list
