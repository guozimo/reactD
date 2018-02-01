import React, { PropTypes } from 'react';
import { Breadcrumb, Form, Select, Button, Radio, DatePicker, Input } from 'antd';
import moment from 'moment';

const OrderLibSearch = ({
  menuData,
  // model state
  orgId,
  storeId,
  selectOrg,
  selectStore,
  orgList,
  storeList,
  onGenerate,
  form: {
    getFieldDecorator,
    validateFields,
  },
  filterStatus,
  filterDataRange,
  filterOpterName,
  filterBillNo,
  selectedRows,
  // 模型方法
  changeFilterStatus,
  changeFilterDataRange,
  changeFilterOpterName,
  changeFilterBillNo,
  enterFilterBillNo, // 订单中心号回车调用根据请购单号搜索方法
  filterOrderLib,
  // 私有变量
  pageData,
  // 私有方法
  changeOrg,
  changeStore,
  disabledDate,
}) => {
  changeOrg = (value) => { selectOrg(value); };
  changeStore = (value) => { selectStore(value); };
  disabledDate = (current) => {
    return (moment(current).isAfter(moment().valueOf()));
  };
  const orgOptions = orgList && orgList.map(org => <Select.Option value={org.id} key={org.id}>{org.name}</Select.Option>);
  const storeOptions = storeList && storeList.map(store => <Select.Option value={store.id} key={store.id}>{store.name}</Select.Option>);
  return (
    <div className="components-search">
      <Breadcrumb separator=">">
        <Breadcrumb.Item>供应链</Breadcrumb.Item>
        <Breadcrumb.Item>集团总部管理</Breadcrumb.Item>
        <Breadcrumb.Item>订单中心</Breadcrumb.Item>
      </Breadcrumb>
      <div className="shop-select">
        <Form layout="inline" >
          <Form.Item label="机构名称">
            {getFieldDecorator('shopName', { initialValue: orgId || '请选择机构' })(
              <Select style={{ width: 160 }} onChange={changeOrg} >
                {orgOptions}
              </Select>
            )}
          </Form.Item>
        </Form>
        {orgId && menuData['list'].hasOwnProperty('61500101') && <div className="right-act"><Button onClick={onGenerate} type="primary" disabled={selectedRows.length <= 0}>一键生成订单</Button></div>}
      </div>
      <Form layout="inline" style={!orgId ? { display: 'none' } : {}}>
        <Form.Item label="门店名称">
          {getFieldDecorator('storeId', { initialValue: storeId || '请选择门店' })(
            <Select style={{ width: 160 }} setFieldsValue={storeId} onChange={changeStore}>
              {storeOptions}
            </Select>
          )}
        </Form.Item>
        <Form.Item label="请购单号">
          <Input style={{ width: 160 }} value={filterBillNo} onChange={changeFilterBillNo} onPressEnter={enterFilterBillNo} placeholder="请输入编号" />
        </Form.Item>
        <Form.Item label="状态">
          <Radio.Group value={filterStatus} onChange={changeFilterStatus}>
            <Radio.Button value="965">待处理</Radio.Button>
            <Radio.Button value="962">已完成</Radio.Button>
            <Radio.Button value="">全部</Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="请购日期">
          <DatePicker.RangePicker
            allowClear={false}
            format="YYYY-MM-DD"
            value={filterDataRange}
            // disabledDate={disabledDate}
            onChange={changeFilterDataRange}
            renderExtraFooter={() => <div style={{ textAlign: 'center', color: '#bfbfbf' }}>请点选两个时间以确定一个时间范围</div>}
            ranges={{
              '前1月': [moment().subtract(1, 'month'), moment()],
              '前15天': [moment().subtract(15, 'day'), moment()],
              '前7天': [moment().subtract(7, 'day'), moment()],
              '前3天': [moment().subtract(3, 'day'), moment()],
              '今天': [moment(), moment()],
            }}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={filterOrderLib}>搜索</Button>
        </Form.Item>
      </Form>
    </div>
  );
};
OrderLibSearch.PropTypes = {
  filterStatus: PropTypes.string,
  filterDataRange: PropTypes.array,
  filterOpterName: PropTypes.string,
  filterBillNo: PropTypes.string,
  onGenerate: PropTypes.func,
  storeId: PropTypes.string,
  changeOrg: PropTypes.func,
  selectOrg: PropTypes.func,
  changeFilterStatus: PropTypes.func,
  changeFilterDataRange: PropTypes.func,
  changeFilterOpterName: PropTypes.func,
  changeFilterBillNo: PropTypes.func,
  enterFilterBillNo: PropTypes.func,
  filterOrderLib: PropTypes.func,
};
// export default OrderLibSearch;
export default Form.create()(OrderLibSearch);
