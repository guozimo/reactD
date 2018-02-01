import React, { PropTypes } from 'react';
import { Form, Input, Button, Select, Row, Col, Breadcrumb, DatePicker } from 'antd';
import moment from 'moment';
const Option = Select.Option;

const searchAdd = ({
  depotList, // 全部机构
  storeId, // 机构id
  changeStore, // 选择机构id
  onAdd, // 新增采购订单
  updateAudit, // 弃审
  typeList,
  status,
  upadateRemarks, // 备注修改
  remarks, // 备注
  upadateTime, // 修改时间
  bussDate, // 调拨日期：
  outDepotId, // 调出仓库：
  inDepotId, // 调入仓库：
  upadateOutDepot, // 调出仓库修改
  upadateInDepot, // 调入仓库修改
  disabledDate,
  allotTime, // 调拨时间
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    getFieldValue,
  },
}) => {
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
  const storeOptions = depotList.map(store => <Option value={store.id} key={store.id}>{store.depotName}</Option>);
  const typeListAll = typeList && typeList.map(store => <Option value={store.id} key={store.id}>{store.name}</Option>);
  disabledDate = (current) => {
    // Can not select days before today and today
    return current && current.valueOf() < moment().add(-1, 'days');
  }
  return (
    <div>
      <div className="components-search">
        <Breadcrumb separator=">">
          <Breadcrumb.Item>供应链</Breadcrumb.Item>
          <Breadcrumb.Item>集团总部管理</Breadcrumb.Item>
          <Breadcrumb.Item>调拨管理</Breadcrumb.Item>
          <Breadcrumb.Item>新增订单</Breadcrumb.Item>
        </Breadcrumb>

      </div>
    <div className="search">
      <Row>
        <Col span={2}>调出仓库：</Col>
        <Col span={6}>
          <Select style={{ width: 160 }} placeholder="请选择收货机构" value={outDepotId} onChange={upadateOutDepot}>
            <Option value="" key="">请选择</Option>
            {storeOptions}
          </Select>
        </Col>
        <Col span={2}>调拨日期：</Col>
        <Col span={6}>
          <DatePicker disabledDate={disabledDate} defaultValue={moment(new Date(), 'YYYY-MM-DD')} onChange={upadateTime} />
        </Col>
        <Col span={2}>调入仓库：</Col>
        <Col span={6}>
          <Select style={{ width: 160 }} placeholder="请选择收货机构" value={inDepotId} onChange={upadateInDepot}>
            <Option value="" key="">请选择</Option>
            {storeOptions}
          </Select>
        </Col>
      </Row>
      <Row style={{ paddingTop: 10 }}>
        <Col span={2}>备注</Col>
        <Col span={6}>
          <Input style={{ width: 160 }} value={remarks} onChange={upadateRemarks} placeholder="请选择备注" />
        </Col>
      </Row>
      </div>
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
