import React, { PropTypes } from 'react';
import { Form, Button, Popconfirm, Spin, Breadcrumb, Select, Row, Col } from 'antd';
import INVENTORY_PERMISSION from '../../common/Permission/inventoryPermission';
import Permission from '../../common/Permission/Permission.jsx';

const FormItem = Form.Item;
const ButtonGroup = Button.Group;
const Option = Select.Option;
const search = ({
onAdd,
setPriority,
fetching,
fetchingGoods,
changeGoods,
changeShop,
fetchShop,
fetchGoods,
storeIdList,
fetchingStores,
fetchStores,
changeStores,
goodsList,
onSearch,
handleSubmit,
supplierList,
orgInfoId,
changeStore,
orgInfoIdList,
onDelete,
depotRowConcatList,
changeOrgInfoId,
form: {
  getFieldDecorator,
  validateFields,
  getFieldsValue,
},
}) => {
  handleSubmit = (e) => {
    e.preventDefault();
    validateFields((errors) => {
      if (errors) {
        return;
      }
      const param = getFieldsValue();
      onSearch(param);
    });
  };
  // <Row gutter={12}>
  //   <Col className="gutter-row" span={4}>
  //     <Button type="primary" onClick={onDelete}>批量删除</Button>
  //   </Col>
  //   <Col className="gutter-row" span={4}>
  //     <Button type="primary" onClick={onDelete}>批量删除</Button>
  //   </Col>
  //   <Col className="gutter-row" span={4}>
  //     <Button type="primary" icon="plus" onClick={onAdd}>新增供货关系</Button>
  //   </Col>
  //
  // </Row>
// console.log("orgInfoIdList物流中心",orgInfoIdList);
  const formItemLayoutNew = {
    labelCol: { span: 2 },
    wrapperCol: { span: 12 },
  };
  const storeOptions = orgInfoIdList && orgInfoIdList.map(store => <Option value={store.id} key={store.id}>{store.name}</Option>);
  // 名称数组数组
  const storeIdAllList = [];
  storeIdList && storeIdList.map(store => storeIdAllList.push(<Option title={store.name} value={store.id} key={store.id} >{store.name}</Option>));
  // 供应商名称数组
  const supplierAllList = [];
  supplierList && supplierList.map(store => supplierAllList.push(<Option title={store.depotName} value={store.id} key={store.id} >{store.depotName}</Option>));
  // console.log("supplierAllList",supplierAllList);
  // 物资名称数组
  const goodsListAll = [];
  goodsList && goodsList.map(store => goodsListAll.push(<Option title={store.goodsName} value={store.id} key={store.id}>{store.goodsName}</Option>));
  // console.log("goodsListAll",goodsListAll);
  return (
    <div>
      <div className="components-search">
        <Breadcrumb separator=">">
          <Breadcrumb.Item>供应链</Breadcrumb.Item>
          <Breadcrumb.Item>基本设置</Breadcrumb.Item>
          <Breadcrumb.Item>仓库配送关系设置</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <Form >
        <FormItem {...formItemLayoutNew} label="机构名称">
          {getFieldDecorator('orgInfoId', {
            initialValue: orgInfoId || '请选择机构名称',
          })(
            <Select
              style={{ width: 160 }}
              onChange={changeOrgInfoId}
            >
              {storeOptions}
            </Select>,
          )}
        </FormItem>
      </Form>
      {orgInfoId && <Form layout="horizontal" onSubmit={handleSubmit}>
        <FormItem {...formItemLayoutNew} label="仓库名称">
          {getFieldDecorator('depotIdList', {
            initialValue: [],
          })(
            <Select
              mode="multiple"
              filterOption={false}
              notFoundContent={fetching ? <Spin size="small" /> : <span>暂无数据</span>}
              onChange={changeShop}
              onSearch={fetchShop}
            >
              {supplierAllList}
            </Select>)}
        </FormItem>
        <FormItem {...formItemLayoutNew} label="门店名称">
          {getFieldDecorator('storeIdList', {
            initialValue: [],
          })(
            <Select
              notFoundContent={fetchingStores ? <Spin size="small" /> : <span>暂无数据</span>}
              mode="multiple"
              filterOption={false}
              onSearch={fetchStores}
              onChange={changeStores}
            >
              {storeIdAllList}
            </Select>)}
        </FormItem>
        <FormItem {...formItemLayoutNew} label="物品名称">
          {getFieldDecorator('goodIdList', {
            initialValue: [],
          })(
            <Select
              notFoundContent={fetchingGoods ? <Spin size="small" /> : <span>暂无数据</span>}
              mode="multiple"
              filterOption={false}
              onSearch={fetchGoods}
              onChange={changeGoods}
            >
              {goodsListAll}
            </Select>)}
        </FormItem>
        <FormItem >
          <Button type="primary" htmlType="submit" style={{ marginLeft: 60 }} size="default">搜索</Button>

          <Permission path={INVENTORY_PERMISSION.DEPOT_RELATION.BATCH_DELETE}>
            <Popconfirm title="此操作会取消当前所选仓库与物资的配送关系，若需建立可以再次添加，确认执行此操作吗？" onConfirm={onDelete}>
              <Button type="primary" style={{ marginLeft: 60 }} disabled={!depotRowConcatList.length} >批量删除</Button>
            </Popconfirm>
          </Permission>

          <Permission path={INVENTORY_PERMISSION.DEPOT_RELATION.CREATE}>
            <Button type="primary" style={{ marginLeft: 60 }} icon="plus" onClick={onAdd} size="default">新增配送关系</Button>
          </Permission>
        </FormItem>
      </Form>}
    </div>
  );
};
search.propTypes = {
  onAdd: PropTypes.func,
  setPriority: PropTypes.func,
  onExproct: PropTypes.func,
  changeShop: PropTypes.func,
  changeGoods: PropTypes.func,
  selectGoods: PropTypes.func,
  selectFetchShop: PropTypes.func,
  selectFetchGoods: PropTypes.func,
  onSearch: PropTypes.func,
  handleSubmit: PropTypes.func,
  selectShop: PropTypes.func,
  storeList: PropTypes.object,
};
export default Form.create()(search);
