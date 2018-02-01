import { Breadcrumb, Form, Select, Button, TreeSelect, DatePicker, Input } from 'antd';
import React from 'react';

const TreeNode = TreeSelect.TreeNode;

const InOutDetailSearch = ({
  storeId,
  storeList,
  filterDataRange,  // 采购日期
  goodsName,
  depotId,
  depotCannList, // 出入库
  supplierList, // 供应商
  searchTree,
  typeList, // 类型
  supplierName,
  typeName,
  form: {
    getFieldDecorator,
  },
// 方法
  changeStore, // 改变
  selectStore,
  changeFilterDataRange,
  filterRequisition, // 搜索
  changeGoodsName,
  upadateDepotId, // 更新仓库
  upadateType, // 更新 单据类型
  upadateSupplier, // 更新供应商
  exportRequisition, // 导出表格
  onTreeChange,
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
  // 获取门店下拉菜单的值
  const storeOptions = storeList.length && storeList.map(store => <Select.Option value={store.id} key={store.id}>{store.name}</Select.Option>);
  // 获取供应商
  const supplierOptions = supplierList.length && supplierList.map(store => <Select.Option value={store.id} key={store.id}>{store.suppName}</Select.Option>);
  // 获取仓库
  const depotListAll = depotCannList.length && depotCannList.map(store => <Select.Option value={store.id} key={store.id}>{store.depotName}</Select.Option>);
 // 获取业务类型
  const TypeOptions = typeList.length && typeList.map(store => <Select.Option value={store.id} key={store.id}>{store.dictName}</Select.Option>);
  return (
    <div className="components-search">
      <Breadcrumb separator=">">
        <Breadcrumb.Item>供应链</Breadcrumb.Item>
        <Breadcrumb.Item>集团总部管理</Breadcrumb.Item>
        <Breadcrumb.Item>进销存明细</Breadcrumb.Item>
      </Breadcrumb>
      <div className="shop-select">
        <Form layout="inline" >
          <Form.Item label="机构名称">
            {getFieldDecorator('shopName', {
              initialValue: storeId || '请选择机构名称',
            })(
              <Select
                style={{ width: 160 }}
                onChange={changeStore} >
                {storeOptions}
              </Select>)}
          </Form.Item>
        </Form>
        {storeId && <div className="right-act"><Button type="primary" icon="plus" onClick={exportRequisition}>导出表格</Button></div>}
      </div>

      <Form layout="inline" style={!storeId ? { display: 'none'} : {}}>
        <Form.Item label="物品名称">
          <Input style={{ width: 160 }} value={goodsName} onChange={changeGoodsName} placeholder="请输入编码或名称" />
        </Form.Item>
        <Form.Item label="日期">
          <DatePicker.RangePicker
            format="YYYY-MM-DD"
            value={filterDataRange}
            allowClear={false}
            onChange={changeFilterDataRange}
          />
        </Form.Item>
        <Form.Item label="仓库">
          <Select style={{ width: 160 }} value={depotId} onChange={upadateDepotId} placeholder="请选择类型">
            <Select.Option value="" key="">请选择</Select.Option>
            {depotListAll}
          </Select>
        </Form.Item>
        <Form.Item label="业务类型">
          <Select style={{ width: 160 }} value={typeName} onChange={upadateType} placeholder="请选择">
            <Select.Option value="" key="">请选择</Select.Option>
            {TypeOptions}
          </Select>
        </Form.Item>
        <Form.Item label="类别：" fieldNames="goodsCategory">
          <TreeSelect
            style={{ width: 160 }}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto'}}
            showCheckedStrategy = {TreeSelect.SHOW_ALL}
            placeholder="请选择类别"
            allowClear
            treeDefaultExpandAll
            onChange={onTreeChange}>
              {loop(searchTree)}
          </TreeSelect>
        </Form.Item>
        <Form.Item label="供应商">
          <Select style={{ width: 160 }} value={supplierName} onChange={upadateSupplier} placeholder="请选择">
            <Select.Option value="" key="">请选择</Select.Option>
            {supplierOptions}
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" onClick={filterRequisition}>搜索</Button>
        </Form.Item>
      </Form>
    </div>
  );
};
InOutDetailSearch.PropTypes = {

};
export default Form.create()(InOutDetailSearch);
