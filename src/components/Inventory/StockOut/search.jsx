import React, { PropTypes } from 'react';
import { Breadcrumb, Form, Select, Button, Radio, DatePicker, Input } from 'antd';
import moment from 'moment';

const StockOutSearch = ({
  menuData,
  // model state
  storeId,
  changeStore,
  selectStore,
  angencyList,
  billType,
  depotId,
  // nowDate,
  // monthDate,
  // busiId,
  billTypeList,
  wareHouseList,
  initialOrgName, // 一个门店时默认选中的值
  // theSupplierList,
  form: {
    getFieldDecorator,
    validateFields,
  },
  filterStatus,
  filterDataRange,
  filterBillNo,
  // filterRemarks,
  // 模型方法
  changeFilterStatus,
  changeFilterDataRange,
  changeFilterBillNo,
  // changeFilterRemarks,
  changeBillType,
  selectBillType,
  changeWareHouse,
  selectWareHouse,
  // changeSupplier,
  // selectSupplier,
  onAdd, // 新增出库单
  filterStockOut,
}) => {
  changeStore = (value) => { selectStore(value); };
  changeBillType = (value) => { selectBillType(value); };
  changeWareHouse = (value) => { selectWareHouse(value); };
  // changeSupplier = (value) => { selectSupplier(value); };
  const storeOptions = angencyList && angencyList.map(store => <Select.Option value={store.id} key={store.id}>{store.name}</Select.Option>);
  const billTypeOptions = billTypeList && billTypeList.map(store => {
    return <Select.Option value={''+store.dictCode} key={store.dictCode}>{store.dictName}</Select.Option>;})
  const wareHouseOptions = wareHouseList && wareHouseList.map(store => <Select.Option value={store.id} key={store.id}>{store.depotName}</Select.Option>)
  // const supplierOptions = theSupplierList && theSupplierList.map(store => <Select.Option value={store.id} key={store.id}>{store.suppName}</Select.Option>)
  return (
    <div className="components-search">
      <Breadcrumb separator=">">
        <Breadcrumb.Item>供应链</Breadcrumb.Item>
        <Breadcrumb.Item>集团总部管理</Breadcrumb.Item>
        <Breadcrumb.Item>出库管理</Breadcrumb.Item>
      </Breadcrumb>
      <div className="shop-select">
        <Form layout="inline" >
          <Form.Item label="机构名称">
            {getFieldDecorator('shopName', { initialValue: angencyList.length === 1 ? initialOrgName : storeId || '请选择机构名称' })(
              <Select style={{ width: 160 }} onChange={changeStore}>
                {storeOptions}
              </Select>
            )}
          </Form.Item>
          {storeId && menuData['list'].hasOwnProperty('61500401') && <div className="right-act"><Button icon="plus" type="primary" onClick={onAdd}>新增出库单</Button></div>}
          {/* disabled={moment(nowDate).valueOf() < moment(monthDate).valueOf()} */}
        </Form>
      </div>
      {storeId && <div>
        <Form layout="inline" style={!storeId ? { display: 'none' } : {}}>
          <Form.Item label="类型">
            {getFieldDecorator('billType', { initialValue: '请选择' })(
              <Select style={{ width: 160 }} setFieldsValue={billType} onChange={changeBillType}>
                {billTypeOptions}
              </Select>
            )}
          </Form.Item>
          <Form.Item label="编号">
            <Input placeholder="请输入编号" value={filterBillNo} onChange={changeFilterBillNo} />
          </Form.Item>
          <Form.Item label="出库日期">
            <DatePicker.RangePicker
              format="YYYY-MM-DD"
              value={filterDataRange}
              onChange={changeFilterDataRange}
              ranges={{
                '前1月': [moment().subtract(1, 'month'), moment()],
                '前15天': [moment().subtract(15, 'day'), moment()],
                '前7天': [moment().subtract(7, 'day'), moment()],
                '前3天': [moment().subtract(3, 'day'), moment()],
                '今天': [moment(), moment()],
              }}
            />
          </Form.Item>
          <Form.Item label="仓库">
            {getFieldDecorator('depotId', { initialValue: '请选择' })(
              <Select style={{ width: 160 }} setFieldsValue={depotId} onChange={changeWareHouse}>
                {wareHouseOptions}
              </Select>
            )}
          </Form.Item>
          <Form.Item label="状态">
            <Radio.Group value={filterStatus} onChange={changeFilterStatus}>
              <Radio.Button value="961" style={{ width: 75 }}>未完成</Radio.Button>
              <Radio.Button value="962" style={{ width: 75 }}>已完成</Radio.Button>
              <Radio.Button value="" style={{ width: 70 }}>全部</Radio.Button>
            </Radio.Group>
          </Form.Item>
          {/* <Col span={5}>
            <Form.Item label="供应商">
              {getFieldDecorator('busiId', { initialValue: '请选择' })(
                <Select style={{ width: 140 }} setFieldsValue={busiId} onChange={changeSupplier}>
                  {supplierOptions}
                </Select>
              )}
            </Form.Item>
          </Col> */}
          {/* <Col span={5}>
            <Form.Item label="备注">
              <Input placeholder="请输入" value={filterRemarks} onChange={changeFilterRemarks} />
            </Form.Item>
          </Col> */}
          <Form.Item>
            <Button type="primary" onClick={filterStockOut}>搜索</Button>
          </Form.Item>
        </Form>
      </div>}
    </div>
  );
};
StockOutSearch.PropTypes = {
  filterStatus: PropTypes.string,
  filterDataRange: PropTypes.array,
  angencyList: PropTypes.array,
  billTypeList: PropTypes.array,
  wareHouseList: PropTypes.array,
  theSupplierList: PropTypes.array,
  filterOpterName: PropTypes.string,
  filterBillNo: PropTypes.string,
  // filterRemarks: PropTypes.string,
  storeId: PropTypes.string,
  changeStore: PropTypes.func,
  selectStore: PropTypes.func,
  changeFilterStatus: PropTypes.func,
  changeFilterDataRange: PropTypes.func,
  changeFilterBillNo: PropTypes.func,
  // changeFilterRemarks: PropTypes.func,
  changeBillType: PropTypes.func,
  selectBillType: PropTypes.func,
  changeWareHouse: PropTypes.func,
  selectWareHouse: PropTypes.func,
  // changeSupplier: PropTypes.func,
  // selectSupplier: PropTypes.func,
  filterStockOut: PropTypes.func,
};
// export default StockOutSearch;
export default Form.create()(StockOutSearch);
