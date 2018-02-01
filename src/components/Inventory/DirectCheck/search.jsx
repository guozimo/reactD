import React, { PropTypes } from 'react';
import { Breadcrumb, Form, Select, Button, Radio, DatePicker, Input } from 'antd';
import moment from 'moment';

const DirectCheckSearch = ({
  // model state
  storeId,
  changeStore,
  selectStore,
  storeList,
  onCreate,
  supplierList, // 供应商
  hasAutoSelected,
  form: {
    getFieldDecorator,
    validateFields,
  },
  filterStatus,
  filterDataRange,
  busiId,
  filterBillNo,
  disabledDate, // 控制时间选择
  // 模型方法
  changeFilterStatus,
  changeFilterDataRange,
  changeSupplier,
  changeFilterBillNo,
  filterDirectCheck,
}) => {
  clearTimeout(window.timefun_directCheck);
  // 控制时间选择
  // disabledDate = (current) => {
  //   return (moment(current).isAfter(moment().valueOf()));
  // };
  // console.log("storeId in search",storeId);
  changeStore = (value) => {
    selectStore(value);
  };
  const supplierListAll = supplierList.length && supplierList.map(store => <Option value={store.id} key={store.id}>{store.suppName}</Option>);
  const storeOptions = storeList && storeList.map(store => <Select.Option value={store.id} key={store.id}>{store.name}</Select.Option>);
  window.timefun_directCheck = setTimeout(() => {
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
        <Breadcrumb.Item>直运验收</Breadcrumb.Item>
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
      </div>
      <Form layout="inline" style={!storeId ? { display: 'none' } : {}}>
        <Form.Item label="采购单号">
          <Input style={{ width: 160 }} value={filterBillNo} onChange={changeFilterBillNo} placeholder="请输入编号" />
        </Form.Item>
        <Form.Item label="验收状态">
          <Radio.Group value={filterStatus} onChange={changeFilterStatus}>
            <Radio.Button value="962">待验收</Radio.Button>
            <Radio.Button value="967">已验收</Radio.Button>
            <Radio.Button value="">全部</Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="供应商">
          <Select style={{ width: 160 }} value={busiId} onChange={changeSupplier} placeholder="请选择供应商">
            <Select.Option value="" key="">请选择</Select.Option>
            {supplierListAll}
          </Select>
        </Form.Item>
        <Form.Item label="单据日期">
          <DatePicker.RangePicker
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
        <Form.Item>
          <Button type="primary" onClick={filterDirectCheck}>搜索</Button>
        </Form.Item>
      </Form>
    </div>
  );
};
DirectCheckSearch.PropTypes = {
  filterStatus: PropTypes.string,
  filterDataRange: PropTypes.array,
  busiId: PropTypes.string,
  filterBillNo: PropTypes.string,
  onCreate: PropTypes.func,
  storeId: PropTypes.string,
  changeStore: PropTypes.func,
  selectStore: PropTypes.func,
  changeFilterStatus: PropTypes.func,
  changeFilterDataRange: PropTypes.func,
  changeSupplier: PropTypes.func,
  changeFilterBillNo: PropTypes.func,
  filterDirectCheck: PropTypes.func,
};
// export default DirectCheckSearch;
export default Form.create()(DirectCheckSearch);
