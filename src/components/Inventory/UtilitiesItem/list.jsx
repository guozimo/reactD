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
      title: '录表日期',
      dataIndex: 'enterDate',
      key: 'enterDate',
    }, {
      title: '上次基数',
      dataIndex: 'preCnt',
      key: 'preCnt',
    }, {
      title: '当前数量',
      dataIndex: 'currCnt',
      key: 'currCnt',
    }, {
      title: '实际用量',
      dataIndex: 'realCnt',
      key: 'realCnt',
    }, {
      title: '单价',
      dataIndex: 'price',
      key: 'price',
    }, {
      title: '金额',
      dataIndex: 'amt',
      key: 'amt',
    },
    {
      title: '操作',
      key: 'operation',
      width: 100,
      render: (text, record, index) => (
        <p>
          { (index === 0 && pagination.current === 1) &&
          <a onClick={() => onEditItem(record)} style={{
            marginRight: 4,
          }}>编辑</a>
          }
          { (index === 0 && pagination.current === 1)  &&
            <Popconfirm title="确定要删除吗？" onConfirm={() => onDeleteItem(record)}>
              <a>删除</a>
            </Popconfirm>
          }
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
