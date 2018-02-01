import React, { PropTypes } from 'react'
import { Table, Icon, Popconfirm, Pagination, Alert, Tag, Tooltip} from 'antd';
import moment from 'moment';

const list = ({
  loading,
  storeId,
  distribId,
  pagination,
  onPageChange,
  onPageSizeChange,
  dataQuerySupplyList,
  onDetails, // 编辑/查看
  onClose, // 关闭
  exportItem, // 导出
}) => {
  const columns = [{
    title: '订单来源',
    dataIndex: 'billSource',
    key: 'billSource',
    render: (text) => {
      if (text === 1) {
        return (
          <span style={{ color: '#ff6600' }}>生成 </span>
        );
      } else if (text === 2) {
        return (
          <span style={{ color: '#60BE29' }}>手工创建</span>
        );
      } else {
        return (
          <span style={{ color: '#ccc' }}>暂无数据</span>
        );
      }
    },
  }, {
    title: '采购订单',
    dataIndex: 'billNo',
    key: 'billNo',
  }, {
    title: '订单类型',
    dataIndex: 'billType',
    key: 'billType',
    render: (text) => {
      if (text === 934) {
        return (
          <span style={{ color: '#ff6600' }}>直运 </span>
        );
      } else {
        return (
          <span style={{ color: '#ccc' }}>暂无数据</span>
        );
      }
    },
  }, {
    title: '请购日期',
    dataIndex: 'bussDate',
    key: 'bussDate',
    render: text => (text ? <span> {moment(text).format('YYYY-MM-DD')}</span> : ''),
  }, {
    title: '请购机构',
    dataIndex: 'storeName',
    key: 'storeName',
  }, {
    title: '供应商',
    dataIndex: 'busiName',
    key: 'busiName',
  }, {
    title: '订单状态',
    dataIndex: 'status',
    key: 'status',
    render: text => (<Tag color={{ '962': 'green', '964': 'orange', '966': 'gray' }[text]}>
      {{ '962': '已完成', '964': '待处理', '966': '已关闭' }[text]}
    </Tag>),
  }, {
  //   title: '备注',
  //   dataIndex: 'remarks',
  //   key: 'remarks',
  //   width: 150,
  //   render: text => <Tooltip placement="leftTop" title={text}>
  //     <div className="ellipsed-line width-150">{text}</div>
  //   </Tooltip>
  // }, {
    title: '操作',
    key: 'action',
    render: (text, record) => (
      <span>
        <a  onClick={() => onDetails(record.id, 0)} >查看</a>
        <span className="ant-divider" />
        <a  onClick={() => exportItem(record.id)} >导出</a>
        {
          (record.status !== 964) ? '' : <span>  <span className="ant-divider" /><a  onClick={() => onDetails(record.id, 1)}>编辑</a><a onClick={() => onClose(record.id, 1)}><span className="ant-divider" /> 关闭</a></span>
        }
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
