import React, { PropTypes } from 'react'
import { Form, Input, Modal, Row, Col, Tree, Card, Table } from 'antd'
const FormItem = Form.Item;
const Search = Input.Search;
const TreeNode = Tree.TreeNode;

const modal = ({
  loading,
  visible,
  onCancel,
  modalSelectValue,
  okHideModal,
  scmInGoodsList,
  dataTree,
  paginationGoods,
  onSelectMenu,
  onCheck,
  onPageChange,
  goodsModalList,
  goodsAddModalExport,
  selectedRowKeys,
  onModalSearch,
  removeGoodsModalExport,
  goodsModalExportAll,
  onModalChange,
  form: {
    validateFields,
  },
}) => {
  // console.log("scmInGoodsList",scmInGoodsList);
  function handleOk() {
    okHideModal();
  }
  // console.log("visible",visible);
  const modalOpts = {
    width: 1000,
    visible,
    onOk: handleOk,
    onCancel,
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
  const rowSelection = {
    selectedRowKeys: goodsModalList.length && goodsModalList.map(item => item.id),
    onChange: (selectedRowKeys, selectedRows) => {
      // goodsChoose = selectedRows[0];
      goodsAddModalExport(selectedRowKeys, selectedRows);
    },
    onSelect: (record, selected, selectedRows) => {
     // console.log(record, selected, selectedRows);
      removeGoodsModalExport(record, selected, selectedRows);
    },
    onSelectAll: (selected, selectedRows, changeRows) => {
      // console.log(selected, selectedRows, changeRows);
      goodsModalExportAll(selected, selectedRows, changeRows);
    },
    getCheckboxProps: record => ({
      // disabled: _.findIndex(storeGoodsGetAll, item => item.goodsCode === record.goodsCode) >= 0,    // Column configuration not to be checked
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
    <Modal  title={<div>
      <span>请选择物资</span>
      <span style={{ marginRight: 50, float: 'right' }}><Search
        placeholder="请填写物资名称或编码"
        style={{ width: 200, marginBottom: 20 }}
        value={modalSelectValue}
        onChange={onModalChange}
        onSearch={onModalSearch}
      /></span>
    </div>}  {...modalOpts}>
      <div className="components-modal">
        <Row gutter={16}>
          <Col span={6}>
            <Card title="物品类别" >
              <Tree
                defaultSelectedKeys={[]}
                onSelect={onSelectMenu}
                onCheck={onCheck}
              >
                {loop(dataTree)}
              </Tree>
            </Card>
          </Col>
          <Col span={18}>
            <div>
              <Col span={15}>
              </Col>
              <Col span={9}>
              </Col>
              <Table
                size="small"
                className="table"
                rowSelection={rowSelection}
                bordered
                columns={columns}
                dataSource={scmInGoodsList}
                loading={loading}
                pagination={paginationGoods}
                onChange={onPageChange}
                rowKey={record => record.id}
              />
            </div>
          </Col>
        </Row>
      </div>
    </Modal>
  );
};

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
