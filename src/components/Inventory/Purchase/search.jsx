import React, { PropTypes } from 'react';
import moment from 'moment';
import { Form, Button, Breadcrumb, Select, Radio, message, DatePicker, Input } from 'antd';
const Option = Select.Option
const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;

const search = ({
  billNo,
  status,
  billType,
  depotId,
  suppId,
  startDate,
  endDate,
  selectStore,
  changeStore,
  supplierList,
  typeList,
  warehouseList,
  onAdd,
  handleSubmit,
  storeList,
  queryAll,
  storeId,
  filterDataRange,
  changeFilterDataRange,
  changeFilterStatus,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    getFieldValue,
  },
}) => {
  changeStore = (value) => {
    selectStore(value);
  };
  handleSubmit = (e) => {
   e.preventDefault();
   validateFields((err, fieldsValue) => {
     if (err) {
       return ;
     }
     if (!err) {
       let rangeValue = fieldsValue['range-picker'] || '';
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
       delete selectData['range-picker'];
       queryAll(selectData);
     }
   });
 }
 // console.warn("storeList",storeList);
  const storeOptions = storeList.length && storeList.map(store => <Option value={store.id} key={store.id}>{store.name}</Option>);
  const supplierListAll = supplierList.length && supplierList.map(store => <Option value={store.id} key={store.id}>{store.suppName}</Option>);
  const warehouseListAll = warehouseList.length && warehouseList.map(store => <Option value={store.id} key={store.id}>{store.depotName}</Option>);
  const typeListAll = typeList.length && typeList.map(store => <Option value={store.id} key={store.id}>{store.dictName}</Option>);
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
  // const rangeConfig = {
  //   rules: [{ type: 'array',  message: 'Please select time!' },{
  //     validator:[moment(new Date(), 'YYYY-MM-DD'), moment(new Date(), 'YYYY-MM-DD')]
  //   }],
  // };
  return (
    <div className="components-search"><Breadcrumb separator=">">
      <Breadcrumb.Item>供应链</Breadcrumb.Item>
      <Breadcrumb.Item>门店进销存管理</Breadcrumb.Item>
      <Breadcrumb.Item>采购管理</Breadcrumb.Item>
    </Breadcrumb>
    <div className="shop-select">
      <Form inline >
        <FormItem label="门店名称">
          {getFieldDecorator('storeId', {
            initialValue: storeId || '请选择门店名称',
          })(
            <Select
              style={{ width: 160 }}
              onChange={changeStore}
              placeholder="请选择门店"
            >
              {storeOptions}
            </Select>)}
        </FormItem>
      </Form>
      {storeId && <div className="right-act">
      <Button type="primary" icon="plus"  onClick={onAdd}>新增采购单</Button>
       </div>}
    </div>
    {storeId  && <div className="search">
      <div >
      <Form layout="inline" onSubmit={handleSubmit}>
      <FormItem {...formItemLayout}  label="编号">
        {getFieldDecorator('billNo', {
          initialValue: billNo || '',
        })(
            <Input style={{ width: 160 }} placeholder="单据编号" />
        )}
      </FormItem>
        <FormItem {...formItemLayout}  label="类型">
          {getFieldDecorator('billType', {
              initialValue: billType || '',
          })(
            <Select   style={{ width: 160 }} placeholder="请选择类型">
              <Option value="" key="">请选择类型</Option>
               {typeListAll}
            </Select>
          )}
        </FormItem>
        <FormItem
         {...formItemLayoutTime}
         label="采购时间："
       >
         {getFieldDecorator('range-picker', { initialValue: filterDataRange })(
           <RangePicker  allowClear={false} onChange={changeFilterDataRange}
              renderExtraFooter={() => <div style={{ textAlign: 'center', color: '#bfbfbf' }}>请点选两个时间以确定一个时间范围</div>}/>
         )}
       </FormItem>
       <br />
       <br />
       <FormItem {...formItemLayout}  label="仓库">
         {getFieldDecorator('depotId', {
           initialValue: depotId || '',
         })(
             <Select style={{ width: 160 }} placeholder="请选择状态">
              <Option value="" key="">请选择状态</Option>
              {warehouseListAll}
            </Select>
         )}
       </FormItem>
       <FormItem {...formItemLayout}  label="供应商">
         {getFieldDecorator('suppId', {
           initialValue: suppId || '',
         })(
             <Select style={{ width: 160 }} placeholder="请选择供应商">
               <Option value="" key="">请选择供应商</Option>
              {supplierListAll}
            </Select>
         )}
       </FormItem>
       <FormItem label="订单状态">
         <Radio.Group value={status} onChange={changeFilterStatus}>
           <Radio.Button value="961">未完成</Radio.Button>
           <Radio.Button value="962">已完成</Radio.Button>
           <Radio.Button value="">全部</Radio.Button>
         </Radio.Group>
       </FormItem>
        <Button type="primary" htmlType="submit">搜索</Button>
      </Form>
      </div>
    </div>}
    </div>
  );
};
search.PropTypes = {
  changeStore: PropTypes.func,
  billNo: PropTypes.string,
  status: PropTypes.string,
  billType: PropTypes.string,
  depotId: PropTypes.string,
  busiId: PropTypes.string,
  startDate: PropTypes.string,
  endDate: PropTypes.string,
  selectStore: PropTypes.func,
  onAdd: PropTypes.func,
  handleSubmit: PropTypes.func,
  queryAll: PropTypes.func,
  storeId: PropTypes.string,
};
export default Form.create()(search);
