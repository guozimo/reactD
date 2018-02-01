import React, { PropTypes } from 'react'
import { Table, Popconfirm } from 'antd'
import INVENTORY_PERMISSION from '../../common/Permission/inventoryPermission';
import Permission from '../../common/Permission/Permission.jsx';

function list({
  loading,
  dataSource,
  pagination,
  onPageChange,
  onPageSizeChange,
  onDeleteItem,
  onEditItem,
}) {
  const columns = [
    {
      title: '类型编码',
      dataIndex: 'stCode',
      key: 'stCode',
    }, {
      title: '类型名称',
      dataIndex: 'stName',
      key: 'stName',
    }, {
      title: '操作',
      key: 'operation',
      width: 100,
      render: (text, record) => (
        <p>
          <Permission path={INVENTORY_PERMISSION.SUPPLIER_TYPE.EDIT}>
            <a onClick={() => onEditItem(record)} style={{
              marginRight: 4,
            }}>编辑</a>
          </Permission>
          <Permission path={INVENTORY_PERMISSION.SUPPLIER_TYPE.DELETE}>
            <Popconfirm title="确定要删除吗？" onConfirm={() => onDeleteItem(record.id)}>
              <a>删除</a>
            </Popconfirm>
          </Permission>
        </p>
      ),
    },
  ]

  return (
    <div>
      <Table size="small"
             className="table"
             bordered
             columns={columns}
             dataSource={dataSource}
             loading={loading}
             onChange={onPageChange}
             onShowSizeChange={onPageSizeChange}
             showSizeChanger
             pagination={pagination}
             rowKey={record => record.id}
      />
    </div>
  )
}

list.propTypes = {
  onPageChange: PropTypes.func,
  onDeleteItem: PropTypes.func,
  onEditItem: PropTypes.func,
  dataSource: PropTypes.array,
  loading: PropTypes.bool,
  pagination: PropTypes.object,
  onPageSizeChange: PropTypes.func,
}

export default list
