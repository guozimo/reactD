import React, { PropTypes } from 'react';
import { Table, Icon, Pagination, Tag} from 'antd';
import moment from 'moment';

const RequisitionList = ({
  storeId,
  dataSourceAll,
  loading,
  billStatus,
  listPagination,
  onPageChange,
  onPageSizeChange,
}) => {
  const columnsConfig = [{
    title: '物资编码',
    dataIndex: 'goodsCode',
    key: 'goodsCode',
  }, {
    title: '物资名称',
    dataIndex: 'goodsName',
    key: 'goodsName',
  }, {
    title: '规格',
    dataIndex: 'goodsSpec',
    key: 'goodsSpec',
  }, {
    title: '单位',
    dataIndex: 'unitName',
    key: 'unitName',
  }, {
    title: '仓库',
    dataIndex: 'depotName',
    key: 'depotName',
  }, {
    title: '类别',
    dataIndex: 'cateName',
    key: 'cateName',
  }, {
    title: '采购入库',
    children: [{
      title: '数量',
      dataIndex: 'purInNum',
      width: 80,
      key: 'purInNum',
    }, {
      title: '金额',
      dataIndex: 'purInAmt',
      width: 80,
      key: 'purInAmt',
    }],
    dataIndex: 'stock',
    key: '2',
  }, {
    title: '调拨入库',
    children: [{
      title: '数量',
      dataIndex: 'tranInNum',
      width: 80,
      key: 'tranInNum',
    }, {
      title: '金额',
      dataIndex: 'tranInAmt',
      width: 80,
      key: 'tranInAmt',
    }],
    dataIndex: 'stock',
    key: '2',
  }, {
    title: '其它入库',
    children: [{
      title: '数量',
      dataIndex: 'othInNum',
      width: 80,
      key: 'othInNum',
    }, {
      title: '金额',
      dataIndex: 'othInAmt',
      width: 80,
      key: 'othInAmt',
    }],
    dataIndex: 'stock',
    key: '2',
  }, {
    title: '其它出库',
    children: [{
      title: '数量',
      dataIndex: 'othOutNum',
      width: 80,
      key: 'othOutNum',
    }, {
      title: '金额',
      dataIndex: 'othOutAmt',
      width: 80,
      key: 'othOutAmt',
    }],
    dataIndex: 'stock',
    key: '2',
  }, {
    title: '调拨出库',
    children: [{
      title: '数量',
      dataIndex: 'tranOutNum',
      width: 80,
      key: 'tranOutNum',
    }, {
      title: '金额',
      dataIndex: 'tranOutAmt',
      width: 80,
      key: 'tranOutAmt',
    }],
    dataIndex: 'stock',
    key: '2',
  }, {
    title: '报损出库',
    children: [{
      title: '数量',
      dataIndex: 'retOutNum',
      width: 80,
      key: 'retOutNum',
    }, {
      title: '金额',
      dataIndex: 'retOutAmt',
      width: 80,
      key: 'retOutAmt',
    }],
    dataIndex: 'stock',
    key: '2',
  }, {
    title: '消耗出库',
    children: [{
      title: '数量',
      dataIndex: 'saleOutNum',
      width: 80,
      key: 'saleOutNum',
    }, {
      title: '金额',
      dataIndex: 'saleOutAmt',
      width: 80,
      key: 'saleOutAmt',
    }],
    dataIndex: 'stock',
    key: '2',
  }, {
    title: '盘盈/盘亏',
    children: [{
      title: '数量',
      dataIndex: 'profInNum', // profInNum - lossOutNum
      width: 80,
      key: 'profInNum',
      render: (text, record) => (Math.round(parseFloat(record.profInNum - record.lossOutNum) * 10000) / 10000 : 0),
    }, {
      title: '金额',
      dataIndex: 'profInAmt', // profInAmt - lossOutAmt
      width: 80,
      key: 'profInAmt',
      render: (text, record) => (Math.round(parseFloat(record.profInAmt - record.lossOutAmt) * 10000) / 10000 : 0),
    }],
    dataIndex: 'stock',
    key: '2',
  },
  ];
  return (
    <div>
      {storeId && <Table
        bordered
        columns={columnsConfig}
        dataSource={dataSourceAll}
        loading={loading}
        scroll={{ x: '1900' }}
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
};
export default RequisitionList;
