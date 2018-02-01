import React, { PropTypes } from 'react';
import { Table, Icon, Pagination, Tag, Popconfirm} from 'antd';
import moment from 'moment';

const OfficialCheckList = ({
  menuData,
  orgId,
  storeId,
  dataSourceAll,
  loading,
  listPagination,

  toDetail,
  deleteItem,
  onPageChange,
  onPageSizeChange,
  exportOfficialCheck,
}) => {
  const billStatus = { '962': '已完成', '961': '未完成' };
  const billType = { '941': '日盘', '942': '周盘' , '943': '月盘' , '944': '其他' };
  const columnsConfig = [{
    title: '盘点单',
    dataIndex: 'billNo',
    key: 'billNo',
  }, {
    title: '盘点方式',
    dataIndex: 'checkMode',
    key: 'checkMode',
    render: text => <span style={{color:{ '941': '#ffbf00', '942': '#f56a00' , '943': '#f5317f' , '944': '#bfbfbf' }[text]}}>{billType[text]}</span>,
  }, {
    title: '仓库名称',
    dataIndex: 'depotName',
    key: 'depotName',
  }, {
    title: '盘点日期',
    dataIndex: 'bussDate',
    key: 'bussDate',
    render: text => (text ? <span> {moment(text).format('YYYY-MM-DD')}</span> : ''),
  }, {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    render: text => (<Tag color={{ '962': 'green', '961': 'orange' }[text]}>{billStatus[text]}</Tag>),
  }, {
  //   title: '创建日期',
  //   dataIndex: 'createTime',
  //   key: 'createTime',
  //   render: text => (text ? <span> {moment(text).format('YYYY-MM-DD')}</span> : ''),
  // }, {
    title: '操作',
    dataIndex: 'operations',
    key: 'operations',
    render: (text, record) => (
      <div>
        { menuData['list'].hasOwnProperty('61500602') && <a onClick={() => { toDetail(record, 'view'); }}>查看</a> }<span className="ant-divider" /> 
        {record.status === 961 && menuData['list'].hasOwnProperty('61500604') &&  <span><a onClick={() => { toDetail(record, 'edit', { goodsCode: false, checkQty: false, dualGoodsQty: false, remarks: false }); }}>编辑</a><span className="ant-divider" /></span>}
        {record.status === 961 && menuData['list'].hasOwnProperty('61500605') &&  <span>
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
            <a style={{ color: 'red' }}>删除</a>
          </Popconfirm>
          <span className="ant-divider" />
        </span>}
        { menuData['list'].hasOwnProperty('61500603') && <a onClick={() => { exportOfficialCheck(record.id); }}>导出</a> }
      </div>
    ),
  },
  ];
  return (
    <div>
      {orgId && <Table
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

OfficialCheckList.propTypes = {
  dataSourceAll: PropTypes.array,
  loading: PropTypes.bool,
  listPagination: PropTypes.object,
  toDetail: PropTypes.func,
  deleteItem: PropTypes.func,
  onPageChange: PropTypes.func,
  onPageSizeChange: PropTypes.func,
  exportOfficialCheck: PropTypes.func,
};
export default OfficialCheckList;
