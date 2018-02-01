import React, { PropTypes } from 'react'
import { Form, Input, Modal, Row, Col, Tree, Card, Table, message } from 'antd'
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
  form: {
    validateFields,
  },
}) => {
  function handleOk() {
      okHideModal();
  }
  const modalOpts = {
    width: 800,
    title: '请选择数据',
    visible,
    onOk: handleOk,
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
    }
  ]
  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      // goodsChoose = selectedRows[0];
      goodsModalExport(selectedRowKeys,selectedRows);
    },
    onSelect: (record, selected, selectedRows) => {
     // console.log(record, selected, selectedRows);
    },
    onSelectAll: (selected, selectedRows, changeRows) => {
      // console.log(selected, selectedRows, changeRows);
    },
    getCheckboxProps: record => ({
      // disabled: record.name === 'Disabled User',    // Column configuration not to be checked
    }),
    //selectedRowKeys : [queryRowId]
  };
  const loop = data => (data ? data : []).map((item) => {
    if (item.children && item.children.length) {
      return <TreeNode key={item.id} title={item.name}>{loop(item.children)}</TreeNode>;
    }
    return <TreeNode key={item.id} title={item.name} />;
  });
  return (
    <Modal {...modalOpts}>
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
          <div>
            <Table size="small"
                   className="table"
                   rowSelection={rowSelection}
                   bordered
                   type = "radio"
                   columns={columns}
                   dataSource={scmInGoodsList}
                   //loading={loading}
                   pagination = {paginationGoods}
                   onChange={onPageChange}
                   rowKey={record => record.id}
            />
          </div>
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
