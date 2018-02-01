import React, { PropTypes } from 'react';
import { Breadcrumb, Form, Select, Button, Spin, Radio, DatePicker, Input } from 'antd';
import moment from 'moment';

const RequisitionSearch = ({
  // model state
  storeId,
  distribId,
  depotId,
  changeStore,
  selectStore,
  storeList,
  orderStatusList, // 订单状态
  wareHouseList,
  depotDispatchList,
  onCreate,
  form: {
    getFieldDecorator,
    validateFields,
  },
  filterStatus,
  filterDataRange,  // 采购日期
  filterBillNo, // 配送订单号
  initialOrgName, // 若可选机构只有一个时的默认值

  // module Func
  changeFilterDataRange,
  searchAgency, // 收货机构
  updateStore,
  onlyOneStore,
  changeFilterBillNo, // 填写配送订单号搜索
  enterFilterBillNo, // 配送订单号回车调用搜索方法
  filterDispatchOrders, // 搜索按钮
  changeWareHouse, // 选择仓库
  selectWareHouse, // 选择仓库
  changeFilterStatus, // 改变状态搜索
  // private Func

  // private methods
  disabledDate,
}) => {
  changeStore = (value) => {
    selectStore(value);
  };
  changeWareHouse = (value) => { selectWareHouse(value); };
  disabledDate = (current) => {
    return (moment(current).isAfter(moment().valueOf()));
  };
  // const orderStatusOptions = orderStatusList && orderStatusList.map(store => {
  //   return <Select.Option value={''+store.dictCode} key={store.dictCode}>{store.dictName}</Select.Option>;})
  const diapatchCenters = storeList && storeList.map(store => <Select.Option value={store.id} key={store.id}>{store.name}</Select.Option>);
  const wareHouseOptions = wareHouseList && wareHouseList.map(store => <Select.Option value={store.id} key={store.id}>{store.depotName}</Select.Option>)
  const storeOptions = depotDispatchList.length && depotDispatchList.map(store => <Select.Option value={store.id} key={store.id}>{store.name}</Select.Option>);
  return (
    <div className="components-search">
      <Breadcrumb separator=">">
        <Breadcrumb.Item>供应链</Breadcrumb.Item>
        <Breadcrumb.Item>集团总部管理</Breadcrumb.Item>
        <Breadcrumb.Item>配送订单</Breadcrumb.Item>
      </Breadcrumb>
      <div className="shop-select">
        <Form layout="inline" >
          <Form.Item label="配送机构">
            {getFieldDecorator('distribName', {
              initialValue: storeList.length === 1 ? initialOrgName : distribId || '请选择机构名称',
            })(
              <Select
                style={{ width: 160 }}
                onChange={changeStore}
              >
                {diapatchCenters}
              </Select>
            )}
          </Form.Item>
        </Form>
      </div>
      <Form layout="inline" style={!distribId ? { display: 'none' } : {}}>
        <Form.Item label="收货机构">
          {getFieldDecorator('storeId', { initialValue: storeId || '请选择' })(
            <Select style={{ width: 160 }} setFieldsValue={storeId} onChange={updateStore}>
              {storeOptions}
            </Select>
          )}
        </Form.Item>
        <Form.Item label="创建日期">
          <DatePicker.RangePicker
            allowClear={false}
            value={filterDataRange}
            disabledDate={disabledDate}
            onChange={changeFilterDataRange}
            renderExtraFooter={() => <div style={{ textAlign: 'center', color: '#bfbfbf' }}>请点选两个时间以确定一个时间范围</div>}
            ranges={{
              '前1月': [moment().subtract(1, 'month'), moment()],
              '前15天': [moment().subtract(15, 'day'), moment()],
              '前7天': [moment().subtract(7, 'day'), moment()],
              '前3天': [moment().subtract(3, 'day'), moment()],
              '今天': [moment(), moment()],
            }}
          />
        </Form.Item>
        <Form.Item label="出库仓库">
          {getFieldDecorator('depotId', { initialValue: '请选择' })(
            <Select style={{ width: 160 }} setFieldsValue={depotId} onChange={changeWareHouse}>
              {wareHouseOptions}
            </Select>
          )}
        </Form.Item>
        <Form.Item label="配送订单号">
          <Input placeholder="请输入配送订单号" value={filterBillNo} onChange={changeFilterBillNo} onPressEnter={enterFilterBillNo} />
        </Form.Item>
        <Form.Item label="订单状态">
          <Radio.Group value={filterStatus} onChange={changeFilterStatus}>
            <Radio.Button value="964" style={{ width: 75 }}>待处理</Radio.Button>
            <Radio.Button value="968" style={{ width: 75 }}>待出库</Radio.Button>
            <Radio.Button value="969" style={{ width: 85 }}>部分出库</Radio.Button>
            <Radio.Button value="970" style={{ width: 75 }}>已出库</Radio.Button>
            <Radio.Button value="966" style={{ width: 75 }}>已关闭</Radio.Button>
            <Radio.Button value="" style={{ width: 70 }}>全部</Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item>
          <Button type="primary" style={{ marginLeft: 38 }} onClick={filterDispatchOrders}>查询</Button>
        </Form.Item>
      </Form>
    </div>
  );
};
RequisitionSearch.PropTypes = {
  storeId: PropTypes.string,
  filterBillNo: PropTypes.string,
  changeStore: PropTypes.func,
  selectStore: PropTypes.func,
  changeWareHouse: PropTypes.func,
  selectWareHouse: PropTypes.func,
  changeFilterStatus: PropTypes.func,
  filterDataRange: PropTypes.array,
  changeFilterDataRange: PropTypes.func,
  changeFilterBillNo: PropTypes.func,
  enterFilterBillNo: PropTypes.func,
  filterDispatchOrders: PropTypes.func,
};
// export default RequisitionSearch;
export default Form.create()(RequisitionSearch);
