import React, { PropTypes } from 'react';
import moment from 'moment';
import { Form, Button, Row, Col, Breadcrumb, Select, message, DatePicker,Input } from 'antd';
const Option = Select.Option
const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;

const search = ({
  billNo,
  status,
  billType,
  depotId,
  busiId,
  startDate,
  endDate,
  loading,
  storeId,
  supplierList,
  typeList,
  warehouseList,
  queryString,
  selelctAll,
  querySupplier,
  queryTime,
  queryGoods,
  queryCopy,
  upadateSupplier,
  upadateTime,
  upadateGoods,
  upadateCopy,
  bussDate,
  goodsId,
  remarks,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    getFieldValue,
  },
}) => {

 upadateSupplier = (value) => {
   querySupplier(value);
 };
 upadateTime = (value) => {
   // console.log("提交修改",value.format('YYYY-MM-DD'));
   if(!!value){
     queryTime(value.format('YYYY-MM-DD'));
   }else {

   }
 };
 upadateGoods = (value) => {
   queryGoods(value);
 };
 upadateCopy = (value) => {
   queryCopy(value.target.value);
 };
  const formItemLayoutTime = {
    labelCol: {
      xs: { span: 48 },
      sm: { span: 8 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
    },
    };
  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
    };
    const config = {
      rules: [{ type: 'object', required: true, message: 'Please select time!' }],
    };
  const supplierListAll = supplierList&&supplierList.map(store => <Option value={store.id} key={store.id}>{store.suppName}</Option>);
  const warehouseListAll = warehouseList&&warehouseList.map(store => <Option value={store.id} key={store.id}>{store.depotName}</Option>);
  function selelctAll(value){
    console.log('你好', value);
  }
  return (
    <div className="components-search"><Breadcrumb separator=">">
      <Breadcrumb.Item>供应链</Breadcrumb.Item>
      <Breadcrumb.Item>门店进销存管理</Breadcrumb.Item>
      <Breadcrumb.Item>采购管理</Breadcrumb.Item>
      <Breadcrumb.Item>新增采购订单</Breadcrumb.Item>
    </Breadcrumb>
      <div className="search">
        <div >
          <Form layout="inline">
            <FormItem {...formItemLayout} label="供应商">
              {getFieldDecorator('depotId', {
                initialValue: depotId || '',
              })(
                <Select style={{ width: 160 }} placeholder="请选择供应商" onChange={upadateSupplier}>
                  {supplierListAll}
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="采购日期">
                <DatePicker defaultValue={moment(new Date(), 'YYYY-MM-DD')} onChange={upadateTime} />
            </FormItem>
            <FormItem {...formItemLayout} label="采购仓库">
              {getFieldDecorator('goodsId', {
                initialValue: goodsId || '',
              })(
                <Select style={{ width: 160 }} onChange={upadateGoods} placeholder="请输入采购仓库">
                  {warehouseListAll}
                </Select>
             )}
            </FormItem>
            <FormItem {...formItemLayout} label="备注">
              {getFieldDecorator('remarks', {
                initialValue: remarks || '',
              })(
                <Input style={{ width: 160 }} onChange={upadateCopy} placeholder="请选择备注" />
              )}
            </FormItem>
          </Form>
        </div>
      </div>
    </div>
  );
};
search.PropTypes = {
  queryString: PropTypes.string,
  billType: PropTypes.string,
  depotName: PropTypes.string,
  suppName: PropTypes.string,
  onAdd: PropTypes.func,
};
export default Form.create()(search);
