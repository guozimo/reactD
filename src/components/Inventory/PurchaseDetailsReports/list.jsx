import React, { PropTypes } from 'react';
import { Table, Row, Col } from 'antd';

const RequisitionList = ({
                           dataSourceAll,    // 列表数据
                           originId,         // 机构Id
                           loading,          // 加载
                           timestampToDate,  // 时间戳转换
                           listPagination,   // 分页
                           onPageChange,     // 页码改变
                           onPageSizeChange, // 分页格式改变
                           originList,       // 机构列表
                         }) => {
  const columnsConfig = [{
    title: '物品编码',
    dataIndex: 'goodsCode',
    key: 'goodsCode',
  }, {
    title: '物品名称',
    dataIndex: 'goodsName',
    key: 'goodsName',
  }, {
    title: '规格',
    dataIndex: 'goodsSpec',
    key: 'goodsSpec',
  }, {
    title: '门店名称',
    dataIndex: 'storeName',
    key: 'storeName',
  }, {
    title: '供应商',
    dataIndex: 'busiName',
    key: 'busiName',
  }, {
    title: '请购日期',
    dataIndex: 'bussDate',
    key: 'bussDate',
    render: text => (timestampToDate(text)),
    sorter: (a, b) => a.bussDate - b.bussDate,
  }, {
    title: '采购价',
    dataIndex: 'ordPrice',
    key: 'ordPrice',
    sorter: (a, b) => a.ordPrice - b.ordPrice,
  }, {
    title: '数量',
    dataIndex: 'ordUnitNum',
    key: 'ordUnitNum',
    sorter: (a, b) => a.ordUnitNum - b.ordUnitNum,
  }, {
    title: '金额',
    dataIndex: 'currAmt',
    key: 'currAmt',
    sorter: (a, b) => (a.ordUnitNum * a.ordPrice) - (b.ordUnitNum * b.ordPrice),
    render: (text, record) => (Math.round(parseFloat(record.ordUnitNum * record.ordPrice) * 10000) / 10000 : 0),
  }];
  // const footer = () => (<div><Row gutter={0}>
  //   <Col span={6}>总计</Col>
  //   <Col span={12} />
  //   <Col span={3}>总数: <span>{getAccount(dataSourceAll)[0]}</span></Col>
  //   <Col span={3}>总价: <span>{getAccount(dataSourceAll)[1]}</span></Col>
  // </Row></div>);
  const rowKey = (record, index) => index;
  return (
    <div>
      {(originId || (originList.length === 1)) &&
        <Table
          bordered
          columns={columnsConfig}
          dataSource={dataSourceAll}
          loading={loading}
          pagination={listPagination}
          onChange={onPageChange}
          onShowSizeChange={onPageSizeChange}
          // footer={footer}
          rowKey={rowKey}
        />
      }</div>
  );
};

RequisitionList.propTypes = {
  originList: PropTypes.array,
  dataSourceAll: PropTypes.array,
  loading: PropTypes.bool,
  listPagination: PropTypes.object,
  originId: PropTypes.string,
  onPageChange: PropTypes.func,
  onPageSizeChange: PropTypes.func,
  timestampToDate: PropTypes.func,
 // getAccount: PropTypes.func,
};
export default RequisitionList;
