import React from 'react';
import { Select, Input, DatePicker, Spin, Breadcrumb, Form } from 'antd';
import moment from 'moment';
const Option = Select.Option;

const RequisitionDetailsFilter = ({
  opType,
  user,
  bussDate,
  billInfo,
  depotCannList,
  outDepotId,
  inDepotId,
  remarks,
  upadateOutDepot,
  upadateInDepot,
  upadateRemarks,
  startDate,
  fetching,
  inFetching,
  searchDepot,
  depotInCannList,
  searchInDepot,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldValue,
  },
  // module methods
  selectedBussDate,

  // private vars and methods
  disabledDate,
}) => {
  disabledDate = (current) => {
    // Can not select days before today and today
    // console.log("moment()", startDate);
    return current && (moment() < current.valueOf() || current.valueOf() < moment(startDate).valueOf());
  }
  const storeOptions = depotCannList.length && depotCannList.map(store => <Option value={store.id} key={store.id}>{store.depotName}</Option>);
  const storeInOptions = depotInCannList.length && depotInCannList.map(store => <Option value={store.id} key={store.id}>{store.depotName}</Option>);
  return (
    <div>
      <div className="components-search">
        <Breadcrumb separator=">">
          <Breadcrumb.Item>供应链</Breadcrumb.Item>
          <Breadcrumb.Item>集团总部管理</Breadcrumb.Item>
          <Breadcrumb.Item>调拨管理</Breadcrumb.Item>
          <Breadcrumb.Item>{ opType === 'edit' ? '调单' : opType === 'view' ? '查看' : '新增'}调拨单</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      <div className="search">
        <Form layout="inline">
          <Form.Item label={<span><span style={{color: '#f04134', fontSize: 16 }}> * </span>调出仓库</span>}>
            <Select
              disabled={opType === 'view'}
              style={{ width: 160 }}
              placeholder="请选择收货机构"
              value={outDepotId}
              showSearch
              filterOption={false}
              notFoundContent={fetching ? <Spin size="small" /> : <span>暂无数据</span>}
              onChange={upadateOutDepot}
              onSearch={value => searchDepot(value, 'out')}
            >
              <Option value="" key="">请选择</Option>
              {storeOptions}
            </Select>
          </Form.Item>
          <Form.Item label="调拨日期">
            {getFieldDecorator('bussDate', {
              initialValue: moment(bussDate),
              rules: [
                { required: true, message: '请选择调拨日期!' },
              ],
            })(
              <DatePicker allowClear={false} disabledDate={disabledDate} disabled={opType === 'view'} onChange={selectedBussDate} />
            )}
          </Form.Item>
          <Form.Item label={<span><span style={{color: '#f04134', fontSize: 16 }}> * </span>调入仓库</span>} >
            <Select
              disabled={opType === 'view'}
              style={{ width: 160 }}
              placeholder="请选择收货机构"
              value={inDepotId}
              showSearch
              filterOption={false}
              notFoundContent={inFetching ? <Spin size="small" /> : <span>暂无数据</span>}
              onChange={upadateInDepot}
              onSearch={value => searchDepot(value, 'in')}
            >
              <Option value="" key="">请选择</Option>
              {storeInOptions}
            </Select>
          </Form.Item>
          <Form.Item label="备注">
            <Input disabled={opType === 'view'} style={{ width: 160 }} value={remarks} onChange={upadateRemarks} placeholder="请选择备注" />
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Form.create()(RequisitionDetailsFilter);
