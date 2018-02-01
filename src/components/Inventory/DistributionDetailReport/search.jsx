import React, { PropTypes } from 'react';
import { Breadcrumb, Form, Select, Button, TreeSelect, Input, DatePicker } from 'antd';
import moment from 'moment';
import INVENTORY_PERMISSION from '../../common/Permission/inventoryPermission';
import Permission from '../../common/Permission/Permission.jsx';

const TreeNode = TreeSelect.TreeNode;
const Option = Select.Option;
const RequisitionSearch = ({
                             storeId, // 机构id
                             selectStore,
                             selectShop,
                             depotName,
                             storeList,
                             storeName,
                             name,
                             form: {
                               getFieldDecorator,
                             },
                             goodsName,  // 物资名称
                             goodsList, // 物资列表
                             onGoodsIdSave, // 选择物品
                             onGoodsListQuery, // 搜索物品
                             bussDate,
                             changeBussDate,
                             exportRequisition,
                             changeGoodsName, // 修改编号
                             filterRequisition,
                             weatherList,
                             depotListAll,
                             changeDepotId,
                             // disabledDate, // 控制时间选择
                           }) => {
  // 控制时间选择
  // disabledDate = (current) => {
  //   return (moment(current).isAfter(moment().valueOf()));
  // };
  // 选择物品
  const handleGoodsListChange = (value) => {
    // onGoodsListQuery(value);
    onGoodsIdSave(value);
  };
  // 物资列表
  const goodsListOptions = goodsList.map(item => <Option value={item.goodsName} key={item.id} title={item.id}>{item.goodsName}</Option>);
  const loop = data => data.map((item) => {
    if (item.children && item.children.length) {
      return <TreeNode key={item.id} value={item.id} title={item.name}>{loop(item.children)}</TreeNode>;
    }
    return <TreeNode key={item.id} value={item.id} title={item.name} />;
  });

  const storeOptions = storeList.length && storeList.map(store => <Select.Option value={store.id} key={store.id}>{store.name}</Select.Option>);
  const shopOptions = weatherList.length && weatherList.map(store => <Select.Option value={store.id} key={store.id}>{store.name}</Select.Option>);
  const depotOptions = depotListAll.length && depotListAll.map(store => <Select.Option value={store.id} key={store.id}>{store.depotName}</Select.Option>);
  return (
    <div className="components-search">
      <Breadcrumb separator=">">
        <Breadcrumb.Item>供应链</Breadcrumb.Item>
        <Breadcrumb.Item>集团总部管理</Breadcrumb.Item>
        <Breadcrumb.Item>配送明细报表</Breadcrumb.Item>
      </Breadcrumb>
      <div className="shop-select">
        <Form layout="inline" >
          <Form.Item label="机构名称">
            {getFieldDecorator('shopName', {
              initialValue: storeId || '请选择机构名称',
            })(
              <Select
                style={{ width: 160 }}
                onChange={selectStore}
              >
                {storeOptions}
              </Select>)}
          </Form.Item>
        </Form>
        {(storeId || (storeList.length === 1)) && <Permission path={INVENTORY_PERMISSION.DISTRIBUTION_DETAILS.EXPORT}>
          <div className="right-act"><Button type="primary" icon="plus" onClick={exportRequisition}>导出表格</Button></div>
          </Permission>}
      </div>
      {(storeId || (storeList.length === 1)) &&
      <Form layout="inline" >
        <Form.Item label="门店名称">
          {getFieldDecorator('storeName', {
            initialValue: storeName || '请选择门店',
          })(
            <Select style={{ width: 160 }} onChange={selectShop} placeholder="请选择门店">
              <Select.Option value="" key="">请选择门店</Select.Option>
              {shopOptions}
            </Select>)}
        </Form.Item>
        <Form.Item label="物品名称">
          {getFieldDecorator('goodsId', {
          })(
            <Select
              placeholder="请选择物品"
              showSearch
              value={goodsName}
              allowClear
              filterOption={false}
              style={{ width: 160 }}
              onChange={handleGoodsListChange}
              onSearch={value => onGoodsListQuery(value)}
            >
              {goodsListOptions}
            </Select>,
          )}
          {/* <Input style={{ width: 160 }} value={goodsName} onChange={changeGoodsName} onPressEnter={filterRequisition} placeholder="请输入编码或名称" /> */}
        </Form.Item>
        <Form.Item label="仓库">
          {getFieldDecorator('depotName', {
            initialValue: depotName || '请选择仓库',
          })(
            <Select style={{ width: 160 }} onChange={changeDepotId} placeholder="请选择仓库">
              <Select.Option value="" key="">请选择仓库</Select.Option>
              {depotOptions}
            </Select>)}
          {/* <Select style={{ width: 160 }} setFieldsValue={depotName} onChange={changeDepotId}>
            <Select.Option value="" key="">请选择仓库</Select.Option>
            {depotOptions}
          </Select> */}
        </Form.Item>
        <Form.Item label="请购日期">
          <DatePicker.RangePicker
            // disabledDate={disabledDate}
            format="YYYY-MM-DD"
            value={bussDate}
            onChange={changeBussDate}
            renderExtraFooter={() => <div style={{ textAlign: 'center', color: '#bfbfbf' }}>请点选两个时间以确定一个时间范围</div>}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={filterRequisition}>搜索</Button>
        </Form.Item>
      </Form>}
    </div>
  );
};
RequisitionSearch.PropTypes = {
  filterOpterName: PropTypes.string,
  goodsName: PropTypes.string,
  storeId: PropTypes.string,
  onTreeChange: PropTypes.func,
  selectStore: PropTypes.func,
  selectShop: PropTypes.func,
  changeFilterOpterName: PropTypes.func,
  changeGoodsName: PropTypes.func,
  changeDepotName: PropTypes.func,
  filterRequisition: PropTypes.func,
  changeBussDate: PropTypes.func,
  bussDate: PropTypes.array,
  changeDepotId: PropTypes.func,
};
export default Form.create()(RequisitionSearch);
