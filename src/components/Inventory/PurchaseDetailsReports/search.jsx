import React, { PropTypes } from 'react';
import { Breadcrumb, Form, Select, Button, Input, DatePicker } from 'antd';
import moment from 'moment';
import INVENTORY_PERMISSION from '../../common/Permission/inventoryPermission';
import Permission from '../../common/Permission/Permission.jsx';

const Option = Select.Option;

const RequisitionSearch = ({
                             // model state
                             originId,               // 机构Id
                             changeOrigin,           // 机构更改
                             originList,             // 机构列表
                             weatherList,            // 门店列表
                             filterDataRange,        // 更改时间
                             storeName,              // 门店名称
                             goodsName,              // 物资名称
                             goodsList, // 物资列表
                             onGoodsIdSave, // 选择物品
                             onGoodsListQuery, // 搜索物品
                             busiName,               // 供应商名称
                             changeGoodsName,        // 修改商品编号
                             filterRequisition,      // 搜索
                             updateStoreName,        // 获取门店信息
                             exportRequisition,      // 导出表格
                             changeFilterDataRange,  // 时间更改
                             changeBusiName,         // 供应商搜索
                             supplierList,
                             form: {
                               getFieldDecorator,
                             },
                             // disabledDate, // 控制时间选择
                           }) => {
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
  const storeOptions = weatherList && weatherList.length && weatherList.map(store => <Select.Option value={store.id} key={store.id}>{store.name}</Select.Option>);
  const originOptions = originList.length && originList.map(origin => <Select.Option value={origin.id} key={origin.id}>{origin.name}</Select.Option>);
  // 获取供应商
  const supplierOptions = supplierList && supplierList.length && supplierList.map(store => <Select.Option value={store.id} key={store.id}>{store.suppName}</Select.Option>);
  return (
    <div className="components-search">
      <Breadcrumb separator=">">
        <Breadcrumb.Item>供应链</Breadcrumb.Item>
        <Breadcrumb.Item>集团总部管理</Breadcrumb.Item>
        <Breadcrumb.Item>采购明细报表</Breadcrumb.Item>
      </Breadcrumb>
      <div className="shop-select">
        <Form layout="inline" >
          <Form.Item label="机构名称">
            {getFieldDecorator('shopName', {
              initialValue: originId || '请选择机构名称',
            })(
              <Select
                style={{ width: 160 }}
                onChange={changeOrigin}
              >
                {originOptions}
              </Select>)}
          </Form.Item>
        </Form>
        {(originId || (originList.length === 1)) &&
          <Permission path={INVENTORY_PERMISSION.PURCHASE_DETAILS.EXPORT}>
            <div className="right-act"><Button type="primary" icon="plus" onClick={exportRequisition}>导出表格</Button></div>
          </Permission>}

      </div>

      {(originId || (originList.length === 1)) &&
      <Form layout="inline">
        <Form.Item label="门店名称">
          <Select style={{ width: 160 }} value={storeName || '请选择门店'} onChange={updateStoreName} placeholder="请选择门店">
            <Select.Option value="" key="">请选择门店</Select.Option>
            {storeOptions}
          </Select>
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
        <Form.Item label="供应商">
          <Select style={{ width: 160 }} value={busiName} onChange={changeBusiName} placeholder="请选择">
            <Select.Option value="" key="">请选择供应商</Select.Option>
            {supplierOptions}
          </Select>
        </Form.Item>
        <Form.Item label="请购日期">
          <DatePicker.RangePicker
            // disabledDate={disabledDate}
            format="YYYY-MM-DD"
            value={filterDataRange}
            allowClear={false}
            onChange={changeFilterDataRange}
            renderExtraFooter={() => <div style={{ textAlign: 'center', color: '#bfbfbf' }}>请点选两个时间以确定一个时间范围</div>}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={filterRequisition}>搜索</Button>
        </Form.Item>
      </Form>
      }

    </div>
  );
};
RequisitionSearch.PropTypes = {
  originList: PropTypes.array,
  weatherList: PropTypes.array,
  filterDataRange: PropTypes.string,
  goodsName: PropTypes.string,
  busiName: PropTypes.string,
  originId: PropTypes.string,
  changeOrigin: PropTypes.func,
  changeFilterDataRange: PropTypes.func,
  changeGoodsName: PropTypes.func,
  changebusiName: PropTypes.func,
  filterRequisition: PropTypes.func,
  updateStoreName: PropTypes.func,
};
export default Form.create()(RequisitionSearch);
