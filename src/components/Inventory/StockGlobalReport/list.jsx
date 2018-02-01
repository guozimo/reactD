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
    title: '辅助单位',
    dataIndex: 'dualUnitName',
    key: 'dualUnitName',
  }, {
    title: '辅助数量',
    dataIndex: 'dualCurrQty',
    key: 'dualCurrQty',
  }, {
    title: '数量',
    dataIndex: 'currQty',
    key: 'currQty',
  }, {
    title: '金额',
    dataIndex: 'currAmt',
    key: 'currAmt',
  },
  ];
  return (
    <div>
      {storeId && <Table
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
};
export default RequisitionList;
