import React, { PropTypes } from 'react'
import { Table, Popconfirm } from 'antd'

function list({
  loading,
  dataSource,
  pagination,
  onPageChange,
  onPageSizeChange,
  onDeleteItem,
  onEditItem,
  menuData,
}) {
  const columns = [
    {
      title: '税率编码',
      dataIndex: 'taxCode',
      key: 'taxCode',
    }, {
      title: '税率名称',
      dataIndex: 'taxName',
      key: 'taxName',
    }, {
      title: '税率值',
      dataIndex: 'taxRatio',
      key: 'taxRatio',
    }, {
      title: '操作',
      key: 'operation',
      width: 100,
      render: (text, record) => (
        <p>
          {menuData['list'].hasOwnProperty('61100102')&&<a onClick={() => onEditItem(record)} style={{
            marginRight: 4,
          }}>编辑</a>}
          {menuData['list'].hasOwnProperty('61100103')&&<Popconfirm title="确定要删除吗？" onConfirm={() => onDeleteItem(record.id)}>
            <a>删除</a>
          </Popconfirm>}
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
