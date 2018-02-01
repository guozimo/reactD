import React, { PropTypes } from 'react';
import { Table,Icon, Pagination, Breadcrumb,Row, Col, Input, Button } from 'antd';


const findListAll = ({
  loading,
  findList,
  storeId,
  goBack,
}) => {
  const listColumns = [
    {
      title: '物资编码',
      width: 180,
      dataIndex: 'goodsCode',
      key: 'goodsCode',
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
      title: '辅助',
      children: [
        {
          title: '数量',
          dataIndex: 'dualGoodsQty',
          width: 80,
          key: '21',
        }, {
          title: '单位',
          width: 80,
          dataIndex: 'dualUnitName',
          key: '22',
        },
      ],
      dataIndex: 'assist',
      key: 'assist',
    }, {
      title: '标准',
      children: [
        {
          title: '入库数量',
          dataIndex: 'goodsQty',
          width: 80,
          key: 'goodsQty',
        }, {
          title: '标准单位',
          dataIndex: 'unitName',
          width: 80,
          key: 'unitName',
        }, {
          title: '含税入库价',
          dataIndex: 'goodsPrice',
          width: 80,
          key: 'goodsPrice',
        }, {
          title: '含税金额',
          dataIndex: 'goodsAmtNotax',
          width: 80,
          key: 'goodsAmtNotax',
        }, {
          title: '税率',
          dataIndex: 'taxRatio',
          width: 80,
          key: 'taxRatio',
        }, {
          title: '税额',
          dataIndex: 'goodsTaxAmt',
          width: 80,
          key: 'goodsTaxAmt',
        }, {
          title: '不含税价',
          dataIndex: 'unitPrice',
          width: 80,
          key: 'unitPrice',
        }, {
          title: '不含税金额',
          dataIndex: 'goodsAmt',
          width: 80,
          key: 'goodsAmt',
        }, {
          title: '备注',
          dataIndex: 'remarks',
          width: 80,
          key: 'remarks',
        }
      ],
      dataIndex: 'stock',
      key: '2',
    }];
  return (
    <div>
    <div className="components-search"><Breadcrumb separator=">">
      <Breadcrumb.Item>供应链</Breadcrumb.Item>
      <Breadcrumb.Item>采购管理</Breadcrumb.Item>
      <Breadcrumb.Item>查看采购订单</Breadcrumb.Item>
    </Breadcrumb>

    <div className="search">
      <div >

      <Row>
 <Col span={2}>供应商：</Col>
 <Col span={6}>
 <Input  size="small" value={findList.suppName} disabled />
 </Col>
  <Col span={2}></Col>
 <Col span={2}>采购日期：</Col>
 <Col span={6}>
 <Input  size="small" value={findList.bussDate} disabled />
 </Col>
 </Row>

 <Row style={{paddingTop:10}}>
 <Col span={2}>采购仓库：</Col>
 <Col span={6}>
      <Input  size="small" value={findList.depotName} disabled />
   </Col>
     <Col span={2}></Col>
 <Col span={2}>备注</Col>
 <Col span={6}>
      <Input  size="small" value={findList.remarks} disabled />   </Col>
</Row>

      </div>
    </div>
    </div>
    {storeId && <Table
      columns={listColumns}
      dataSource={findList.detailList}
      loading={loading}
      bordered
      pagination={false}
      scroll={{ x: '130%'}}
      />}
      <br/>
 <Button onClick={goBack} type="primary">返回</Button>
    </div>
  );
};
findListAll.propTypes = {
  findList:PropTypes.object,
};
export default findListAll;
