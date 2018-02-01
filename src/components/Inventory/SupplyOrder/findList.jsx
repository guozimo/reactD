import React, { PropTypes } from 'react';
import { Form, Input, Table, Button, Tooltip, Select, Breadcrumb } from 'antd';
import moment from 'moment';

const Option = Select.Option;
const FormItem = Form.Item;

const findListAll = ({
  loading,
  findList,
  storeId,
  goBack,
  storeList,
  busiList,
  closeUpdate,
  onClose,
}) => {
 //  {
 //   title: '调整数量',
 //   dataIndex: 'ordAdjustNum',
 //   width: 80,
 //   key: 'ordAdjustNum',
 // },
  const columns = [
    {
      title: '',
      dataIndex: 'key',
      key: 'key',
      fixed: 'left',
      render: (text, record, index) => (parseInt(index) + 1),
    }, {
      title: '物资编码',
      dataIndex: 'goodsCode',
      key: 'goodsCode',
      width: 80,
      fixed: 'left',
    }, {
      title: '物资名称',
      width: 80,
      dataIndex: 'goodsName',
      key: 'goodsName',
      fixed: 'left',
    }, {
      title: '规格',
      width: 60,
      dataIndex: 'goodsSpec',
      key: 'goodsSpec',
    },
    {
      title: '采购',
      children: [{
        title: '数量',
        dataIndex: 'ordUnitNum',
        width: 80,
        key: 'ordUnitNum',
      }, {
        title: '单位',
        dataIndex: 'ordUnitName',
        width: 80,
        key: 'ordUnitName',
      }, {
        title: '单价',
        dataIndex: 'ordPrice',
        width: 80,
        key: 'ordPrice',
      }, {
        title: '金额',
        dataIndex: 'goodsAmt',
        width: 80,
        key: 'goodsAmt',
        render: text => text && text !== '0' ? Number(text).toFixed(2) : text,
      }],
      dataIndex: 'stock',
      key: '2',
    }, {
      title: '标准',
      children: [{
        title: '数量',
        dataIndex: 'unitNum',
        width: 80,
        key: 'unitNum',
        render: text => text && text !== '0' ? Number(text).toFixed(2) : text,
      }, {
        title: '单位',
        dataIndex: 'unitName',
        width: 80,
        key: 'unitName',
      }],
      dataIndex: 'stock',
      key: '2',
    }, {
      title: '辅助',
      children: [{
        title: '数量',
        dataIndex: 'dualUnitNum',
        width: 80,
        key: 'dualUnitNum',
        render: (text, record) => (record.dualUnitFlag == '1') ? text : '',
      }, {
        title: '单位',
        dataIndex: 'dualUnitName',
        width: 80,
        key: 'dualUnitName',
      }],
      dataIndex: 'stock',
      key: '2',
    }, {
      title: '税率',
      dataIndex: 'taxRatio',
      width: 80,
      key: 'taxRatio',
    }, {
      title: '不含税',
      children: [{
        title: '单价',
        dataIndex: 'ordPriceNotax',
        width: 80,
        key: 'ordPriceNotax',
        render: text => text && text !== '0' ? Number(text).toFixed(2) : text,
      }, {
        title: '金额',
        dataIndex: 'goodsAmtNotax',
        width: 80,
        key: 'goodsAmtNotax',
        render: text => text && text !== '0' ? Number(text).toFixed(2) : text,
      }],
      dataIndex: 'stock',
      key: '2',
    }, {
      title: '备注',
      dataIndex: 'remarks',
      width: 150,
      key: 'remarks',
      render: text => <Tooltip placement="leftTop" title={text}>
        <div className="ellipsed-line width-150">{text}</div>
      </Tooltip>
    }];
  const columnsUpdate = [
    {
      title: '',
      dataIndex: 'key',
      key: 'key',
      fixed: 'left',
      render: (text, record, index) => (parseInt(index) + 1),
    }, {
      title: '物资编码',
      dataIndex: 'goodsCode',
      key: 'goodsCode',
      width: 80,
      fixed: 'left',
    }, {
      title: '物资名称',
      width: 80,
      dataIndex: 'goodsName',
      key: 'goodsName',
      fixed: 'left',
    }, {
      title: '规格',
      width: 60,
      dataIndex: 'goodsSpec',
      key: 'goodsSpec',
    },
    {
      title: '订货',
      children: [{
        title: '数量',
        dataIndex: 'purcUnitNum',
        width: 80,
        key: 'purcUnitNum',
      }, {
        title: '单位',
        dataIndex: 'purcUnitName',
        width: 80,
        key: 'purcUnitName',
      }],
      dataIndex: 'stock',
      key: '2',
    },
    {
      title: '采购',
      children: [{
        title: '数量',
        dataIndex: 'ordUnitNum',
        width: 80,
        key: 'ordUnitNum',
      }, {
        title: '单位',
        dataIndex: 'ordUnitName',
        width: 80,
        key: 'ordUnitName',
      }, {
        title: '单价',
        dataIndex: 'ordPrice',
        width: 80,
        key: 'ordPrice',
      }, {
        title: '金额',
        dataIndex: 'goodsAmt',
        width: 80,
        key: 'goodsAmt',
        render: text => text && text !== '0' ? Number(text).toFixed(2) : text,
      }],
      dataIndex: 'stock',
      key: '2',
    }, {
      title: '标准',
      children: [{
        title: '数量',
        dataIndex: 'unitNum',
        width: 80,
        key: 'unitNum',
        render: text => text && text !== '0' ? Number(text).toFixed(2) : text,
      }, {
        title: '单位',
        dataIndex: 'unitName',
        width: 80,
        key: 'unitName',
      }],
      dataIndex: 'stock',
      key: '2',
    }, {
      title: '辅助',
      children: [{
        title: '数量',
        dataIndex: 'dualUnitNum',
        width: 80,
        key: 'dualUnitNum',
        render: (text, record) => (parseInt(record.dualUnitFlag, 10) === 1) ? text : '',
      }, {
        title: '单位',
        dataIndex: 'dualUnitName',
        width: 80,
        key: 'dualUnitName',
      }],
      dataIndex: 'stock',
      key: '2',
    }, {
      title: '税率',
      dataIndex: 'taxRatio',
      width: 80,
      key: 'taxRatio',
    }, {
      title: '不含税',
      children: [{
        title: '单价',
        dataIndex: 'ordPriceNotax',
        width: 80,
        key: 'ordPriceNotax',
        render: text => text && text !== '0' ? Number(text).toFixed(2) : text,
      }, {
        title: '金额',
        dataIndex: 'goodsAmtNotax',
        width: 80,
        key: 'goodsAmtNotax',
        render: text => text && text !== '0' ? Number(text).toFixed(2) : text,
      }],
      dataIndex: 'stock',
      key: '2',
    }, {
      title: '备注',
      dataIndex: 'remarks',
      width: 150,
      key: 'remarks',
      render: text => <Tooltip placement="leftTop" title={text}>
        <div className="ellipsed-line width-150">{text}</div>
      </Tooltip>
    }];
  const storeOptions = storeList && storeList.map(store => <Option value={store.id} key={store.id}>{store.name}</Option>);
  const busiListAll = busiList && busiList.map(store => <Option value={store.id} key={store.id}>{store.name}</Option>);

  return (
    <div className="components-search">
      <Breadcrumb separator=">">
        <Breadcrumb.Item>供应链</Breadcrumb.Item>
        <Breadcrumb.Item>集团总部管理</Breadcrumb.Item>
        <Breadcrumb.Item>直运采购</Breadcrumb.Item>
        <Breadcrumb.Item>查看订单</Breadcrumb.Item>
      </Breadcrumb>
      <Form layout="inline">
        <FormItem label="订单类型">
          <Input style={{ width: 160 }} value="直运" disabled placeholder="订单类型" />
        </FormItem>
        <FormItem label="采购订单">
          <Input style={{ width: 160 }} disabled value={findList.billNo} placeholder="" />
        </FormItem>
        <FormItem label="请购日期">
          <Input style={{ width: 160 }} disabled value={findList.bussDate} />
        </FormItem>
      </Form>
      <Form layout="inline">
        <FormItem label="收货机构">
          <Input style={{ width: 160 }} disabled value={findList.storeName} placeholder="" />
        </FormItem>
        <FormItem label="供应商">
          <Input style={{ width: 160 }} disabled value={findList.busiName} placeholder="" />
        </FormItem>
        <FormItem label="到货日期">
          <Input style={{ width: 160 }} disabled value={moment(findList.arrivalDate).format('YYYY-MM-DD')} placeholder="" />
        </FormItem>
        <FormItem label="备注">
          <Input style={{ width: 160 }} disabled value={findList.remarks} placeholder="" />
        </FormItem>
      </Form>
      <Table
        columns={findList.billSource && findList.billSource === 1 ? columnsUpdate : columns}
        dataSource={findList.scmDirectDetailList}
        loading={loading}
        bordered
        pagination={false}
        scroll={findList.billSource && findList.billSource === 1 ? { x: '1450' } : { x: '1290' }}
      />
      <br />
      <span>
        { closeUpdate && <Button style={{ marginRight: 5 }} type="primary" onClick={onClose}>关闭订单</Button> }
        <Button onClick={goBack}>返回</Button>
      </span>
    </div>
  );
};
findListAll.propTypes = {
  findList: PropTypes.object,
};
export default findListAll;
