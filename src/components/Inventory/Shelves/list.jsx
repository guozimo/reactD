import React, { PropTypes } from 'react'
import { Table, Popconfirm, Pagination } from 'antd'

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
      title: '货架编码',
      dataIndex: 'shelvesCode',
      key: 'shelvesCode',
    }, {
      title: '货架名称',
      dataIndex: 'shelvesName',
      key: 'shelvesName',
    }, {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
    }, {
      title: '操作',
      key: 'operation',
      width: 100,
      render: (text, record) => (
        <p>
          <a onClick={() => onEditItem(record)} style={{
            marginRight: 4,
          }}>编辑</a>
          <Popconfirm title="确定要删除吗？" onConfirm={() => onDeleteItem(record.id)}>
            <a>删除</a>
          </Popconfirm>
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
