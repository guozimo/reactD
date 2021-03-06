import React, { PropTypes } from 'react';
import { Form, Input, Spin, Row, Col, Button, Select, Radio, Breadcrumb, DatePicker } from 'antd';
import moment from 'moment';
const Option = Select.Option;
const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;

const search = ({
  storeList, // 仓库列表
  distribIdList, // 机构列表
  distribId, // 机构id
  storeId, // 仓库id
  changeStore, // 选择机构id
  onAdd, // 新增采购订单
  updateAudit, // 弃审
  typeList,
  status,
  updateStatus, // 修改状态
  billNo, // 单据编码
  queryAll, // 搜索全部
  handleSubmit, // 搜索全部事件
  busiId, // 供应商id
  updateBusiId, // 供应商修改
  supplierList, // 供应商修改
  fetchShop, // 供应商修改
  fetching,
  fetchStore, // 仓库选择搜索
  updateStoreId, // 仓库选择修改
  fetchingStore, // 仓库
  filterDataRange,
  changeFilterDataRange,
  updateListBillNo, // 修改订单
  selectListBillNo, // 修改订单
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    getFieldValue,
  },
}) => {
    // console.log("你好", status);
  // console.warn("filterDataRange", filterDataRange);
  handleSubmit = (e) => {
    e.preventDefault();
    validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      if (!err) {
        let rangeValue = fieldsValue['new_picker'] || '';
        // console.log("-------rangeValue",rangeValue);
        let selectData;
        if (!!rangeValue) {
          selectData = {
            ...fieldsValue,
            startDate: rangeValue[0].format('YYYY-MM-DD'),
            endDate: rangeValue[1].format('YYYY-MM-DD'),
          };
        } else {
          selectData = {
            ...fieldsValue,
            startDate: '',
            endDate: '',
          };
        }
        delete selectData['new_picker'];
        // console.log('Received values of form: ', selectData);
        queryAll(selectData);
      }
    });
  };
  const formItemLayoutTime = {
    labelCol: {
      xs: { span: 48 },
      sm: { span: 4 },
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
  const storeOptions = distribIdList.length && distribIdList.map(store => <Option value={store.id} key={store.id}>{store.name}</Option>);
  const typeListAll = supplierList.length && supplierList.map(store => {
    if (!!store){
      return <Option value={store.id} key={store.id}>{store.suppName}</Option>;
    }
  });
  const storeListAll = storeList.length && storeList.map(store => {
    if (!!store) {
      return <Option value={store.id} key={store.id}>{store.name}</Option>;
    }
  });

  return (
    <div>
      <div className="components-search">
        <Breadcrumb separator=">">
          <Breadcrumb.Item>供应链</Breadcrumb.Item>
          <Breadcrumb.Item>集团总部管理</Breadcrumb.Item>
          <Breadcrumb.Item>直运采购</Breadcrumb.Item>
        </Breadcrumb>

        <div className="shop-select">
          <Form inline >
            <Form.Item label="机构名称">
              {getFieldDecorator('distribId', {
                initialValue: distribId || '请选择机构名称',
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
          {distribId &&
            <div className="right-act">
              <Button type="primary" icon="plus" onClick={onAdd}>新增直运订单</Button>
            </div>
          }
        </div>
      </div>
      {distribId && <div className="search">
        <Form layout="inline" onSubmit={handleSubmit}>
          <FormItem {...formItemLayout} label="门店名称">
            {getFieldDecorator('storeId', {
              initialValue: storeId || '',
            })(
              <Select
                style={{ width: 160 }}
                showSearch
                filterOption={false}
                notFoundContent={fetchingStore ? <Spin size="small" /> : <span>暂无数据</span>}
                onSearch={fetchStore}
                onChange={updateStoreId}
              >
                <Option value="" key="">请选择</Option>
                {storeListAll}
              </Select>,
              // <Input style={{ width: 160 }} placeholder="请输入供应商" />,
           )}
          </FormItem>
          <FormItem {...formItemLayout} label="编号">
            {getFieldDecorator('billNo', {
              initialValue: billNo || '',
            })(
              <Input style={{ width: 160 }} onSearch={selectListBillNo} onChange={updateListBillNo} placeholder="请输入编号" />,
           )}
          </FormItem>
          <FormItem
            {...formItemLayoutTime}
            label="订购日期"
            style={{ marginLeft: 30 }}
          >
            {getFieldDecorator('new_picker', { initialValue: filterDataRange })(
              <RangePicker
                allowClear={false}
                renderExtraFooter={() => <div style={{ textAlign: 'center', color: '#bfbfbf' }}>请点选两个时间以确定一个时间范围</div>}
                onChange={changeFilterDataRange}
              />
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="供应商">
            {getFieldDecorator('busiId', {
              initialValue: busiId || '',
            })(
              <Select
                style={{ width: 160 }}
                showSearch
                filterOption={false}
                notFoundContent={fetching ? <Spin size="small" /> : <span>暂无数据</span>}
                onSearch={fetchShop}
                onChange={updateBusiId}
              >
                <Option value="" key="">请选择</Option>
                {typeListAll}
              </Select>,
              // <Input style={{ width: 160 }} placeholder="请输入供应商" />,
           )}
          </FormItem>
          <FormItem label="状态" style={{ marginLeft: 24 }}>
            {getFieldDecorator('status', {
              initialValue: status || '',
            })(
              <RadioGroup onChange={updateStatus}>
                <RadioButton value="964" style={{ width: 70 }}>待处理</RadioButton>
                <RadioButton value="966" style={{ width: 70 }}>已关闭</RadioButton>
                <RadioButton value="962" style={{ width: 70 }}>已完成</RadioButton>
                <RadioButton value="" style={{ width: 60 }}>全部</RadioButton>
              </RadioGroup>,
            )}
          </FormItem>
          <FormItem>
            <Button type="primary" htmlType="submit" style={{ marginLeft: 60 }}>搜索</Button>
          </FormItem>
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
