import React, { PropTypes } from 'react'
import { Table, Popconfirm, Switch, Alert, Tag } from 'antd'
import INVENTORY_PERMISSION from '../../common/Permission/inventoryPermission';
import Permission from '../../common/Permission/Permission.jsx';

const list = ({
dataList,
paginationSupply,
onPageChange,
onPageSizeChange,
onDeleteItem,
loading,
depotRowKeysModal,
depotRowConcat,
removeDepotExport,
depotExportAll,
depotRowConcatList,
orgInfoId,
}) => {
  const columns = [{
    title: '所属配送中心',
    dataIndex: 'orgInfoName',
    key: 'orgInfoName',
    sorter: true,
  }, {
    title: '仓库编码',
    dataIndex: 'depotCode',
    key: 'depotCode',
  }, {
    title: '仓库名称',
    dataIndex: 'depotName',
    key: 'depotName',
  }, {
    title: '物品编码',
    dataIndex: 'goodsCode',
    key: 'goodsCode',
  }, {
    title: '物品名称',
    dataIndex: 'goodsName',
    key: 'goodsName',
  }, {
    title: '物品类别',
    dataIndex: 'cateName',
    key: 'cateName',
    sorter: true,
  }, {
    title: '机构名称',
    dataIndex: 'storeName',
    key: 'storeName',
  }, {
    title: '添加时间',
    dataIndex: 'createTime',
    key: 'createTime',
    sorter: true,
  }, {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    render: (text, record) => (
      <Permission path={INVENTORY_PERMISSION.DEPOT_RELATION.DELETE}>
        <Popconfirm title="此操作会取消当前所选仓库与物资的供应关系，若需建立可以再次添加，确认执行此操作吗？" onConfirm={() => onDeleteItem(record.id)}>
          <a>删除</a>
        </Popconfirm>
      </Permission>
    ),
  }];
  const rowSelection = {
    selectedRowKeys: depotRowConcatList.length && depotRowConcatList.map(item => item.id),
    onChange: (selectedRowKeys, selectedRows) => {
      // goodsChoose = selectedRows[0];
      depotRowConcat(selectedRowKeys, selectedRows);
    },
    onSelect: (record, selected, selectedRows) => {
     // console.log(record, selected, selectedRows);
      removeDepotExport(record, selected, selectedRows);
    },
    onSelectAll: (selected, selectedRows, changeRows) => {
      // console.log(selected, selectedRows, changeRows);
      depotExportAll(selected, selectedRows, changeRows);
    },
    getCheckboxProps: record => ({
      // disabled: record.name === 'Disabled User',    // Column configuration not to be checked
    }),
    // selectedRowKeys : [queryRowId]
  };

  return (
    <div >
      {orgInfoId && <Table
        columns={columns}
        dataSource={dataList}
        loading={loading}
        rowSelection={rowSelection}
        onChange={onPageChange}
        onShowSizeChange={onPageSizeChange}
        pagination={paginationSupply}
        rowKey={record => record.id}
      />}

    </div>
  )
}

list.propTypes={
dataList:PropTypes.object,
}
export default list
