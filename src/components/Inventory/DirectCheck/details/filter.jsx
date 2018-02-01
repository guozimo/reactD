import React from 'react';
import { Breadcrumb, Select, Tag, Form } from 'antd';
import moment from 'moment';

const DirectCheckDetailsFilter = ({
  opType,
  user,
  bussDate,
  arrivalDate,
  form: {
    getFieldDecorator, // 用于和表单进行双向绑定
  },
  // module methods
  selectedBussDate,
  billNo, // 请购单号
  storeName, // 请购机构名称
  busiName, // 供应商名称
  status, // 状态
  createUserName, // 创建人
  createTime, // 创建时间
  auditName, // 提交人
  auditDate, // 提交时间
  depotName, // 入库仓库
  remarks, // 备注
  initialDepotName, // 入库仓库初始值
  depotId, // 入库仓库id
  depotList, // 入库仓库列表
  // module func
  changeDepot, // 修改入库仓库
  // private vars and methods
  disabledDate,
}) => {
  // 入库仓库列表
  const depotListAll = depotList && depotList.map(store =>
    <Select.Option value={store.id} key={store.id}>{store.depotName}</Select.Option>,
  );
  // 时间戳的转换
  const auditDateOn = moment(auditDate).format('YYYY-MM-DD  HH:mm:SS');
  disabledDate = (current) => {
    // Can not select days before today and today
    return current && current.valueOf() < moment().add(-1, 'days');
  }
  const statusList = {
    962: '待验收',
    967: '已验收',
  };
  return (
    <div className="components-search">
      <Breadcrumb separator=">">
        <Breadcrumb.Item>供应链</Breadcrumb.Item>
        <Breadcrumb.Item>门店进销存管理</Breadcrumb.Item>
        <Breadcrumb.Item>直运验收</Breadcrumb.Item>
        <Breadcrumb.Item>{{ view: '查看验收单', check: '验收直运单', create: '新增直运单' }[opType]}</Breadcrumb.Item>
      </Breadcrumb>
      <Form layout="inline">
        <Form.Item label="采购单号" >
          <span>{billNo}</span>
        </Form.Item>
        <Form.Item label="请购机构">
          <span>{storeName}</span>
        </Form.Item>
        <Form.Item label="供应商">
          <span>{busiName}</span>
        </Form.Item>
        <Form.Item label="状态" value={status}>
          <Tag color={{ 967: 'green', 962: 'blue' }[status]}>
            {statusList[status]}
          </Tag>
        </Form.Item>
        <Form.Item label="备注">
          <span>{remarks||"无备注"}</span>
        </Form.Item>
        {createUserName&&<Form.Item label="创建人">
          <span>{createUserName}</span>
        </Form.Item>}
        {createTime&&<Form.Item label="创建时间">
          <span>{createTime}</span>
        </Form.Item>}
        {arrivalDate && <Form.Item label="到货时间">
          <span>{moment(arrivalDate).format('YYYY-MM-DD HH:MM:SS')}</span>
        </Form.Item>}
        <Form.Item label="验收人" style={{ display: opType !== 'view' ? 'none' : '' }}>
          <span>{auditName}</span>
        </Form.Item>
        <Form.Item label="验收时间" style={{ display: opType !== 'view' ? 'none' : '' }}>
          <span>{auditDateOn === 'Invalid date' ? '' : auditDateOn}</span>
        </Form.Item>
        <Form.Item label="入库仓库" style={{ display: opType !== 'view' ? 'none' : '' }}>
          <span>{depotName}</span>
        </Form.Item>
        <Form.Item label="入库仓库" style={{ display: opType === 'view' ? 'none' : '' }}>
          {getFieldDecorator('depotId', {
            initialValue: initialDepotName,
            rules: [
              { required: true, message: '请选择入库仓库' },
            ],
          })(
            <Select
              style={{ width: 160 }}
              onChange={changeDepot}
              setFieldsValue={depotId}
            >
              {depotListAll}
            </Select>,
          )}
        </Form.Item>
      </Form>
    </div>
  );
};

export default Form.create()(DirectCheckDetailsFilter);
