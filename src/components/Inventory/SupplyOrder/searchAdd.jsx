import React, { PropTypes } from 'react';
import { Form, Input, Button, Row, Col, Select, Breadcrumb, DatePicker } from 'antd';
import moment from 'moment';
const Option = Select.Option;


const searchAdd = ({
  storeList, // 全部机构
  storeAddId, // 机构id
  changeStore, // 选择机构id
  onAdd, // 新增采购订单
  updateAudit, // 弃审
  busiList,
  status,
  bussDate,
  billNo, // 单据编码
  queryAll, // 搜索全部
  handleSubmit, // 搜索全部事件
  busiId, // 供应商id
  upadateTime, // 修改订单日期
  upadateStore, // 修改收货机构
  upadateBusi, // 修改供应商
  upadateRemarks, // 修改备注
  update, // 新增还是编辑
  dataAll, // 编辑时返回全部
  remarks, // 备注
  supplierList, // 供应商数组
  selectedBussDate, // 到货日期
  arrivalDate,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    getFieldValue,
  },
  disabledDate,
}) => {
  // console.log("arrivalDate",arrivalDate, moment(arrivalDate));
  disabledDate = (current) => {
    // Can not select days before today and today
    // console.log("moment()", startDate);
    return  current && current.valueOf() < moment(bussDate)
  }
  handleSubmit = (e) => {
    e.preventDefault();
    validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      if (!err) {
        let rangeValue = fieldsValue['range-picker'] || '';
        // console.log('-------rangeValue', rangeValue);
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
        // console.log('Received values of form: ', selectData);
        queryAll(selectData);
      }
    });
  };
  const storeOptions = storeList.map(store => <Option value={store.id} key={store.id}>{store.name}</Option>);
  const busiListAll = supplierList && supplierList.map(store => <Option value={store.id} key={store.id}>{store.suppName}</Option>);
  return (
    <div className="components-search">
      <Breadcrumb separator=">">
        <Breadcrumb.Item>供应链</Breadcrumb.Item>
        <Breadcrumb.Item>集团总部管理</Breadcrumb.Item>
        <Breadcrumb.Item>直运采购</Breadcrumb.Item>
        <Breadcrumb.Item>{ update ? '编辑' : '新增'}订单</Breadcrumb.Item>
      </Breadcrumb>
      <Form layout="inline">
        <Form.Item label="订单类型">
          <Input style={{ width: 160 }} value="直运" disabled placeholder="订单类型" />
        </Form.Item>
        <Form.Item label="采购订单">
          <Input style={{ width: 160 }} disabled value={billNo} placeholder="请填写采购订单" />
        </Form.Item>
        <Form.Item label={<span><span style={{color: '#f04134', fontSize: 16 }}> * </span>请购日期</span>} >
          <DatePicker allowClear={false} value={moment(bussDate)} onChange={upadateTime}  disabled={dataAll.billSource && dataAll.billSource === 1} />
        </Form.Item>
        <Form.Item label="门店名称">
          {getFieldDecorator('storeAddId', {
            initialValue: storeAddId || '请选择',
            rules: [
              { required: true, message: '请选择门店名称' },
            ],
          })(
            <Select style={{ width: 160 }} placeholder="请选择门店名称" setFieldsValue={storeAddId} onChange={upadateStore} disabled={update}>
              <Option value="" key="">请选择</Option>
              {storeOptions}
            </Select>,
        )}
        </Form.Item>
        <Form.Item label="供应商">
          {getFieldDecorator('busiId', {
            initialValue: busiId || '请选择',
            rules: [
              { required: true, message: '请选择门店名称' },
            ],
          })(
            <Select style={{ width: 160 }} placeholder="请选择供应商" setFieldsValue={busiId} onChange={upadateBusi} disabled={update}>
              <Option value="" key="">请选择</Option>
              {busiListAll}
            </Select>,
        )}
        </Form.Item>
        <Form.Item label="到货日期">
          {getFieldDecorator('arrivalDate', {
            initialValue: moment(arrivalDate),
            rules: [
              { required: true, message: '请选择到货日期!' },
            ],
          })(
            <DatePicker allowClear={false} disabledDate={disabledDate} onChange={selectedBussDate} />
          )}
        </Form.Item>
        <Form.Item label="备注">
          <Input style={{ width: 160 }} value={remarks} onChange={upadateRemarks} placeholder="请选择备注" />
        </Form.Item>
      </Form>
    </div>
  );
};

searchAdd.propTypes = {
  storeList: PropTypes.array,
  storeId: PropTypes.string,
  changeStore: PropTypes.func,
  queryAll: PropTypes.func,
};
export default Form.create()(searchAdd);
