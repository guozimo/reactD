import { Breadcrumb, Form, Select, Button, TreeSelect, DatePicker, Input, Spin, Radio } from 'antd';
import React from 'react';
import moment from 'moment';

const OutDistribution = ({
  testId,
  storeId,
  storeList,
  searchList,
  form: {
    getFieldDecorator,
  },

  // 方法
    changeStore, // 改变
    upadateId,
    filterRequisition,  // 查询
    searchAgency, // 查询收货机构
}) => {
  // console.log('searchList',searchList);
  // 获取门店下拉菜单的值
  const storeOptions = storeList.length && storeList.map(store => <Select.Option value={store.id} key={store.id}>{store.name}</Select.Option>);
  // 获取仓库
  const depotListAll = searchList.warehouseList.length && searchList.warehouseList.map(store => <Select.Option value={store.id} key={store.id}>{store.depotName}</Select.Option>);
  // 获取供应商
  const orderStateList = searchList.orderStateList.length && searchList.orderStateList.map(store => <Select.Option value={store.id} key={store.id}>{store.statsName}</Select.Option>);
  // 收货机构
  const inOrgList = searchList.inOrgList.length && searchList.inOrgList.map(store => <Select.Option value={store.id} key={store.id}>{store.name}</Select.Option>);
  const disabledDate = (current) => {
    // Can not select days before today and today
    return current && current.valueOf() > moment().add(0, 'day');
  }
  return (
    <div className="components-search">
      <Breadcrumb separator=">">
        <Breadcrumb.Item>供应链</Breadcrumb.Item>
        <Breadcrumb.Item>集团总部管理</Breadcrumb.Item>
        <Breadcrumb.Item>配送出库</Breadcrumb.Item>
      </Breadcrumb>
      <div className="shop-select">
        <Form layout="inline" >
          <Form.Item label="机构名称">
            {getFieldDecorator('shopName', {
              initialValue: storeId || '请选择机构名称',
            })(
              <Select
                style={{ width: 160 }}
                onChange={changeStore} >
                {storeOptions}
              </Select>)}
          </Form.Item>
        </Form>
      </div>
      <Form layout="inline" style={!storeId ? { display: 'none'} : {}}>

        <Form.Item label="出库仓库">
          <Select style={{ width: 160 }} value={searchList.warehouseId} onChange={(value) => upadateId(value, "warehouseId")} placeholder="请选择仓库">
            <Select.Option value="" key="">请选择仓库</Select.Option>
            {depotListAll}
          </Select>
        </Form.Item>
        <Form.Item label="收货机构">
          <Select
            style={{ width: 160 }}
            placeholder="请选择收货机构"
            setFieldsValue={storeId}
            showSearch
            filterOption={false}
            allowClear={true}
            value={searchList.inOrg ? searchList.inOrg : <span>请选择机构</span>}
            notFoundContent={inOrgList.length ? <Spin size="small" /> : <span>暂无数据</span>}
            onChange={(value) => upadateId(value, 'inOrg')}
            onSearch={value => searchAgency(value)}
          >
            {inOrgList}
          </Select>
        </Form.Item>
        <Form.Item label="配送单号">

          <Input style={{ width: 160 }} value={searchList.distributionOrderId}  onChange={(value) => upadateId(value.target.value, 'distributionOrderId')}  placeholder="请输入配送订单号"/>
        </Form.Item>
        <Form.Item label="提交日期">
          <DatePicker.RangePicker
            allowClear={false}
            format="YYYY-MM-DD"
            disabledDate={disabledDate || null}
            value={searchList.sendFilterDataRange}
            // defaultValue={[moment(),moment()]}
            onChange={(dates, dateStrings) => upadateId(dates, 'sendFilterDataRange')}
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
        <Form.Item label="出库日期">
          <DatePicker.RangePicker
            allowClear={false}
            format="YYYY-MM-DD"
            // disabledDate={disabledDate || null}
            // defaultValue={[moment(),moment()]}
            value={searchList.outilterDataRange}
            renderExtraFooter={() => <div style={{ textAlign: 'center', color: '#bfbfbf' }}>请点选两个时间以确定一个时间范围</div>}
            onChange={(dates, dateStrings) => upadateId(dates, 'outilterDataRange')}
            ranges={{
              '前1月': [moment().subtract(1, 'month'), moment()],
              '前15天': [moment().subtract(15, 'day'), moment()],
              '前7天': [moment().subtract(7, 'day'), moment()],
              '前3天': [moment().subtract(3, 'day'), moment()],
              '今天': [moment(), moment()],
            }}
           />
        </Form.Item>
        <Form.Item label="订单状态">
          <Radio.Group value={searchList.orderStateId} onChange={(value) => upadateId(value.target.value, "orderStateId")}>
            <Radio.Button value="968" >待出库</Radio.Button>
            <Radio.Button value="969" >部分出库</Radio.Button>
            <Radio.Button value="970" >已出库</Radio.Button>
            <Radio.Button value="" >全部</Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item>
          <Button type="primary" style={{ marginLeft: 0 }} onClick={filterRequisition}>查询</Button>
        </Form.Item>
      </Form>
    </div>
  )
}
OutDistribution.PropTypes = {

};
export default Form.create()(OutDistribution);
