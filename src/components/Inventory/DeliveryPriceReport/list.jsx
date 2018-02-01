import React, { PropTypes } from 'react';
import { Table, Popconfirm, Tag } from 'antd';
import { codeToString, codeToArray } from '../../../utils';
import INVENTORY_PERMISSION from '../../common/Permission/inventoryPermission';
import Permission from '../../common/Permission/Permission.jsx';

const list = ({
  loading,
  orgInfoId,
  dataList,
  pagination,
  chooseBills,
  onPageChange,
  onPageSizeChange,
  onCancelBill, // 作废
  onDeleteBills,
  onSelectBills,
}) => {
  const columns = [{
    title: '单据编号',
    dataIndex: 'billNo',
    key: 'billNo',
  }, {
    title: '配送中心',
    dataIndex: 'orgInfoName',
    key: 'orgInfoName',
  }, {
    title: '门店名称',
    dataIndex: 'storeName',
    key: 'storeName',
  }, {
    title: '物品',
    dataIndex: 'goodsName',
    key: 'goodsName',
  }, {
    title: '物品编码',
    dataIndex: 'goodsCode',
    key: 'goodsCode',
  }, {
    title: '单位',
    dataIndex: 'unitName',
    key: 'unitName',
  }, {
    title: '规格',
    dataIndex: 'goodsSpec',
    key: 'goodsSpec',
  }, {
    title: '价格',
    dataIndex: 'goodsPrice',
    key: 'goodsPrice',
  }, {
    title: '执行时间段',
    dataIndex: 'lunchInRange',
    key: 'lunchInRange',
    render: (text, record) => `${record.startDate} ~ ${record.endDate}`,
  }, {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    render: (text) => {
      let statusTxt = '';
      if (text === 960) {
        statusTxt = <Tag color="#999">已作废</Tag>;
      } else if (text === 962) {
        statusTxt = <Tag color="green">已审核</Tag>;
      }
      return statusTxt;
    },
  }, {
    title: '操作时间',
    dataIndex: 'updateTime',
    key: 'updateTime',
  }, {
    title: '操作人',
    dataIndex: 'updateUserName',
    key: 'updateUserName',
  }, {
    title: '操作',
    key: 'action',
    render: (text, record) => (
      <span>
        {record.status === 960 && <i className="disabled-link">作废</i> }
        {record.status !== 960 &&
        <Permission path={INVENTORY_PERMISSION.DELIVERY_PRICE_LIST.ABOLISH}>
          <Popconfirm title="作废后，此物资分配的价格生效时间将会被废除，确定吗?" onConfirm={() => onCancelBill(record)}><a>作废</a></Popconfirm>
        </Permission>}
      </span>
    ),
  }];
  const rowSelection = {
    selectedRowKeys: chooseBills,
    type: 'checkbox',
    onSelect: (record, selected, selectedRows) => {
      if (!selected) {
        onDeleteBills(record.id);
      } else {
        const dataArray = [];
        dataArray.push(record);
        const goodsSearch = {
          selectedCodes: codeToArray(dataArray, 'id'),
          selectedBills: dataArray,
        };
        onSelectBills(goodsSearch);
      }
    },
    onSelectAll: (selected, selectedRows, changeRows) => {
      if (!selected) {
        onDeleteBills(codeToString(changeRows, 'id'));
      } else {
        const goodsSearch = {
          selectedCodes: codeToArray(changeRows, 'id'),
          selectedBills: changeRows,
        };
        onSelectBills(goodsSearch);
      }
    },
    getCheckboxProps: record => ({
      disabled: record.status === 960,
    }),
  };


  return (
    <div >
      {orgInfoId &&
        <div>
          <Table
            columns={columns}
            loading={loading}
            dataSource={dataList}
            rowSelection={rowSelection}
            pagination={pagination}
            onChange={onPageChange}
            onShowSizeChange={onPageSizeChange}
            rowKey={record => record.id}
            scroll={{ x: 1200 }}
          />
        </div>
      }
      {!orgInfoId && <div className="page-no-shop icon-mg-t"></div>}
    </div>
  )
}

list.propTypes = {
  loading: PropTypes.bool,
  orgInfoId: PropTypes.string,
  onPageChange: PropTypes.func,
  onPageSizeChange: PropTypes.func,
  onDetails: PropTypes.func,
}
export default list
