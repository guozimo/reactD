import React, { PropTypes } from 'react';
import { Form, Input, Button, Select, Breadcrumb, DatePicker, Radio } from 'antd';
import moment from 'moment';
import INVENTORY_PERMISSION from '../../common/Permission/inventoryPermission';
import Permission from '../../common/Permission/Permission.jsx';

const Option = Select.Option;
const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

const search = ({
  storeList, // 全部机构
  storeId, // 机构id
  changeStore, // 选择机构id
  onAdd, // 新增采购订单
  startDate,
  endDate,
  baseInfo,
  filters,
  onSearch,
  onStatusChange,
  onChangeBillType, // 改变单据类型
  onChangeDate, // 改变日期
  onChangeDepotId, // 修改仓库
  onChangeBusiId, // 改变供应商
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
  },
}) => {
  const rangeDateInit = [moment(startDate), moment(endDate)];
  const handleSubmit = (e) => {
    e.preventDefault();
    validateFields((errors) => {
      if (!!errors) {
        return;
      }
      const searchParam = getFieldsValue();
      onSearch(searchParam);
    });
  };
  const storeOptions = storeList.map(store => <Option value={store.id} key={store.id}>{store.name}</Option>);
  const billTypeOptions = baseInfo.billType.map(type => <Option value={String(type.dictCode)} key={String(type.dictCode)}>{type.dictName}</Option>);
  const warehouseOptions = baseInfo.warehouse.map(item => <Option value={item.id} key={item.id}>{item.depotName}</Option>);
  const supplierOptions = baseInfo.supplier.map(item => <Option value={item.id} key={item.id}>{item.suppName}</Option>);

  return (
      <div className="components-search">
        <Breadcrumb separator=">">
          <Breadcrumb.Item>供应链</Breadcrumb.Item>
          <Breadcrumb.Item>集团总部管理</Breadcrumb.Item>
          <Breadcrumb.Item>入库管理</Breadcrumb.Item>
        </Breadcrumb>

        <div className="shop-select">
          <Form inline >
            <Form.Item label="机构名称">
              {getFieldDecorator('storeId', {
                initialValue: storeId || '请选择机构名称',
              })(
                <Select
                  style={{ width: 160 }}
                  onChange={changeStore}
                >
                  {storeOptions}
                </Select>,
              )}
            </Form.Item>
          </Form>

          {storeId && <Permission path={INVENTORY_PERMISSION.OFFICIAL_IN.CREATE}>
              <div className="right-act">
                <Button type="primary" icon="plus" onClick={onAdd}>新增入库单</Button>
              </div>
            </Permission>
          }
        </div>
        {storeId && <div>
          <Form layout="inline" onSubmit={handleSubmit}>
            <FormItem label="类型" >
              {getFieldDecorator('billType', {
                initialValue: filters.billType,
              })(
                <Select
                  style={{ width: 160 }}
                  onChange={onChangeBillType}
                  placeholder="请选择类型"
                >
                  {billTypeOptions}
                </Select>,
              )}
            </FormItem>
            <FormItem label="编号">
              {getFieldDecorator('billNo', {
                initialValue: filters.billNo,
              })(
                <Input style={{ width: 160 }} placeholder="请输入编号" />,
              )}
            </FormItem>
            <FormItem label="入库时间">
              {getFieldDecorator('rangeDate', {
                initialValue: rangeDateInit,
              })(
                <RangePicker
                  allowClear={false}
                  onChange={onChangeDate}
                  renderExtraFooter={() => <div style={{ textAlign: 'center', color: '#bfbfbf' }}>请点选两个时间以确定一个时间范围</div>}
                  ranges={{
                    '前1月': [moment().subtract(1, 'month'), moment()],
                    '前15天': [moment().subtract(15, 'day'), moment()],
                    '前7天': [moment().subtract(7, 'day'), moment()],
                    '前3天': [moment().subtract(3, 'day'), moment()],
                    '今天': [moment(), moment()],
                  }}
                />,
              )}
            </FormItem>
            <FormItem label="仓库">
              {getFieldDecorator('depotId', {
                initialValue: filters.depotId,
              })(
                <Select
                  style={{ width: 160 }}
                  onChange={onChangeDepotId}
                  placeholder="请选择仓库"
                >
                  {warehouseOptions}
                </Select>,
              )}
            </FormItem>
            <FormItem label="供应商">
              {getFieldDecorator('busiId', {
                initialValue: filters.busiId,
              })(
                <Select
                  placeholder="请选择供应商"
                  style={{ width: 160 }}
                  onChange={onChangeBusiId}
                >
                  {supplierOptions}
                </Select>,
              )}
            </FormItem>
            <FormItem label="状态">
              {getFieldDecorator('status', {
                initialValue: filters.status,
              })(
                <RadioGroup onChange={onStatusChange}>
                  <RadioButton value="961">未完成</RadioButton>
                  <RadioButton value="962">已完成</RadioButton>
                  <RadioButton value="" >全部</RadioButton>
                </RadioGroup>,
              )}
            </FormItem>
            <Button type="primary" htmlType="submit">搜索</Button>
          </Form>
        </div>}
      </div>
  );
};

search.propTypes = {
  storeList: PropTypes.array,
  storeId: PropTypes.string,
  changeStore: PropTypes.func,
  queryAll: PropTypes.func,
};
export default Form.create()(search);
