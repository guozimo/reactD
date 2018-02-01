import React, { PropTypes } from 'react';
import { Input, Table, Button, Row, Col, Select, Breadcrumb } from 'antd';
const Option = Select.Option;

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
      width: 80,
      dataIndex: 'goodsSpec',
      key: 'goodsSpec',
    }, {
      title: '标准',
      children: [{
        title: '单位',
        dataIndex: 'unitName',
        width: 80,
        key: 'unitName',
      }, {
        title: '数量',
        dataIndex: 'unitNum',
        width: 80,
        key: 'unitNum',
      }],
      dataIndex: 'stock',
      key: '2',
    },
    {
      title: '采购',
      children: [{
        title: '单位',
        dataIndex: 'ordUnitName',
        width: 80,
        key: 'ordUnitName',
      }, {
        title: '数量',
        dataIndex: 'ordUnitNum',
        width: 80,
        key: 'ordUnitNum',
      }],
      dataIndex: 'stock',
      key: '2',
    }, {
      title: '调整数量',
      dataIndex: 'ordAdjustNum',
      width: 80,
      key: 'ordAdjustNum',
    }, {
      title: '辅助',
      children: [{
        title: '单位',
        dataIndex: 'dualUnitName',
        width: 80,
        key: 'dualUnitName',
      }, {
        title: '数量',
        dataIndex: 'dualUnitNum',
        width: 80,
        key: 'dualUnitNum',
      }],
      dataIndex: 'stock',
      key: '2',
    }, {
      title: '采购单价',
      dataIndex: 'ordPrice',
      width: 80,
      key: 'ordPrice',
    }, {
      title: '采购金额',
      dataIndex: 'goodsAmt',
      width: 80,
      key: 'goodsAmt',
    }, {
      title: '税率',
      dataIndex: 'taxRatio',
      width: 80,
      key: 'taxRatio',
    }, {
      title: '不含税单价',
      dataIndex: 'ordPriceNotax',
      width: 80,
      key: 'ordPriceNotax',
    }, {
      title: '不含税金额',
      dataIndex: 'goodsAmtNotax',
      width: 80,
      key: 'goodsAmtNotax',
    }, {
      title: '备注',
      dataIndex: 'remarks',
      width: 80,
      key: 'remarks',
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
      width: 80,
      dataIndex: 'goodsSpec',
      key: 'goodsSpec',
    }, {
      title: '标准',
      children: [{
        title: '单位',
        dataIndex: 'unitName',
        width: 80,
        key: 'unitName',
      }, {
        title: '数量',
        dataIndex: 'unitNum',
        width: 80,
        key: 'unitNum',
      }],
      dataIndex: 'stock',
      key: '2',
    },
    {
      title: '订货',
      children: [{
        title: '单位',
        dataIndex: 'purcUnitName',
        width: 80,
        key: 'purcUnitName',
      }, {
        title: '数量',
        dataIndex: 'purcUnitNum',
        width: 80,
        key: 'purcUnitNum',
      }],
      dataIndex: 'stock',
      key: '2',
    },
    {
      title: '采购',
      children: [{
        title: '单位',
        dataIndex: 'ordUnitName',
        width: 80,
        key: 'ordUnitName',
      }, {
        title: '数量',
        dataIndex: 'ordUnitNum',
        width: 80,
        key: 'ordUnitNum',
      }],
      dataIndex: 'stock',
      key: '2',
    }, {
      title: '调整数量',
      dataIndex: 'ordAdjustNum',
      width: 80,
      key: 'ordAdjustNum',
    }, {
      title: '辅助',
      children: [{
        title: '单位',
        dataIndex: 'dualUnitName',
        width: 80,
        key: 'dualUnitName',
      }, {
        title: '数量',
        dataIndex: 'dualUnitNum',
        width: 80,
        key: 'dualUnitNum',
      }],
      dataIndex: 'stock',
      key: '2',
    }, {
      title: '采购单价',
      dataIndex: 'ordPrice',
      width: 80,
      key: 'ordPrice',
    }, {
      title: '采购金额',
      dataIndex: 'goodsAmt',
      width: 80,
      key: 'goodsAmt',
    }, {
      title: '税率',
      dataIndex: 'taxRatio',
      width: 80,
      key: 'taxRatio',
    }, {
      title: '不含税单价',
      dataIndex: 'ordPriceNotax',
      width: 80,
      key: 'ordPriceNotax',
    }, {
      title: '不含税金额',
      dataIndex: 'goodsAmtNotax',
      width: 80,
      key: 'goodsAmtNotax',
    }, {
      title: '备注',
      dataIndex: 'remarks',
      width: 80,
      key: 'remarks',
    }];
  const storeOptions = storeList && storeList.map(store => <Option value={store.id} key={store.id}>{store.name}</Option>);
  const busiListAll = busiList && busiList.map(store => <Option value={store.id} key={store.id}>{store.name}</Option>);

  return (
    <div>
    <div className="components-search"><Breadcrumb separator=">">
      <Breadcrumb.Item>供应链</Breadcrumb.Item>
      <Breadcrumb.Item>门店进销存管理</Breadcrumb.Item>
      <Breadcrumb.Item>直运验收</Breadcrumb.Item>
      <Breadcrumb.Item>查看订单</Breadcrumb.Item>
    </Breadcrumb>

    <div className="search">
      <div >
        <Row>
          <Col span={2}>订单类型：</Col>
          <Col span={6}>
            <Input style={{ width: 160 }} value="直运" disabled  placeholder="订单类型" />
          </Col>
          <Col span={2}>采购订单：</Col>
          <Col span={6}>
            <Input style={{ width: 160 }} disabled value={findList.billNo} placeholder="请填写采购订单" />
          </Col>
          <Col span={2}>订单日期：</Col>
          <Col span={6}> <Input style={{ width: 160 }} disabled value={findList.bussDate} /></Col>
        </Row>
        <Row style={{ paddingTop: 10 }}>
          <Col span={2}>收货机构：</Col>
          <Col span={6}>
            <Input style={{ width: 160 }} disabled value={findList.storeName}  placeholder="" />
          </Col>
          <Col span={2}>供应商：</Col>
          <Col span={6}>
            <Input style={{ width: 160 }} disabled value={findList.busiName}  placeholder="" />
          </Col>
          <Col span={2}>备注</Col>
          <Col span={6}>
            <Input style={{ width: 160 }} disabled value={findList.remarks} placeholder="请选择备注" />
          </Col>
        </Row>
      </div>
    </div>
    </div>
     <Table
      columns={findList.billSource && findList.billSource === 1 ? columnsUpdate : columns}
      dataSource={findList.scmDirectDetailList}
      loading={loading}
      bordered
      pagination={false}
      scroll={findList.billSource && findList.billSource === 1 ? { x: '1480' } : { x: '1320' }}
      />
      <br/>
       <span>{ !closeUpdate && <Button type="primary" onClick={onClose}>关闭订单</Button> }  <Button onClick={goBack} type="primary">返回</Button> </span>

    </div>
  );
};
findListAll.propTypes = {
  findList:PropTypes.object,
};
export default findListAll;
