import React, { PropTypes } from 'react';
import { Breadcrumb, Form, Select, Button, Radio, DatePicker, Input, Tooltip } from 'antd';
import moment from 'moment';

const RequisitionSearch = ({
  menuData,
  // model state
  storeId,
  changeStore,
  selectStore,
  storeList,
  onCreate,
  hasDeliveryCenter,
  hasAutoSelected,
  form: {
    getFieldDecorator,
    validateFields,
  },
  filterStatus,
  filterDataRange,
  filterOpterName,
  filterBillNo,

  // 模型方法
  changeFilterStatus,
  changeFilterDataRange,
  changeFilterOpterName,
  changeFilterBillNo,
  filterRequisition,

  // 私有方法

  // 私有变量
  pageData,
}) => {
  clearTimeout(window.timefun_requisition);
  // console.log("storeId in search",storeId);
  changeStore = (value) => {
    selectStore(value);
  };
  const storeOptions = storeList && storeList.map(store => <Select.Option value={store.id} key={store.id}>{store.name}</Select.Option>);
  window.timefun_requisition = setTimeout(() => {
    console.log('setTimeout', storeList);
    // hasAutoSelected: false, 默认false标示没有设置过，否则设置过的话在只有一个机构自动选中后不再进入选中项之后的流程
    if (storeList.length === 1 && hasAutoSelected === false) {
      selectStore(storeList[0].id);
    }
  }, 1000);
  return (
    <div className="components-search">
      <Breadcrumb separator=">">
        <Breadcrumb.Item>供应链</Breadcrumb.Item>
        <Breadcrumb.Item>门店进销存管理</Breadcrumb.Item>
        <Breadcrumb.Item>门店请购</Breadcrumb.Item>
      </Breadcrumb>
      <div className="shop-select">
        <Form layout="inline" >
          <Form.Item label="门店名称">
            {getFieldDecorator('shopName', {
              initialValue: storeId || '请选择门店名称',
            })(
              <Select
                style={{ width: 160 }}
                onChange={changeStore}
              >
                {storeOptions}
              </Select>)}
          </Form.Item>
        </Form>
        {storeId && menuData['list'].hasOwnProperty('61400101') && <div className="right-act">
          <Tooltip placement="left" title={!hasDeliveryCenter && '无配送中心，本功能暂不可用！'}>
            <Button type="primary" icon="plus" disabled={!hasDeliveryCenter} onClick={onCreate}>新增请购单</Button>
          </Tooltip>
        </div>}
      </div>
      <Form layout="inline" style={!storeId ? { display: 'none' } : {}}>
        <Form.Item label="请购单号">
          <Input style={{ width: 160 }} value={filterBillNo} onChange={changeFilterBillNo} placeholder="请输入编号" />
        </Form.Item>
        <Form.Item label="请购日期">
          <DatePicker.RangePicker
            allowClear={false}
            format="YYYY-MM-DD"
            value={filterDataRange}
            onChange={changeFilterDataRange}
            renderExtraFooter={() => <div style={{ textAlign: 'center', color: '#bfbfbf' }}>请点选两个时间以确定一个时间范围</div>}
            ranges={{ // 预设时间范围快捷选择
              '前1月': [moment().subtract(1, 'month'), moment()],
              '前15天': [moment().subtract(15, 'day'), moment()],
              '前7天': [moment().subtract(7, 'day'), moment()],
              '前3天': [moment().subtract(3, 'day'), moment()],
              '今日': [moment(), moment()],
            }}
          />
        </Form.Item>
        {/* <Form.Item label="操作人">
          <Input style={{ width: 160 }} value={filterOpterName} onChange={changeFilterOpterName} placeholder="操作人关键字"/>
        </Form.Item> */}
        <Form.Item label="订单状态">
          <Radio.Group value={filterStatus} onChange={changeFilterStatus}>
            <Radio.Button value="964">待处理</Radio.Button>
            <Radio.Button value="965">已提交</Radio.Button>
            <Radio.Button value="962">已完成</Radio.Button>
            <Radio.Button value="">全部</Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={filterRequisition}>搜索</Button>
           &nbsp;&nbsp;&nbsp;&nbsp;
        </Form.Item>
      </Form>
    </div>
  );
};
RequisitionSearch.PropTypes = {
  filterStatus: PropTypes.string,
  filterDataRange: PropTypes.array,
  filterOpterName: PropTypes.string,
  filterBillNo: PropTypes.string,
  onCreate: PropTypes.func,
  storeId: PropTypes.string,
  changeStore: PropTypes.func,
  selectStore: PropTypes.func,
  changeFilterStatus: PropTypes.func,
  changeFilterDataRange: PropTypes.func,
  changeFilterOpterName: PropTypes.func,
  changeFilterBillNo: PropTypes.func,
  filterRequisition: PropTypes.func,
};
// export default RequisitionSearch;
export default Form.create()(RequisitionSearch);
