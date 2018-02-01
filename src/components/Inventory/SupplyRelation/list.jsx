import React, { PropTypes } from 'react'
import { Table, Popconfirm, Tooltip, Switch, Alert, Tag } from 'antd'
const list = ({
menuData,
dataList,
paginationSupply,
onPageChange,
onPageSizeChange,
onDeleteItem,
loading,
updateSupplyChange,
supplyListRowConcatList,
supplyListRowConcat,
removeSupplyListExport,
supplyListExportAll,
}) => {
  const columns = [{
    title: '供应商编码',
    dataIndex: 'supplyCode',
    key: 'supplyCode',
  }, {
    title: '供应商名称',
    dataIndex: 'supplyName',
    key: 'supplyName',
  }, {
    title: '门店编码',
    dataIndex: 'storeCode',
    key: 'storeCode',
  }, {
    title: '机构名称',
    dataIndex: 'storeName',
    key: 'storeName',
  }, {
    title: '物资编码',
    dataIndex: 'goodsCode',
    key: 'goodsCode',
  }, {
    title: '物资名称',
    dataIndex: 'goodsName',
    key: 'goodsName',
  }, {
    title: '操作时间',
    dataIndex: 'updateTime',
    key: 'updateTime',
    sorter: true,
  }, {
    title: '优先级',
    dataIndex: 'priority',
    key: 'priority',
    filters: [{
      text: 'A级',
      value: 'A',
    }, {
      text: 'B级',
      value: 'B',
    }],
    render: (text, record) => (
      record.priority === 'A' && record.counts === 1 ?
        <Tooltip placement="topLeft" title="该物资在本门店下只有一个供应商不能修改优先级">
          <Switch checked={record.priority === 'A'} disabled={record.priority === 'A' && record.counts === 1} checkedChildren="A级" unCheckedChildren="B级" />
        </Tooltip>
        : menuData['list'].hasOwnProperty('61100202') ?
          <Popconfirm title="确定要修改吗？" onConfirm={() => updateSupplyChange(record)}>
            <a>
              <Switch defaultChecked={record.priority === 'A'} disabled={!menuData['list'].hasOwnProperty('61100202')}
                checked={record.priority === 'A'} checked={record.priority === 'A'} checkedChildren="A级" unCheckedChildren="B级" />
            </a>
          </Popconfirm>
          : <Switch defaultChecked={record.priority === 'A'} disabled={!menuData['list'].hasOwnProperty('61100202')} checked={record.priority === 'A'}
              checkedChildren="A级" unCheckedChildren="B级" />
    ),
  }, {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    render: (text, record) => (
      <p>
        { menuData['list'].hasOwnProperty('61100204') && <Popconfirm title="确定要删除吗？" onConfirm={() => onDeleteItem(record.id)}>
          <a>删除</a>
        </Popconfirm> }
      </p>
    ),
  }];

  const rowSelection = {
    selectedRowKeys: supplyListRowConcatList.length && supplyListRowConcatList.map(item => item.id),
    onChange: (selectedRowKeys, selectedRows) => {
      // goodsChoose = selectedRows[0];
      supplyListRowConcat(selectedRowKeys, selectedRows);
    },
    onSelect: (record, selected, selectedRows) => {
     // console.log(record, selected, selectedRows);
      removeSupplyListExport(record, selected, selectedRows);
    },
    onSelectAll: (selected, selectedRows, changeRows) => {
      // console.log(selected, selectedRows, changeRows);
      supplyListExportAll(selected, selectedRows, changeRows);
    },
    getCheckboxProps: record => ({
      // disabled: record.name === 'Disabled User',    // Column configuration not to be checked
    }),
    // selectedRowKeys : [queryRowId]
  };

  return (
    <div >
      <Table
        columns={columns}
        dataSource={dataList}
        loading={loading}
        onChange={onPageChange}
        rowSelection={rowSelection}
        onShowSizeChange={onPageSizeChange}
        pagination={paginationSupply}
        rowKey={record => record.id}
      />

    </div>
  )
}

list.propTypes={
dataList:PropTypes.array,
}
export default list
