import React, { PropTypes } from 'react'
import { Form, Input, Modal, Row, Col, Tree, Card, Table, message } from 'antd'
import { trimParam } from '../../../utils'
const FormItem = Form.Item
const TreeNode = Tree.TreeNode;

message.config({
  top: 300,
  duration: 2,
});

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
}

const modal = ({
  loading,
  visible,
  onOk,
  onCancel,
  title,
  dataTree,
  onSelectMenu,
  onCheck,
  dataSource,
  onPageChange,
  goodsChoose,
  paginationGoods,
  form: {
    validateFields,
    },
  }) => {
  function handleOk() {
    validateFields((errors) => {
      if (errors) {
        return
      }

      if (!goodsChoose) {
        message.error("没有选择任何物资！");
        return;
      }
      const goodsSearch = {
        selectedRowKeys: goodsChoose.id,
        goodsCode: goodsChoose.goodsCode,
      };
      trimParam(goodsSearch);
      onOk(goodsSearch)
    })
  }

  const modalOpts = {
    width: 800,
    title: title,
    visible,
    onOk: handleOk,
    onCancel,
    wrapClassName: 'vertical-center-modal',
    confirmLoading: loading,
  }
  let rowSelectId = "";
  onCheck = (checkedKeys, info) => {
    // console.log('onCheck', checkedKeys, info);
  }
  const loop = data => data && data.map((item) => {
    if (item.children && item.children.length) {
      return <TreeNode key={item.id} title={item.name}>{loop(item.children)}</TreeNode>;
    }
    return <TreeNode key={item.id} title={item.name}/>;
  });


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
  // rowSelection object indicates the need for row selection

  const rowSelection = {
    type: "radio",
    onChange: (selectedRowKeys, selectedRows) => {
      goodsChoose = selectedRows[0];
    },
    onSelect: (record, selected, selectedRows) => {
      // console.log(record, selected, selectedRows);
    },
    onSelectAll: (selected, selectedRows, changeRows) => {
      // console.log(selected, selectedRows, changeRows);
    },
    getCheckboxProps: record => ({
      disabled: record.name === 'Disabled User',    // Column configuration not to be checked
    }),
    //selectedRowKeys : [queryRowId]
  };

  return (
    <Modal {...modalOpts}>
      <div className="components-modal">
        <Row gutter={16}>
          <Col span={6}>
            <Card title="物资类别">
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
                     type="radio"
                     columns={columns}
                     dataSource={dataSource}
                //loading={loading}
                     pagination={paginationGoods}
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
  form: PropTypes.object,
  item: PropTypes.object,
  goodsChoose: PropTypes.object,
  dataSource: PropTypes.array,
  title: PropTypes.string,
  dataTree: PropTypes.array,
  onOk: PropTypes.func,
  onCancel: PropTypes.func,
  onSelectMenu: PropTypes.func,
  onCheck: PropTypes.func,
  onPageChange: PropTypes.func,
  loading: PropTypes.bool,
  paginationGoods: PropTypes.object,
}

export default Form.create()(modal)
