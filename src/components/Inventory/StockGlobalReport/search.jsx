import React, { PropTypes } from 'react';
import { Breadcrumb, Form, Select, Button, TreeSelect, Input } from 'antd';
const TreeNode = TreeSelect.TreeNode;

const RequisitionSearch = ({
  menuData,
  // model state
  storeId,
  changeStore,
  selectStore,
  storeList,
  depotCannList, // 出入库
  searchMenu,
  form: {
    getFieldDecorator,
    validateFields,
  },
  goodsName,  // 物资名称
  depotId, // 仓库ID
  inNewDepotId, // 调入仓库ID
  searchTree, // 调入仓库ID
  cateId,

  // 模型方法
  exportRequisition, //
  changeGoodsName, // 修改编号
  onTreeChange, // 修改分类
  filterRequisition,
  upadateDepotId, // 出库
  upadateInDepot, // 入库

  // 私有方法

  // 私有变量
  pageData,
}) => {
  changeStore = (value) => {
    selectStore(value);
  };
  const loop = data => data.map((item) => {
    if (item.children && item.children.length) {
      return <TreeNode key={item.id} value={item.id} title={item.name}>{loop(item.children)}</TreeNode>;
    }
    return <TreeNode key={item.id} value={item.id} title={item.name} />;
  });

  const storeOptions = storeList.length && storeList.map(store => <Select.Option value={store.id} key={store.id}>{store.name}</Select.Option>);
  const depotListAll = depotCannList.length && depotCannList.map(store => <Select.Option value={store.id} key={store.id}>{store.depotName}</Select.Option>);
  return (
    <div className="components-search">
      <Breadcrumb separator=">">
        <Breadcrumb.Item>供应链</Breadcrumb.Item>
        <Breadcrumb.Item>集团总部管理</Breadcrumb.Item>
        <Breadcrumb.Item>库存报表</Breadcrumb.Item>
      </Breadcrumb>
      <div className="shop-select">
        <Form layout="inline" >
          <Form.Item label="机构名称">
            {getFieldDecorator('shopName', {
              initialValue: storeId || '请选择机构名称',
            })(
              <Select
                style={{ width: 160 }}
                onChange={changeStore}
              >
                {storeOptions}
              </Select>)}
          </Form.Item>
        </Form>
        {storeId && menuData['list'].hasOwnProperty('61500801') && <div className="right-act"><Button type="primary" icon="plus" onClick={exportRequisition}>导出表格</Button></div>}

      </div>
      <Form layout="inline" style={!storeId ? { display: 'none'} : {}}>
        <Form.Item label="物资名称">
          <Input style={{ width: 160 }} value={goodsName} onChange={changeGoodsName} placeholder="请输入编码或名称"/>
        </Form.Item>
        <Form.Item label="仓库">
          <Select style={{ width: 160 }} value={depotId} onChange={upadateDepotId} placeholder="请选择类型">
            <Select.Option value="" key="">请选择</Select.Option>
            {depotListAll}
          </Select>
        </Form.Item>
        <Form.Item label="类别："  fieldNames="goodsCategory">
          <TreeSelect
            style={{ width: 160 }}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto'}}
            allowClear
            showCheckedStrategy = {TreeSelect.SHOW_ALL}
            placeholder="请选择类别"
            treeDefaultExpandAll
            onChange={onTreeChange}
          >
            {loop(searchTree)}
          </TreeSelect>
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={filterRequisition}>搜索</Button>

        </Form.Item>
      </Form>
    </div>
  );
};
RequisitionSearch.PropTypes = {
  filterOpterName: PropTypes.string,
  goodsName: PropTypes.string,
  storeId: PropTypes.string,
  changeStore: PropTypes.func,
  onTreeChange: PropTypes.func,
  selectStore: PropTypes.func,
  changeFilterOpterName: PropTypes.func,
  changeGoodsName: PropTypes.func,
  filterRequisition: PropTypes.func,
};
// export default RequisitionSearch;
export default Form.create()(RequisitionSearch);
