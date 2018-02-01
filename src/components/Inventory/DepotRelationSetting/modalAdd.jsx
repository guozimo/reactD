import React, { PropTypes } from 'react'
import { Form,Select,Button, Input, Modal, Row, Col, Tree, Card, Table, message } from 'antd'
const FormItem = Form.Item
const TreeNode = Tree.TreeNode;
const Option = Select.Option;

const modal = ({
  loading,
  supplierAloneList,
  onCancel,
  addVisible,
  okHideModalAdd,
  paginationGoods,
  onPageChange,
  upadateSupplier,
  onNewGoodsList,
  paginationGoodsModal,
  goodsRowConcat,
  aclStoreListAll,
  storeRowConcat,
  storeRowKeysModal,
  selectSupplier,
  depotId,
  removeGoodsExport, // 移除物资数据
  goodsExportAll, // 移除全部物资
  removeStoreExport, // 移除机构数据
  storeExportAll, // 移除全部机构
  storeGoodsGetAll,
  goodsRowConcatList,
  orgInfoName,
  verifyVisible, // 校验弹窗
  handleVerifyOk, // 校验弹窗确定
  onVerifyCancel, // 校验弹窗取消
  verifyModalList, // 校验弹窗数据
  paginationVerify, // 分页
  onVerifyPageChange, // 改变分页
  verifyRowConcat, // 选择的时候
  removeVerifyExport, // 单个删除的时候，
  verifyExportAll, // 全部删除的时候
  verifyRowConcatList, // 校验弹窗勾选的数据
  depotName,
  form: {
    validateFields,
  },
}) => {
  function handleOk() {
    okHideModalAdd();
  }
  // function selectSupplier(value, option) {
  //     // okHideModalAdd();
  //     console.log("------------------value",value,"option",option);
  // }
  // console.log("orgInfoName", orgInfoName);
  const modalOpts = {
    width: 800,
    title: `新增配送关系  ${orgInfoName}`,
    visible: addVisible,
    onOk: handleOk,
    onCancel,
    wrapClassName: 'vertical-center-modal',
    confirmLoading: loading,
  };
  const modalVerify = {
    width: 600,
    title: '已存在供应关系物资如下：',
    visible: verifyVisible,
    onOk: handleVerifyOk,
    onCancel: onVerifyCancel,
    wrapClassName: 'vertical-center-modal',
    confirmLoading: loading,
  };
  const columns = [
    {
      title: '物品编码',
      dataIndex: 'goodsCode',
      key: 'goodsCode',
    }, {
      title: '物品名称',
      dataIndex: 'goodsName',
      key: 'goodsName',
    },
  ];
  const columns2 = [
    {
      title: '机构编码',
      dataIndex: 'code',
      key: 'code',
    }, {
      title: '机构名称',
      dataIndex: 'name',
      key: 'name',
    },
  ];
  const verifyColumns = [
    {
      title: '机构编码',
      dataIndex: 'goodsCode',
      key: 'goodsCode',
    }, {
      title: '物品名称',
      dataIndex: 'goodsName',
      key: 'goodsName',
    }, {
      title: '原供货机构',
      dataIndex: 'sourceSupply',
      key: 'sourceSupply',
    }, {
      title: '原供货方式',
      dataIndex: 'goodDirection',
      key: 'goodDirection',
      render: text => text && text === 'DIRECT' ? '直运' : (text === 'DISPATCH' ? '配送' : '暂无'),
    }, {
      title: '门店名称',
      dataIndex: 'storeName',
      key: 'storeName',
    },
  ];
  // 物资编码勾选
  const rowGoodsSelection = {
    selectedRowKeys: goodsRowConcatList.length && goodsRowConcatList.map(item => item.id),
    onChange: (selectedRowKeys, selectedRows) => {
      // goodsChoose = selectedRows[0];
      goodsRowConcat(selectedRowKeys, selectedRows);
    },
    onSelect: (record, selected, selectedRows) => {
     // console.log(record, selected, selectedRows);
      removeGoodsExport(record, selected, selectedRows);
    },
    onSelectAll: (selected, selectedRows, changeRows) => {
      // console.log(selected, selectedRows, changeRows);
      goodsExportAll(selected, selectedRows, changeRows);
    },
    getCheckboxProps: record => ({
      // disabled: record.name === 'Disabled User',    // Column configuration not to be checked
    }),
    // selectedRowKeys : [queryRowId]
  };
  // 机构编码勾选
  const rowSelection = {
    selectedRowKeys: storeRowKeysModal,
    onChange: (selectedRowKeys, selectedRows) => {
      // goodsChoose = selectedRows[0];
      storeRowConcat(selectedRowKeys,selectedRows);
    },
    onSelect: (record, selected, selectedRows) => {
     // console.log(record, selected, selectedRows);
      removeStoreExport(record, selected, selectedRows);
    },
    onSelectAll: (selected, selectedRows, changeRows) => {
      // console.log(selected, selectedRows, changeRows);
      storeExportAll(selected, selectedRows, changeRows);
    },
    getCheckboxProps: record => ({
      // disabled: record.name === 'Disabled User',    // Column configuration not to be checked
    }),
    // selectedRowKeys : [queryRowId]
  };
  // 校验页面的分页
  const verifySelection = {
    selectedRowKeys: verifyRowConcatList.length && verifyRowConcatList.map(item => item.id),
    onChange: (selectedRowKeys, selectedRows) => {
      // goodsChoose = selectedRows[0];
      verifyRowConcat(selectedRowKeys, selectedRows);
    },
    onSelect: (record, selected, selectedRows) => {
     // console.log(record, selected, selectedRows);
      removeVerifyExport(record, selected, selectedRows);
    },
    onSelectAll: (selected, selectedRows, changeRows) => {
      // console.log(selected, selectedRows, changeRows);
      verifyExportAll(selected, selectedRows, changeRows);
    },
    getCheckboxProps: record => ({
      // disabled: record.name === 'Disabled User',    // Column configuration not to be checked
    }),
    // selectedRowKeys : [queryRowId]
  };
  // console.warn("depotId",depotId);
  const storeListAll = supplierAloneList && supplierAloneList.map(store => <Option value={store.id} key={store.id}>{store.depotName}</Option>);
  return (
    <div>
      <Modal {...modalOpts}>
        <div className="components-modal">
          <Row gutter={16}>
            <Col span={6} style={{ marginBottom: 20 }}>
              <Select style={{ width: 160 }} placeholder="请选择仓库" value={depotId} onSelect={selectSupplier} onChange={upadateSupplier}>
                <Option value="" key="">请选择仓库</Option>
                {storeListAll}
              </Select>
            </Col>
            {depotId && <Col span={18} style={{ marginBottom: 20 }}>
              <Button type="primary" icon="plus" onClick={onNewGoodsList}>添加物资编码</Button>
            </Col>}
            {depotId && <Col span={12}>
              <Table
                size="small"
                className="table"
                rowSelection={rowGoodsSelection}
                bordered
                columns={columns}
                dataSource={storeGoodsGetAll}
                loading={loading}
                pagination={paginationGoodsModal}
                onChange={onPageChange}
                rowKey={record => record.id}
              />
            </Col>}
            {depotId && <Col span={12}>
              <div>
                <Table
                  size="small"
                  className="table"
                  rowSelection={rowSelection}
                  bordered
                  columns={columns2}
                  dataSource={aclStoreListAll}
                  loading={loading}
                  pagination={paginationGoods}
                  onChange={onPageChange}
                  rowKey={record => record.id}
                />
              </div>
            </Col>}
          </Row>
        </div>
      </Modal>
      <Modal {...modalVerify}>
        <div>
          您勾选的所有物资将删除原供货机构，修改为由<span style={{color: 'red' }}>{orgInfoName}</span>物流中心，
          <span style={{color: 'red' }}>{depotName}</span>仓库供货
          <Table
            size="small"
            className="table"
            rowSelection={verifySelection}
            bordered
            columns={verifyColumns}
            dataSource={verifyModalList}
            // loading={loading}
            pagination={paginationVerify}
            onChange={onVerifyPageChange}
            rowKey={record => record.id}
          />
        </div>
      </Modal>
    </div>
  );
};

modal.propTypes = {
  visible: PropTypes.bool,
  onCancel: PropTypes.func,
  okHideModalAdd: PropTypes.func,
  onPageChange: PropTypes.func,
  onSelectMenu: PropTypes.func,
  goodsModalExport: PropTypes.func,
  onCheck: PropTypes.func,
  onNewGoodsList: PropTypes.func,
  goodsRowConcat: PropTypes.func,
  dataSource: PropTypes.object,
  dataTree: PropTypes.object,
  loading: PropTypes.bool,
  paginationGoods: PropTypes.object,
};

export default Form.create()(modal);
