import React, { PropTypes } from 'react';
import { Table, Icon, Pagination, Tag, Popconfirm} from 'antd';
import moment from 'moment';

const StockOutList = ({
  menuData,
  storeId,
  dataSourceAll,
  loading,
  loadingList,
  billStatus,
  listPagination,

  onView, // 查看
  onEdit, // 查看
  onExport, // 查看
  onDelete, // 删除
  onReverse, // 反审核
  monthDate,
  exportStockOut,
  onPageChange,
  onPageSizeChange,
}) => {
  const columnsConfig = [{
    title: '出库单号',
    dataIndex: 'billNo',
    key: 'billNo',
  }, {
    title: '出库类型',
    dataIndex: 'billType',
    key: 'billType',
    render: (text) => {
      let billType = '';
      switch (text) {
        case 919:
          billType = '其它出库单';
          break;
        case 917:
          billType = '报损出库单';
          break;
        case 916:
          billType = '消耗出库单';
          break;
        case 922:
          billType = '调拨出库单';
          break;
        case 915:
          billType = '盘亏出库单';
          break;
        case 939:
          billType = '配送出库单';
          break;
        default:
          break;
      }
      return billType;
    },
  }, {
    title: '仓库',
    dataIndex: 'depotName',
    key: 'depotName',
  }, {
    title: '单据日期',
    dataIndex: 'bussDate',
    key: 'bussDate',
    render: (text) => (moment(text).format('YYYY-MM-DD')),
  }, {
    title: '出库日期',
    dataIndex: 'createTime',
    key: 'createTime',
    render: (text) => moment(text).format('YYYY-MM-DD'),
  }, {
    title: '单据状态',
    dataIndex: 'status',
    key: 'status',
    render: (text) => {
      let statusTxt = '';
      if (text === 961) {
        statusTxt = '未完成';
      } else if (text === 962) {
        statusTxt = '已完成';
      }
      return statusTxt;
    },
  }, {
    title: '操作',
    dataIndex: 'operations',
    key: 'operations',
    render: (text, record) => (
      <span>
        { menuData['list'].hasOwnProperty('61500402') && <a onClick={() => onView(record.id)} >查看<span className="ant-divider" /></a> }
        {record.status === 961 && menuData['list'].hasOwnProperty('61500406') && <a onClick={() => onEdit(record.id)}>调单<span className="ant-divider" /></a> }
        {record.status === 961 && menuData['list'].hasOwnProperty('61500405') &&<span>
          <Popconfirm
            okText="继续删除"
            title={<div>
              <span style={{ color: 'red', fontWeight: 'bold' }}>
                  危险操作！
              </span>
              <br />
                删除后无法恢复，请慎重操作，是否继续删除？
              </div>}
            onConfirm={() => onDelete(record.id)}
          >
            <a>删除</a>
          </Popconfirm>
          <span className="ant-divider" />
        </span>}
        {record.status === 962 && (record.billType === 919 || record.billType === 917 || record.billType === 916)
           && moment(record.bussDate).isSameOrAfter(moment(monthDate)) && menuData['list'].hasOwnProperty('61500403') &&
           <a onClick={() => onReverse(record.id)}>反审核<span className="ant-divider" /></a> }
        { menuData['list'].hasOwnProperty('61500404') && <a onClick={() => onExport(record.id, 1)}>导出</a> }
      </span>
    ),
  }];
  return (
    <div>
      {storeId && <Table
        columns={columnsConfig}
        dataSource={dataSourceAll}
        loading={loadingList}
        rowKey={record => record.id}

        pagination={listPagination}
        onChange={onPageChange}
        onShowSizeChange={onPageSizeChange}
      />}
    </div>
  );
};

StockOutList.PropTypes = {
  dataSourceAll: PropTypes.array,
  loading: PropTypes.bool,
  billStatus: PropTypes.object,
  listPagination: PropTypes.object,
  onView: PropTypes.func,
  onEdit: PropTypes.func,
  onExport: PropTypes.func,
  onDelete: PropTypes.func,
  onReverse: PropTypes.func,
  monthDate: PropTypes.string,
  exportStockOut: PropTypes.func,
  onPageChange: PropTypes.func,
  onPageSizeChange: PropTypes.func,
};

export default StockOutList;
