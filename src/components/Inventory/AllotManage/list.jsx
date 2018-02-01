import React, { PropTypes } from 'react'
import { Table, Tag, Popconfirm, Pagination,Alert } from 'antd'
import moment from 'moment';

const list = ({
  loading,
  storeId,
  pagination,
  onPageChange,
  onPageSizeChange,
  onDetails,
  onDown,
  dataList,
  onDelete,
}) => {
  const columns = [{
    title: '序号',
    dataIndex: 'key',
    key: 'key',
    render: (text, record, index) => (parseInt(index) + 1),
  }, {
    title: '单据号',
    dataIndex: 'billNo',
    key: 'billNo',
    render: text => <a href="#">{text}</a>,
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
    title: '设置',
    key: 'action',
    render: (text, record) => (
      <span>
          <a  onClick={() => onDetails(record.id, 0)} >查看</a>
        <span className="ant-divider" />
        {record.status!= '962' ? <span><a  onClick={() => onDetails(record.id, 1)} >编辑</a>
        <span className="ant-divider" />
        <a  onClick={() => onDelete(record.id)} >删除</a></span> : '' }


        <span className="ant-divider" />
        <a  onClick={() => onDown(record.id, 0)} >导出</a>
      </span>
    ),
  }];
  return (
    <div>
      {storeId &&
        <div>
          <Table
            columns={columns}
            loading={loading}
            dataSource={dataList}
            pagination={pagination}
            onChange={onPageChange}
            onShowSizeChange={onPageSizeChange}
            rowKey={record => record.id}
          />
        </div>
      }
      {!storeId && <div className="page-no-shop icon-mg-t"></div>}
    </div>
  )
}

list.propTypes={
  loading: PropTypes.bool,
  storeId: PropTypes.string,
  onPageChange: PropTypes.func,
  onPageSizeChange: PropTypes.func,
}
export default list
