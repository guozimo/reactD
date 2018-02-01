import React, { PropTypes } from 'react';
import { Breadcrumb, Form, Tag, Select } from 'antd';
import moment from 'moment';

const FormItem = Form.Item;
const Option = Select.Option;

const DispatchCheckDetailsFilter = ({
  form: {
    getFieldDecorator, // 用于和表单进行双向绑定
  },
  billNo, // 配送单号
  opType, // 查看or验收
  storeName, // 请购门店
  createTime, // 验收时间
  depotName, // 出库仓库
  inDepotName, // 入库仓库
  dispatchOutNo, // 配送出库单号
  auditStatus, // 验收状态
  distribName, // 配送中心
  orderDate, // 单号创建日期
  depotId, // 入库仓库id
  depotList, // 入库仓库列表
  initialDepotName, // 入库仓库初始值
  changeDepot, // 修改入库仓库
  auditUser, // 验收人
}) => {
  // 入库仓库列表
  const depotListAll = depotList && depotList.map(store =>
    <Option value={store.id} key={store.id}>{store.depotName}</Option>,
  );
  // 时间戳的转换
  const orderDateOn = moment(orderDate).format('YYYY-MM-DD');
  return (
    <div className="components-search">
      <Breadcrumb separator=">">
        <Breadcrumb.Item>供应链</Breadcrumb.Item>
        <Breadcrumb.Item>门店进销存管理</Breadcrumb.Item>
        <Breadcrumb.Item>配送验收</Breadcrumb.Item>
        <Breadcrumb.Item>{{ view: '查看配送单', check: '验收配送单' }[opType]}</Breadcrumb.Item>
      </Breadcrumb>
      { opType === 'view' &&
        <Form layout="inline">
          <FormItem label="配送单号">
            {billNo}
          </FormItem>
          <FormItem label="请购门店">
            {storeName}
          </FormItem>
          <FormItem label="入库仓库">
            {inDepotName}
          </FormItem>
          <FormItem label="出库仓库">
            {depotName}
          </FormItem>
          <FormItem label="配送中心">
            {distribName}
          </FormItem>
          <FormItem label="验收时间">
            {createTime === 'Invalid date' ? '' : createTime}
          </FormItem>
          <FormItem label="验收状态">
            <Tag color={{ 1: 'green', 0: 'blue' }[auditStatus]}>
              {{ 1: '已验收', 0: '待验收' }[auditStatus]}
            </Tag>
          </FormItem>
          <FormItem label="验收人">
            {auditUser}
          </FormItem>
        </Form>
      }
      { opType === 'check' &&
        <Form layout="inline" className="dispatchCheck">
          <FormItem label="配送出库单号">
            {dispatchOutNo}
          </FormItem>
          <FormItem label="请购门店">
            {storeName}
          </FormItem>
          <FormItem label="配送中心">
            {distribName}
          </FormItem>
          <FormItem label="配送单号">
            {billNo}
          </FormItem>
          <FormItem label="出库仓库">
            {depotName}
          </FormItem>
          <FormItem label="单号创建日期">
            {orderDateOn === 'Invalid date' ? '' : orderDateOn}
          </FormItem>
          <FormItem label="验收状态">
            <Tag color={{ 1: 'green', 0: 'blue' }[auditStatus]}>
              {{ 1: '已验收', 0: '待验收' }[auditStatus]}
            </Tag>
          </FormItem>
          <FormItem label="入库仓库">
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
          </FormItem>
        </Form>
      }
    </div>
  );
};

DispatchCheckDetailsFilter.propTypes = {
  changeDepot: PropTypes.func,
};

export default Form.create()(DispatchCheckDetailsFilter);
