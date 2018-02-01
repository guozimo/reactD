import React, { PropTypes } from 'react';
import { Form, Button, Spin, Breadcrumb, Popconfirm, Select, Row, Col } from 'antd';
const FormItem = Form.Item;
const ButtonGroup = Button.Group;
const Option = Select.Option;
const search = ({
menuData,
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
supplyListRowConcatList,
onDelete,
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

  const formItemLayoutNew = {
    labelCol: { span: 2 },
    wrapperCol: { span: 12 },
  };
  // 名称数组数组
  const storeIdAllList = [];
  storeIdList && storeIdList.map(store => storeIdAllList.push(<Option title={store.name} value={store.id} key={store.id} >{store.name}</Option>));
  // 供应商名称数组
  const supplierAllList = [];
  supplierList && supplierList.map(store => supplierAllList.push(<Option title={store.suppName} value={store.id} key={store.id} >{store.suppName}</Option>));
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
          <Breadcrumb.Item>供货关系设置</Breadcrumb.Item>
        </Breadcrumb>
        <Row gutter={12}>
          {  menuData['list'].hasOwnProperty('61100201') &&  <Col className="gutter-row" span={4}>
            <Button type="primary" icon="plus" onClick={onAdd}>新增供货关系</Button>
          </Col>}
          {  menuData['list'].hasOwnProperty('61100202') && <Col className="gutter-row" span={4}>
            <Button type="primary" icon="plus" onClick={setPriority}>设置优先级</Button>
          </Col>}

        </Row>
        <br />
      </div>
      <Form layout="horizontal" onSubmit={handleSubmit}>
        <FormItem {...formItemLayoutNew} label="供应商名称">
          {getFieldDecorator('supplyList', {
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
        <FormItem {...formItemLayoutNew} label="物资名称">
          {getFieldDecorator('goodsList', {
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
        <FormItem {...formItemLayoutNew} label="门店">
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
        <Button type="primary" style={{ marginLeft: 60 }}  htmlType="submit">搜索</Button>
        <Popconfirm title="此操作会取消当前所选仓库与物资的供应关系，若需建立可以再次添加，确认执行此操作吗？" onConfirm={onDelete}>
          <Button type="primary" style={{ marginLeft: 60 }} disabled={!supplyListRowConcatList.length} >批量删除</Button>
        </Popconfirm>
      </Form>
      <br />

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
