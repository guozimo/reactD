import React, { PropTypes } from 'react';
import { Breadcrumb, Form, Select, Button, Radio, DatePicker, Input, Tooltip } from 'antd';
import moment from 'moment';
import INVENTORY_PERMISSION from '../../common/Permission/inventoryPermission';
import Permission from '../../common/Permission/Permission.jsx';

const PriceListSearch = ({
  // model state
  orgId,
  storeId,
  changeStore,
  selectOrg,
  selectStore,
  orgList,
  storeList,
  onCreate,
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
  filterPriceList,

  // 私有方法
  changeOrg,

  // 私有变量
  pageData,
}) => {
  // console.log("storeId in search",storeId);
  changeStore = (value) => {
    selectStore(value);
  };
  changeOrg = (value) => { selectOrg(value); };
  const orgOptions = orgList && orgList.map(org => <Select.Option value={org.id} key={org.id}>{org.name}</Select.Option>);
  const storeOptions = storeList && storeList.map(store => <Select.Option value={store.id} key={store.id}>{store.name}</Select.Option>);
  const disabledDate = (current) => {
    // Can not select days before today and today
    return current && current.valueOf() > moment().add(0, 'day');
  }
  return (
    <div className="components-search">
      <Breadcrumb separator=">">
        <Breadcrumb.Item>供应链</Breadcrumb.Item>
        <Breadcrumb.Item>集团总部管理</Breadcrumb.Item>
        <Breadcrumb.Item>配送售价单</Breadcrumb.Item>
      </Breadcrumb>
      <div className="shop-select">
        <Form layout="inline" >
        <Form.Item label="机构名称">
          {getFieldDecorator('shopName', { initialValue: orgId || '请选择机构名称' })(
            <Select style={{ width: 160 }} onChange={changeOrg} >
              {orgOptions}
            </Select>
          )}
        </Form.Item>
        </Form>
        {orgId &&
          <Permission path={INVENTORY_PERMISSION.PRICE_LIST.CREATE}>
            <div className="right-act"><Button type="primary" icon="plus" onClick={onCreate}>新增配送售价</Button></div>
          </Permission>
        }
      </div>
      <Form layout="inline" style={!orgId ? { display: 'none' } : {}}>
        <Form.Item label="单据编号">
          <Input style={{ width: 160 }} value={filterBillNo} onChange={changeFilterBillNo} placeholder="请输入单据编号" />
        </Form.Item>
        <Form.Item label="操作日期">
          <DatePicker.RangePicker
            allowClear={false}
            format="YYYY-MM-DD"
            value={filterDataRange}
            onChange={changeFilterDataRange}
            disabledDate={disabledDate || null}
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
        {/* <Form.Item label="操作人">
          <Input style={{ width: 160 }} value={filterOpterName} onChange={changeFilterOpterName} placeholder="操作人关键字"/>
        </Form.Item> */}
        <Form.Item label="单据状态">
          <Radio.Group value={filterStatus} onChange={changeFilterStatus}>
            <Radio.Button value="962">已审核</Radio.Button>
            <Radio.Button value="961">待审核</Radio.Button>
            <Radio.Button value="960">已作废</Radio.Button>
            <Radio.Button value="">全部</Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={filterPriceList}>搜索</Button>
           &nbsp;&nbsp;&nbsp;&nbsp;
        </Form.Item>
      </Form>
    </div>
  );
};
PriceListSearch.PropTypes = {
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
  filterPriceList: PropTypes.func,
};
// export default PriceListSearch;
export default Form.create()(PriceListSearch);
