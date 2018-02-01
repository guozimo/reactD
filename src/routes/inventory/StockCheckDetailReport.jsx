import React, { PropTypes } from 'react';
import { connect } from 'dva';
import { message } from 'antd';
import StockCheckDetailReportList from '../../components/Inventory/StockCheckDetailReport/list';
import StockCheckDetailReportSearch from '../../components/Inventory/StockCheckDetailReport/search';

const StockCheckDetailReport = ({ stockCheckDetailReportData, dispatch }) => {
  const {
    storeId,
    depotList, // 机构列表
    filterDataRange,
    goodsName,
    depotId,
    depotListAll, // 仓库列表
    cateId, // 分类id
    searchTree, // 类别树
    dataSourceAll, // 表格内的数据数组
    loading,
    listPagination,
  } = stockCheckDetailReportData.stockCheckDetailReport;

  const StockCheckDetailReportSearchProps = {
    storeId,
    filterDataRange,
    goodsName,
    depotId, // 调出仓库id
    depotListAll,
    cateId, // 分类id
    searchTree,
    key: storeId,
    storeList: depotList,
    // 改变机构
    changeStore(value) {
      if (value) {
        dispatch({ // 请求仓库
          type: 'stockCheckDetailReport/queryWarehouse',
          payload: {
            storeId: value,
            rows: 10,
          },
        });
        dispatch({ // 请求表格
          type: 'stockCheckDetailReport/getList',
          payload: {
            storeId: value,
            pageNo: 1,
          },
        });
        dispatch({ // 请求类别
          type: 'stockCheckDetailReport/findTreeList',
          payload: {
            type: '0',
          },
        });
      }
      dispatch({
        type: 'stockCheckDetailReport/querySuccess',
        payload: {
          storeId: value,
          depotId: '',
          searchTree: [],
        },
      });
    },
    // 导出表格
    exportRequisition(value) {
      dispatch({
        type: 'stockCheckDetailReport/exportItem',
        payload: {
          value,
        },
      });
    },
    // 修改日期
    changeFilterDataRange(dates) {
      if (dates.length) {
        dispatch({
          type: 'stockCheckDetailReport/setFilterDataRange',
          payload: {
            filterDataRange: dates,
          },
        });
        // 选择订单时间后自动搜索
        dispatch({
          type: 'stockCheckDetailReport/getList',
          payload: { pageNo: 1 },
        });
      }
    },
    // 改变物品名称、编号
    changeGoodsName(event) {
      const newValue = event.target.value;
      if (newValue.length > 30) {
        message.error('编码数量不能超过30个！');
        return false;
      }
      dispatch({
        type: 'stockCheckDetailReport/setFilterBillNo',
        payload: {
          goodsName: newValue,
        },
      });
    },
    // 修改仓库
    changeDepotId(value) {
      dispatch({
        type: 'stockCheckDetailReport/querySuccess',
        payload: {
          depotId: value,
        },
      });
      dispatch({
        type: 'stockCheckDetailReport/getList',
        payload: {
          depotId: value,
        },
      });
    },
    // 修改分类
    onTreeChange(value) {
      dispatch({
        type: 'stockCheckDetailReport/querySuccess',
        payload: {
          cateId: value,
        },
      });
      dispatch({
        type: 'stockCheckDetailReport/getList',
        payload: {
          cateId: value,
        },
      });
    },
    // 搜索按钮
    filterRequisition() {
      dispatch({
        type: 'stockCheckDetailReport/getList',
        payload: {
          pageNo: 1,
        },
      });
    },
  };
  const StockCheckDetailReportListProps = {
    storeId,
    dataSourceAll,
    loading,
    listPagination,
    // 分页获取数据
    onPageChange(page) {
      dispatch({
        type: 'stockCheckDetailReport/getList',
        payload: {
          pageNo: page.current,
          pageSize: page.pageSize,
          storeId,
        },
      });
    },
    // pageSize变化的回调 Function(current, size)
    onPageSizeChange(current, pageSize) {
      dispatch({
        type: 'stockCheckDetailReport/getList',
        payload: {
          pageNo: 1,
          pageSize,
          storeId,
        },
      });
    },
  };

  return (
    <div className="routes">
      <StockCheckDetailReportSearch {...StockCheckDetailReportSearchProps} />
      <StockCheckDetailReportList {...StockCheckDetailReportListProps} />
    </div>
  );
};

StockCheckDetailReport.propTypes = {
  dispatch: PropTypes.func,
};

function mapStateToProps(stockCheckDetailReportData) {
  return { stockCheckDetailReportData };
}

export default connect(mapStateToProps)(StockCheckDetailReport);
