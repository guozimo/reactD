import React, { PropTypes } from 'react';
import { Breadcrumb, Form, Select, Button, Radio, DatePicker, Input } from 'antd';
import moment from 'moment';
import INVENTORY_PERMISSION from '../../common/Permission/inventoryPermission';
import Permission from '../../common/Permission/Permission';

const RequisitionSearch = ({
  // model state
  storeId,
  changeStore,
  selectStore,
  storeList,
  depotCannList, // 出入库
  onCreate,
  form: {
    getFieldDecorator,
    validateFields,
  },
  filterStatus,
  filterDataRange,  // 采购日期
  filterBillNo,  // 编号
  outNewDepotId, // 调出仓库ID
  inNewDepotId, // 调入仓库ID

  // 模型方法
  changeFilterStatus,  // 修改状态
  changeFilterDataRange,  // 修改采购日期
  changeFilterOpterName, //
  changeFilterBillNo, // 修改编号
  filterRequisition,
  upadateOutDepot, // 出库
  upadateInDepot, // 入库

  // 私有方法

  // 私有变量
  pageData,
}) => {
  // console.log("storeId in outNewDepotId", outNewDepotId);
  changeStore = (value) => {
    selectStore(value);
  };
  const storeOptions = storeList && storeList.map(store => <Select.Option value={store.id} key={store.id}>{store.name}</Select.Option>);
  const depotListAll = depotCannList && depotCannList.map(store => <Select.Option value={store.id} key={store.id}>{store.depotName}</Select.Option>);
  return (
    <div className="components-search">
      <Breadcrumb separator=">">
        <Breadcrumb.Item>供应链</Breadcrumb.Item>
        <Breadcrumb.Item>集团总部管理</Breadcrumb.Item>
        <Breadcrumb.Item>调拨管理</Breadcrumb.Item>
      </Breadcrumb>
      <div className="shop-select">
        <Form layout="inline" >
          <Form.Item label="机构名称">
            {getFieldDecorator('shopName', {
              initialValue: storeId || '请选择机构名称',
            })(
              <Select
                style={{ width: 160 }}
                onChange={changeStore}
              >
                {storeOptions}
              </Select>)}
          </Form.Item>
            {storeId && <Permission path={INVENTORY_PERMISSION.CANN_MANAGE.ADD}>
              <div className="right-act"><Button type="primary" icon="plus" onClick={onCreate}>新增调拨单</Button></div>
            </Permission>
              }
        </Form>

      </div>
      <Form layout="inline" style={!storeId ? { display: 'none'} : {}}>
        <Form.Item label="调拨单号">
          <Input style={{ width: 160 }} value={filterBillNo} onChange={changeFilterBillNo} placeholder="请输入调拨单号" />
        </Form.Item>
        <Form.Item label="调拨时间">
          <DatePicker.RangePicker
            format="YYYY-MM-DD"
            value={filterDataRange}
            allowClear={false}
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
        <Form.Item label="调出库">
          <Select style={{ width: 160 }} value={outNewDepotId} onChange={upadateOutDepot} placeholder="请选择类型">
            <Select.Option value="" key="">请选择</Select.Option>
            {depotListAll}
          </Select>
        </Form.Item>
        <Form.Item label="调入库">
          <Select style={{ width: 160 }} value={inNewDepotId} onChange={upadateInDepot} placeholder="请选择类型">
            <Select.Option value="" key="">请选择</Select.Option>
            {depotListAll}
          </Select>
        </Form.Item>
        <Form.Item label="订单状态">
          <Radio.Group value={filterStatus} onChange={changeFilterStatus}>
            <Radio.Button value="961">未完成</Radio.Button>
            <Radio.Button value="962">已完成</Radio.Button>
            <Radio.Button value="">全部</Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item>
          <Button type="primary" style={{ marginLeft: 38 }} onClick={filterRequisition}>搜索</Button>

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
