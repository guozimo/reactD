import React, { PropTypes } from 'react';
import { Form, Input, Button, Select, Breadcrumb, DatePicker } from 'antd';
import moment from 'moment';
const Option = Select.Option;
const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;

const search = ({
  storeList, // 全部机构
  storeId, // 机构id
  changeStore, // 选择机构id
  onAdd, // 新增采购订单
  updateAudit, // 弃审
  typeList,
  status,
  billNo, // 单据编码
  queryAll, // 搜索全部
  handleSubmit, // 搜索全部事件
  depotList, // 出入库
  updateBillNo, // 修改编码
  upadateOutDepot,
  upadateInDepot,
  outNewDepotId, // 调出仓库ID
  inNewDepotId, // 调入仓库ID
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    getFieldValue,
  },
}) => {
  handleSubmit = (e) => {
    e.preventDefault();
    validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      if (!err) {
        let rangeValue = fieldsValue['range-picker'] || '';
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
  if (outNewDepotId||inNewDepotId){

  }
  const storeOptions = storeList.map(store => <Option value={store.id} key={store.id}>{store.name}</Option>);
  const typeListAll = typeList && typeList.map(store => <Option value={store.id} key={store.id}>{store.name}</Option>);
  const depotListAll = depotList && depotList.map(store => <Option value={store.id} key={store.id}>{store.depotName}</Option>);

  return (
    <div>
      <div className="components-search">
        <Breadcrumb separator=">">
          <Breadcrumb.Item>供应链</Breadcrumb.Item>
          <Breadcrumb.Item>集团总部管理</Breadcrumb.Item>
          <Breadcrumb.Item>调拨管理</Breadcrumb.Item>
        </Breadcrumb>

        <div className="shop-select">
          <Form inline >
            <Form.Item label="机构名称">
              {getFieldDecorator('goodsName', {
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

          {storeId &&
            <div className="right-act">
              <Button type="primary" icon="plus" onClick={onAdd}>新增采购订单</Button>
            </div>
          }

        </div>
      </div>
      {storeId && <div className="search">
        <Form layout="inline" onSubmit={handleSubmit}>
          <FormItem {...formItemLayout} label="状态">
            {getFieldDecorator('status', {
              initialValue: ''
            })(
              <Select style={{ width: 160 }} placeholder="Please select a country">
                <Option value="962">完成</Option>
                <Option value="961">未完成</Option>
              </Select>,
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="编号">
            {getFieldDecorator('billNo', {
              initialValue: billNo || '',
            })(
              <Input style={{ width: 160 }} value={billNo} onChange={updateBillNo} placeholder="单据编号" />,
           )}
          </FormItem>
          <FormItem
            {...formItemLayoutTime}
            label="采购时间："
          >
            {getFieldDecorator('range-picker')(
              <RangePicker
                defaultValue={[moment(new Date(), 'YYYY-MM-DD'), moment(new Date(), 'YYYY-MM-DD')]}
                renderExtraFooter={() => <div style={{ textAlign: 'center', color: '#bfbfbf' }}>请点选两个时间以确定一个时间范围</div>}/>,
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="调出库">
            {getFieldDecorator('outDepotId', {
              initialValue: '',
            })(
              <Select style={{ width: 160 }} onChange={upadateOutDepot} placeholder="请选择类型">
                <Option value="" key="">请选择</Option>
                {depotListAll}
              </Select>,
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="调入库">
            {getFieldDecorator('inDepotId', {
              initialValue: '',
            })(
              <Select style={{ width: 160 }} onChange={upadateInDepot} placeholder="请选择类型">
                <Option value="" key="">请选择</Option>
                {depotListAll}
              </Select>,
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
