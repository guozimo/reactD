import React, { PropTypes } from 'react'
import { Form, Input, Modal, Row, Col, Tree, Card, Table, message, Tooltip } from 'antd'
import _ from 'lodash';
const Search = Input.Search;
const FormItem = Form.Item
const TreeNode = Tree.TreeNode;

const modal = ({
  loading,
  visible,
  onCancel,
  okHideModal,
  scmInGoodsList,
  dataTree,
  paginationGoods,
  onSelectMenu,
  onCheck,
  onPageChange,
  goodsModalExport,
  selectedRowKeys,
  exportModalList,
  dataSource,
  onModalSearch,
  onModalChange,
  cateId,
  modalSelectValue,
  removeGoodsExport, // 移除物资数据
  storeExportAll, // 移除物资数据
  form: {
    validateFields,
  },
}) => {
  function handleOk() {
    okHideModal();
  }
  // console.log("visible",visible);
  const modalOpts = {
    width: 1000,
    visible,
    onOk: handleOk,
    okText: '选定',
    onCancel,
    wrapClassName: 'vertical-center-modal',
    confirmLoading: loading,
  }
  const columns = [
    {
      title: '物资编码',
      dataIndex: 'goodsCode',
      key: 'goodsCode',
    }, {
      title: '物资名称',
      dataIndex: 'goodsName',
      key: 'goodsName',
    }, {
      title: '规格型号',
      dataIndex: 'goodsSpec',
      key: 'goodsSpec',
    }, {
      title: '标准单位',
      dataIndex: 'unitName',
      key: 'unitName',
    }, {
      title: '辅助单位',
      dataIndex: 'dualUnitName',
      key: 'dualUnitName',
    }, {
      title: '订货单位',
      dataIndex: 'purcUnitName',
      key: 'purcUnitName',
    },
    {
      title: '标准数量',
      dataIndex: 'wareQty',
      key: 'wareQty',
    // }, {
    //   title: '类别',
    //   dataIndex: 'cateName',
    //   key: 'cateName',
    },
  ]
  // console.log("----------------dataSource",dataSource);
  const rowSelection = {
    selectedRowKeys: exportModalList.length && exportModalList.map(item => item.id),
    onChange: (selectedRowKeys, selectedRows) => {
      // goodsChoose = selectedRows[0];
      goodsModalExport(selectedRowKeys,selectedRows);
    },
    onSelect: (record, selected, selectedRows) => {
     // console.log(record, selected, selectedRows);
      removeGoodsExport(record, selected, selectedRows);
    },
    onSelectAll: (selected, selectedRows, changeRows) => {
      // console.log(selected, selectedRows, changeRows);
      storeExportAll(selected, selectedRows, changeRows);
    },
    getCheckboxProps: record => ({
      disabled: _.findIndex(dataSource, item => item.goodsCode === record.goodsCode) >= 0,    // Column configuration not to be checked
    }),
    //selectedRowKeys : [queryRowId]
  };
  const loop = data => data.map((item) => {
    if (item.children && item.children.length) {
      return <TreeNode key={item.id} title={item.name}>{loop(item.children)}</TreeNode>;
    }
    return <TreeNode key={item.id} title={item.name} />;
  });
  return (
    <Modal
      title={<div>
        <span>请选择物资</span>
        <span style={{ marginRight: 50, float: 'right' }}><Search
          placeholder="请填写物资名称或编码"
          style={{ width: 200 }}
          value={modalSelectValue}
          onChange={onModalChange}
          onSearch={onModalSearch}
        /></span>
      </div>}
      {...modalOpts}>
        <div className="components-modal">
      <Row gutter={16}>
        <Col span={6}>
          <Card title="物资类别" >
          <Tree
            onSelect={onSelectMenu}
            onCheck={onCheck}
          >
            {loop(dataTree)}
          </Tree>
          </Card>
        </Col>
        <Col span={18}>
          <Table
            size="small"
            className="table"
            rowSelection={rowSelection}
            bordered
            type="radio"
            columns={columns}
            dataSource={scmInGoodsList}
            pagination = {paginationGoods}
            onChange={onPageChange}
            rowKey={record => record.id}
          />
        </Col>
      </Row>
      </div>
    </Modal>
  )
}

modal.propTypes = {
  visible: PropTypes.bool,
  onCancel: PropTypes.func,
  okHideModal: PropTypes.func,
  onPageChange: PropTypes.func,
  onSelectMenu: PropTypes.func,
  goodsModalExport: PropTypes.func,
  onCheck: PropTypes.func,
  dataSource: PropTypes.object,
  dataTree: PropTypes.object,
  loading: PropTypes.bool,
  paginationGoods: PropTypes.object,
}

export default Form.create()(modal)
