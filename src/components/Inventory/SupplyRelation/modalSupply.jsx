import React, { PropTypes } from 'react'
import { Form, Input, Modal, Row, Col, Button, Tree, Select, Switch, Table, message } from 'antd'
const FormItem = Form.Item;
const Option = Select.Option;
const Search = Input.Search;
const TreeNode = Tree.TreeNode;


const modal = ({
  loading,
  exportVisible,
  onCancel,
  okTenantPriority,
  scmInGoodsList,
  dataTree,
  paginationGoods,
  onSelectMenu,
  onCheck,
  onPageChange,
  goodsModalExport,
  selectedRowKeys,
  handleChange,
  supplierPriorityList,
  supplyRowKeyExport,
  changeStore,
  storeList,
  storeId,
  supplyModalRowChange,
  findGoodsBySupplierList,
  onPageBySupplierChange,
  paginationBySupplier,
  selectSupplyDefault,
  selectSupplyChange,
  selectedPriorityRowKeys,
  goodsPriorityExport,
  onPriorityAChange,
  supplyId,
  setPriority,
  supplierList,
  changeShop,
  fetchShop,
  supplierId,
  fetchingSupplier,
  onSearch,
  paginationSupplyStore,
  selectedSupplierRowKeys,
  priorityRowList, // 全部数据
  removePriorityExport, // 全部数据
  goodsPriorityExportAll, // 移除全部数据
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
  },
}) => {
  function handleOk() {
      okTenantPriority();
  }
  // console.log("我是设置exportVisible",exportVisible);
  // console.log("supplierListsupplierList",supplierList);
  supplyRowKeyExport = (key, value) => {
    console.log(key, value[0].id);
    supplyModalRowChange(key, value);
  }
  const modalOpts = {
    width: 800,
    title: '请修改优先级',
    visible: exportVisible,
    onOk: handleOk,
    onCancel,
    wrapClassName: 'vertical-center-modal',
    confirmLoading: loading,
  }
  const columnsSupply = [
    {
      title: '供应商编码',
      dataIndex: 'suppCode',
      key: 'suppCode',
    }, {
      title: '供应商名称',
      dataIndex: 'suppName',
      key: 'suppName',
    },
  ]
  const columnsGoods = [
    {
      title: '物资编码',
      dataIndex: 'goodsCode',
      key: 'goodsCode',
    }, {
      title: '物资名称',
      dataIndex: 'goodsName',
      key: 'goodsName',
    }, {
      title: '优先级',
      key: 'priority',
      render: (text, record) => (
        <span>
          <Switch defaultChecked={record.priority === 'A'} checked={record.priority === 'A'} onChange={value => selectSupplyChange(value, record.id)} checkedChildren="A级" unCheckedChildren="B级" />
        </span>
      ),
    }
  ]
  // console.warn("storeId", storeId);
  const rowSelection = {
    type: 'radio',
    selectedRowKeys: selectedSupplierRowKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      // goodsChoose = selectedRows[0];
      supplyRowKeyExport(selectedRowKeys, selectedRows);
    },
    onSelect: (record, selected, selectedRows) => {
     // console.log(record, selected, selectedRows);
    },
    onSelectAll: (selected, selectedRows, changeRows) => {
      // console.log("selected",selected,"selectedRows", selectedRows, changeRows);
    },
    getCheckboxProps: record => ({
      // disabled: record.name === 'Disabled User',    // Column configuration not to be checked
    }),
  };
  const rowGoodsSelection = {
    selectedRowKeys: selectedPriorityRowKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      // goodsChoose = selectedRows[0];
      goodsPriorityExport(selectedRowKeys, selectedRows);
    },
    onSelect: (record, selected, selectedRows) => {
     // console.log(record, selected, selectedRows);
      removePriorityExport(record, selected, selectedRows);
    },
    onSelectAll: (selected, selectedRows, changeRows) => {
      // console.log("selected",selected,"selectedRows", selectedRows, changeRows);
      goodsPriorityExportAll(selected, selectedRows, changeRows);
    },
    getCheckboxProps: record => ({
      // disabled: record.name === 'Disabled User',    // Column configuration not to be checked
    }),
    //selectedRowKeys : [queryRowId]
  };
  // lierList && supplierList.map(store =><Option value={store.id} title={store.suppName} key={store.id}>{store.suppName}</Option>);
  const storeOptions = storeList && storeList.map(store => <Option value={store.id} key={store.id}>{store.name}</Option>);
  // console.log("storeOptions",storeOptions,"supplierAllList",supplierAllList);
  return (
    <Modal {...modalOpts}>
        <div className="components-modal">
          <div style={{ marginBottom: 20 }}>
            <Select
              style={{ width: 160 }}
              onChange={changeStore}
              value={storeId}
              placeholder="请选择机构"
            >
              <Option value="" key="">请选择机构</Option>
              {storeOptions}
            </Select>

          </div>

          {storeId &&  <Row gutter={16}>

            <Col span={12}>
             <Col span={24}>
             <Search
               placeholder="请填写供应商名称"
               style={{ width: 200, marginBottom: 20 }}
               onSearch={onSearch}
             />
              </Col>

              <Col span={24}>
              <div>
              <Table
                size="small"
                rowSelection={rowSelection}
                bordered
                columns={columnsSupply}
                dataSource={supplierPriorityList}
                // loading={loading}
                pagination={paginationSupplyStore}
                onChange={onPageChange}
                rowKey={record => record.id}
              />
              </div>
              </Col>
            </Col>
            <Col span={12}>
            {supplyId && <Col span={24}>
              <Col span={12}>
                <Button type="primary" onClick={() => onPriorityAChange('A')}>一键设置A级</Button>
              </Col>
              <Button type="primary" onClick={() => onPriorityAChange('B')}>一键设置B级</Button>
              <Col span={12}>
              </Col>
            </Col>}

              <Col span={24}>
                <br />
                <div>
                  <Table
                    size="small"
                    rowSelection={rowGoodsSelection}
                    bordered
                    columns={columnsGoods}
                    dataSource={findGoodsBySupplierList}
                    // loading={loading}
                    pagination={paginationBySupplier}
                    onChange={onPageBySupplierChange}
                    rowKey={record => record.id}
                  />
                </div>
              </Col>
            </Col>
          </Row>}
        </div>
    </Modal>
  );
};

modal.propTypes = {
  visible: PropTypes.bool,
  onCancel: PropTypes.func,
  okHideModalExplore: PropTypes.func,
  onPageChange: PropTypes.func,
  onSelectMenu: PropTypes.func,
  goodsModalExport: PropTypes.func,
  onCheck: PropTypes.func,
  onSearch: PropTypes.func,
  dataSource: PropTypes.object,
  dataTree: PropTypes.object,
  loading: PropTypes.bool,
  paginationGoods: PropTypes.object,
}

export default Form.create()(modal)
