import React, { PropTypes } from 'react';
import { Table } from 'antd';

const RequisitionList = ({
                           storeId,
                           storeList,
                           dataSourceAll,
                           loading,
                           listPagination,
                           onPageChange,
                           onPageSizeChange,
                           timestampToDate,
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
    title: '仓库',
    dataIndex: 'depotName',
    key: 'depotName',
  }, {
    title: '请购日期',
    dataIndex: 'bussDate',
    key: 'bussDate',
    sorter: (a, b) => a.bussDate - b.bussDate,
    render: (timestampToDate),
  }, {
    title: '配送价',
    dataIndex: 'unitPrice',
    key: 'unitPrice',
    sorter: (a, b) => a.unitPrice - b.unitPrice,
  }, {
    title: '数量',
    dataIndex: 'unitNum',
    key: 'unitNum',
    sorter: (a, b) => a.unitNum - b.unitNum,
  }, {
    title: '金额',
    dataIndex: 'currAmt',
    key: 'currAmt',
    sorter: (a, b) => a.currAmt - b.currAmt,
    render: (text, record) => (Math.round(parseFloat(record.unitNum * record.unitPrice) * 10000) / 10000 : 0),
  },
  ];
  return (
    <div>
      {(storeId || (storeList.length === 1)) && <Table
        bordered
        columns={columnsConfig}
        dataSource={dataSourceAll}
        loading={loading}
        pagination={listPagination}
        onChange={onPageChange}
        onShowSizeChange={onPageSizeChange}
      />}
    </div>
  );
};

RequisitionList.propTypes = {
  dataSourceAll: PropTypes.array,
  loading: PropTypes.bool,
  billStatus: PropTypes.object,
  listPagination: PropTypes.object,
  onPageChange: PropTypes.func,
  onPageSizeChange: PropTypes.func,
  timestampToDate: PropTypes.func,
};
export default RequisitionList;
