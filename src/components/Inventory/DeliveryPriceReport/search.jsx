import React, { PropTypes } from 'react';
import { Form, Input, Button, Select, Breadcrumb, DatePicker, Radio, Popconfirm } from 'antd';
import moment from 'moment';
import INVENTORY_PERMISSION from '../../common/Permission/inventoryPermission';
import Permission from '../../common/Permission/Permission.jsx';

const Option = Select.Option;
const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

const search = ({
  orgList, // 全部机构
  orgInfoId, // 机构id
  onAdd, // 新增采购订单
  startDate,
  endDate,
  baseInfo,
  filters,
  onChangeOrg, // 选择机构id
  onChangeShop,
  onSearch,
  onStatusChange,
  onChangeDate,
  onGoodsListQuery,
  onGoodsIdSave,
  onCancel,
  chooseBills,
  changeBillNo,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
  },
  filterOrderLib,
  disabledDate,
}) => {
  disabledDate = (current) => {
    return (moment(current).isAfter(moment().valueOf()));
  };
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
  // console.log("我是看看有啥数据", baseInfo.shopList);
  const orgOptions = orgList.map(store => <Option value={store.id} key={store.id}>{store.name}</Option>);
  const shopOptions = baseInfo.shopList.map(item => <Option value={item.id} key={item.id}>{item.name}</Option>);
  const goodsListOptions = baseInfo.goodsList.map(item => <Option value={item.id} key={item.id} title={item.id}>{item.goodsName}</Option>);
  const handleGoodsListChange = (value) => {
    // onGoodsListQuery(value);
    onGoodsIdSave(value);
  };
  // const handleGoodsListFocus = () => {
  //   onGoodsListQuery();
  // };
  // const handleGoodsListSelect = (value, option) => {
  //   // onGoodsIdSave(option);
  //   // console.log("我是数据",value);
  //   onGoodsListQuery(value);
  // };
  // const handleGoodsListBlur = () => {
  // };

  return (
    <div className="components-search">
      <Breadcrumb separator=">">
        <Breadcrumb.Item>供应链</Breadcrumb.Item>
        <Breadcrumb.Item>集团总部管理</Breadcrumb.Item>
        <Breadcrumb.Item>配送售价综合查询</Breadcrumb.Item>
      </Breadcrumb>

      <div className="shop-select">
        <Form inline>
          <Form.Item label="机构名称">
            {getFieldDecorator('orgInfoId', {
              initialValue: orgInfoId || '请选择机构名称',
            })(
              <Select
                style={{ width: 160 }}
                onChange={onChangeOrg}
              >
                {orgOptions}
              </Select>,
            )}
          </Form.Item>
        </Form>
      </div>
      {orgInfoId && <div>
        <Form layout="inline" onSubmit={handleSubmit}>
          <FormItem label="门店名称">
            {getFieldDecorator('storeId', {
              initialValue: filters.storeId || '请选择门店',
            })(
              <Select
                style={{ width: 160 }}
                onChange={onChangeShop}
                setFieldsValue={filters.storeId}
              >
                {shopOptions}
              </Select>,
            )}
          </FormItem>
          <FormItem label="审核日期">
            {getFieldDecorator('rangeDate', {
              initialValue: rangeDateInit,
            })(
              <RangePicker
                disabledDate={disabledDate}
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
          <FormItem label="单据编号">
            {getFieldDecorator('billNo', {
              initialValue: filters.billNo,
            })(
              <Input style={{ width: 160 }} onChange={changeBillNo} placeholder="请输入单据编号" />,
            )}
          </FormItem>
          <FormItem label="物品名称">
            {getFieldDecorator('goodsId', {
              initialValue: filters.goodsId || '请选择物品',
            })(
              <Select
                showSearch
                allowClear
                filterOption={false}
                style={{ width: 160 }}
                onChange={handleGoodsListChange}
                onSearch={value => onGoodsListQuery(value)}
              >
                {goodsListOptions}
              </Select>,
            )}
          </FormItem>
          <FormItem label="单据状态">
            {getFieldDecorator('status', {
              initialValue: filters.status,
            })(
              <RadioGroup onChange={onStatusChange}>
                <RadioButton value="960">已作废</RadioButton>
                <RadioButton value="962">已审核</RadioButton>
                <RadioButton value="" >全部</RadioButton>
              </RadioGroup>,
            )}
          </FormItem>
          <FormItem>
            <Button type="primary" onClick={filterOrderLib}>搜索</Button>
          </FormItem>
        </Form>
        <div>
          <Permission path={INVENTORY_PERMISSION.DELIVERY_PRICE_LIST.ABOLISH}>
            <Popconfirm title="确定作废已选单据吗？废除之后不能恢复!" onConfirm={() => onCancel()}>
              <Button type="primary" disabled={chooseBills.length <= 0}>批量作废</Button>
            </Popconfirm>
          </Permission>
        </div>
      </div>}
    </div>
  );
};

search.propTypes = {
  orgList: PropTypes.array,
  orgInfoId: PropTypes.string,
  changeStore: PropTypes.func,
  queryAll: PropTypes.func,
};
export default Form.create()(search);
