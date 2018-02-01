import React, { PropTypes } from 'react';
import { Table } from 'antd';

const List = ({
  storeId,
  dataSourceAll,
  loading,
  listPagination,
  onPageChange,
  onPageSizeChange,
}) => {
  const columns = [{
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
    title: '仓库',
    dataIndex: 'depotName',
    key: 'depotName',
  }, {
    title: '类别',
    dataIndex: 'cateName',
    key: 'cateName',
  }, {
    title: '盘点日期',
    dataIndex: 'bussDate',
    key: 'bussDate',
  }, {
    title: '库存单位',
    dataIndex: 'checkUnitName',
    key: 'checkUnitName',
  }, {
    title: '库存理论数',
    dataIndex: 'theoryQty',
    key: 'theoryQty',
  }, {
    title: '库存实盘数',
    dataIndex: 'checkQty',
    key: 'checkQty',
  }, {
    title: '库存差异数',
    dataIndex: 'profLossQty',
    key: 'profLossQty',
  }, {
    title: '库存差异金额',
    dataIndex: 'profLossAmt',
    key: 'profLossAmt',
  }, {
    title: '辅助单位',
    dataIndex: 'dualUnitName',
    key: 'dualUnitName',
  }, {
    title: '辅助理论数',
    dataIndex: 'dualAccQty',
    key: 'dualAccQty',
  }, {
    title: '辅助实盘数',
    dataIndex: 'dualCheckQty',
    key: 'dualCheckQty',
  }, {
    title: '辅助差异数',
    dataIndex: 'dualProfLossQty',
    key: 'dualProfLossQty',
  }];
  return (
    <div>
      {storeId &&
        <Table
          bordered // 展示外边框和列边框
          columns={columns} // 表格列的配置描述
          dataSource={dataSourceAll} // 表格内的数据数组
          loading={loading} // 页面是否加载中
          scroll={{ x: '1900' }} // 横向支持滚动，指定滚动区域的宽度
          pagination={listPagination} // 分页
          onChange={onPageChange}  // 分页、排序、筛选变化时触发
          onShowSizeChange={onPageSizeChange} // pageSize变化的回调 Function(current, size)
        />
      }
    </div>
  );
};

List.propTypes = {
  // dataSourceAll: PropTypes.array,
  loading: PropTypes.bool,
  listPagination: PropTypes.object,
  onPageChange: PropTypes.func,
  onPageSizeChange: PropTypes.func,
};
export default List;
