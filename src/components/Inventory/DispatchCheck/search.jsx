import React, { PropTypes } from 'react';
import { Breadcrumb, Form, Select, Button, Radio, DatePicker, Input } from 'antd';
import moment from 'moment';

const Option = Select.Option;
const FormItem = Form.Item;

const DispatchCheckSearch = ({
  storeId, // 门店id
  changeStore, // 修改门店
  storeList, // 门店列表
  dispatchBillNo, // 配送出库单号
  changeDispatchBillNo, // 修改配送出库单号
  dispatchStatus, // 验收状态
  changeDispatchStatus, // 改变验收状态
  billNo, // 配送单号
  changeBillNo, // 修改配送单号
  filterDataRange, // 单号创建日期
  changeFilterDataRange, // 修改单号创建日期
  filterDispatchCheck, // 点击搜索
  form: {
    getFieldDecorator, // 用于和表单进行双向绑定
  },
  // disabledDate, // 控制时间选择
}) => {
  // 控制时间选择
  // disabledDate = (current) => {
  //   return (moment(current).isAfter(moment().valueOf()));
  // };
  // 门店
  const storeOptions = storeList && storeList.map(store =>
    <Option value={store.id} key={store.id}>{store.name}</Option>,
  );
  return (
    <div className="components-search dispatchCheck">
      <Breadcrumb separator=">">
        <Breadcrumb.Item>供应链</Breadcrumb.Item>
        <Breadcrumb.Item>门店进销存管理</Breadcrumb.Item>
        <Breadcrumb.Item>配送验收</Breadcrumb.Item>
      </Breadcrumb>
      <div className="shop-select">
        <Form layout="inline" >
          <FormItem label="门店名称">
            {getFieldDecorator('shopName', {
              initialValue: storeId || '请选择门店名称',
            })(
              <Select
                style={{ width: 160 }}
                onChange={changeStore}
              >
                {storeOptions}
              </Select>)}
          </FormItem>
        </Form>
      </div>
      <Form layout="inline" style={!storeId ? { display: 'none' } : {}}>
        <FormItem label="配送出库单号">
          <Input style={{ width: 160 }} value={dispatchBillNo} onChange={changeDispatchBillNo} placeholder="请输入单号" />
        </FormItem>
        <FormItem label="验收状态">
          <Radio.Group value={dispatchStatus} onChange={changeDispatchStatus}>
            <Radio.Button value={'0'}>待验收</Radio.Button>
            <Radio.Button value={'1'}>已验收</Radio.Button>
            <Radio.Button value="">全部</Radio.Button>
          </Radio.Group>
        </FormItem>
        <FormItem label="配送单号">
          <Input style={{ width: 160 }} value={billNo} onChange={changeBillNo} placeholder="请输入单号" />
        </FormItem>
        <FormItem label="单号创建日期">
          <DatePicker.RangePicker
            allowClear={false} // 日期不可清空
            format="YYYY-MM-DD"
            value={filterDataRange}
            onChange={changeFilterDataRange}
            renderExtraFooter={() =>
              <div style={{ textAlign: 'center', color: '#bfbfbf' }}>
                请点选两个时间以确定一个时间范围
              </div>
            }
            ranges={{ // 预设时间范围快捷选择
              '前1月': [moment().subtract(1, 'month'), moment()],
              '前15天': [moment().subtract(15, 'day'), moment()],
              '前7天': [moment().subtract(7, 'day'), moment()],
              '前3天': [moment().subtract(3, 'day'), moment()],
              '今日': [moment(), moment()],
            }}
          />
        </FormItem>
        <FormItem>
          <Button type="primary" onClick={filterDispatchCheck}>搜索</Button>
        </FormItem>
      </Form>
    </div>
  );
};
DispatchCheckSearch.PropTypes = {
  dispatchStatus: PropTypes.string,
  filterDataRange: PropTypes.array,
  dispatchBillNo: PropTypes.string,
  storeId: PropTypes.string,
  changeStore: PropTypes.func,
  changeDispatchStatus: PropTypes.func,
  changeFilterDataRange: PropTypes.func,
  changeSupplier: PropTypes.func,
  changeDispatchBillNo: PropTypes.func,
  filterDispatchCheck: PropTypes.func,
  billNo: PropTypes.string,
  changeBillNo: PropTypes.func,
};
// export default DispatchCheckSearch;
export default Form.create()(DispatchCheckSearch);
