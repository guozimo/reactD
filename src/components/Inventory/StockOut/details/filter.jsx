import React, { PropTypes } from 'react';
import { Form, Input, Button, Select, Tooltip, Breadcrumb, DatePicker, Row, Col, message } from 'antd';
import moment from 'moment';
import { queryGoodsID } from '../../../../services/inventory/common';

const Option = Select.Option;
const FormItem = Form.Item;

const StockOutDetailsSearch = ({
  pageType,
  storeId,
  // busiId,
  // busiName,
  depotId,
  depotName,
  bussDate,
  monthDate,
  baseInfo,
  billType,
  remarks,
  currRemarks,
  detailList,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldValue,
  },
  // module methods
  selectedBussDate,
  setCurrRemarks,
  changeBillType,
  selectBillType,
  // onBusiIdSave,
  // onSupplierQuery,
  changeWareHouse,
  selectWareHouse,
  // private vars and methods
  disabledDate,
  setRemarks,
}) => {
  // 供应商、仓库即时选择方法
  changeWareHouse = (value) => { selectWareHouse(value); };
  // const handleSupplierSelect = (value, option) => {
  //   onBusiIdSave(option.props.title);
  // };
  // const handleSupplierFocus = () => {
  //   onSupplierQuery();
  // };
  // const handleSupplierChange = (value) => {
  //   onSupplierQuery(value);
  // };
  disabledDate = (current) => {
    return current.valueOf() < moment(monthDate).valueOf() || (moment(current).isAfter(moment())
    || moment(current).isBefore(moment().add(-1, 'month').add(-1, 'day')));
  };
  // const pageTypeVal = pageType;
  const billTypeList = pageType === 'view' ? baseInfo.billTypeView : baseInfo.billTypeAddOrEdit; // 只能新增两种出库单 查看编辑时可以显示五种
  const billTypeOptions = billTypeList.map((type) => {
    return <Option value={type.code} key={type.code}>{type.name}</Option>;
  });
  const wareHouseOptions = baseInfo.warehouse && baseInfo.warehouse.map(item => <Select.Option value={item.id} key={item.id}>{item.depotName}</Select.Option>);
  // const supplierOptions = baseInfo.supplier.map(item => <Option value={item.suppName} key={item.id} title={item.id}>{item.suppName}</Option>);
  // 查看和编辑时备注同步
  if (pageType === 'edit' || pageType === 'view') {
    currRemarks = remarks;
  }
  // 定义初始日期
  const bussDateInit = moment(bussDate);
  setRemarks = (e) => {  setCurrRemarks(e.target.value); };
  const valBillType = (rule, value, callback) => {
    if (value) {
      if (value === '请选择类型') {
        callback('请选择类型！');
      } else {
        callback();
      }
    } else {
      callback();
    }
  };
  changeBillType = (value) => { selectBillType(value); };
  return (
    <div className="components-search">
      <Breadcrumb separator=">">
        <Breadcrumb.Item>供应链</Breadcrumb.Item>
        <Breadcrumb.Item>集团总部管理</Breadcrumb.Item>
        <Breadcrumb.Item>出库管理</Breadcrumb.Item>
        {pageType === 'add' && <Breadcrumb.Item>新增出库单</Breadcrumb.Item>}
        {pageType === 'edit' && <Breadcrumb.Item>编辑出库单</Breadcrumb.Item>}
        {pageType === 'view' && <Breadcrumb.Item>查看出库单</Breadcrumb.Item>}
      </Breadcrumb>
      <Form layout="inline" style={!storeId ? { display: 'none' } : {}}>
        <FormItem label="仓库">
          {getFieldDecorator('depotId', {
            initialValue: depotName || '请选择',
            rules: [
              { required: true, message: '请选择仓库!' },
            ],
          })(
            <Select
              style={{ width: 140 }}
              onChange={changeWareHouse}
              disabled={pageType === 'view'}
            >
              {wareHouseOptions}
            </Select>,
          )}
        </FormItem>
        <FormItem label="出库日期">
          {getFieldDecorator('bussDate', {
            initialValue: bussDateInit,
          })(
            <DatePicker
              style={{ width: 160 }}
              allowClear={false}
              disabledDate={disabledDate}
              disabled={pageType === 'view'}
              onChange={selectedBussDate}
            />,
          )}
        </FormItem>
        <Form.Item label="类型">
          {getFieldDecorator('billType', {
            initialValue: billType || '请选择',
            rules: [
              { required: true, message: '请选择类型!' },
              { validator: valBillType },
            ],
          })(
            <Select
              style={{ width: 160 }}
              setFieldsValue={billType}
              onChange={changeBillType}
              disabled={pageType === 'view'}
            >
              {billTypeOptions}
            </Select>
          )}
        </Form.Item>
        {/* <Col span={6}>
          <FormItem label="供应商">
            {getFieldDecorator('busiName', { initialValue: busiName || '请选择' }, { rules: [
              { required: true, message: '请选择供应商!' },
            ] })(
              <Select
                style={{ width: 140 }}
                disabled={pageType === 'view'}
                onChange={handleSupplierChange}
                onFocus={handleSupplierFocus}
                onSelect={handleSupplierSelect}
              >
                {supplierOptions}
              </Select>,
            )}
          </FormItem>
        </Col> */}
        <FormItem label="备注">
          <Input placeholder="请输入" style={{ width: 300 }} value={currRemarks} onChange={setRemarks} disabled={pageType === 'view'} />
        </FormItem>
      </Form>
      {/* <span className="attention">注：淡蓝色框可输入</span> */}
    </div>
  );
};

StockOutDetailsSearch.PropTypes = {
  storeId: PropTypes.string,
  // onSupplierQuery: PropTypes.func,
  changeBillType: PropTypes.func,
  selectBillType: PropTypes.func,
  changeWareHouse: PropTypes.func,
  selectWareHouse: PropTypes.func,
};

export default Form.create()(StockOutDetailsSearch);
