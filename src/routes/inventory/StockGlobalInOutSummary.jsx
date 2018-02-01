import React from 'react';
import { connect } from 'dva';
import { message } from 'antd'
import StockGlobalReportSearch from '../../components/Inventory/StockGlobalInOutSummary/search';
import StockGlobalReportList from '../../components/Inventory/StockGlobalInOutSummary/list';

const StockGlobalInOutSummary = ({ stockGlobalInOutSummary, dispatch, merchantApp }) => {
  const { storeId, depotList, cateId, depotCannList, filterDataRange, opType, depotId, inNewDepotId, searchTree, loading, newData, dataSourceAll, billStatus, filterOpterName, goodsName, listPagination } = stockGlobalInOutSummary;
  // const { storeId, loading, depotList, supplierList, typeList, warehouseList, newData, dataSourceAll, pagination,
  // dataSource, count, editableMem, selectData } = stockGlobalInOutSummary;
  // console.log('storeId:',storeId);
  const { menuData } = merchantApp;
  const requisitionSearchList = {
    menuData,
    storeId,
    newData,
    filterOpterName,
    depotCannList, // 出入库
    goodsName, // 物资名称
    depotId, // 调出仓库ID
    filterDataRange,  // 采购日期
    inNewDepotId, // 调入仓库ID
    searchTree, // 类别
    opType,
    cateId,
    key: storeId,
    storeList: depotList,
    upadateDepotId(value) { // 出库
      // _.remove(dataList, item => {
      //     item.id === value
      // })
      dispatch({
        type: 'stockGlobalInOutSummary/querySuccess',
        payload: {
          depotId: value,
        },
      });
      dispatch({
        type: 'stockGlobalInOutSummary/getList',
        payload: {
          pageNo: 1,
        },
      });
    },
    upadateInDepot(value) { // 入库
      dispatch({
        type: 'stockGlobalInOutSummary/querySuccess',
        payload: {
          inNewDepotId: value,
        },
      });
    },
    onTreeChange(value) { // 修改类别
      dispatch({
        type: 'stockGlobalInOutSummary/querySuccess',
        payload: {
          cateId: value,
        },
      });
      dispatch({
        type: 'stockGlobalInOutSummary/getList', // getRequisitionByFilter
        payload: { pageNo: 1 },
      });
    },
    changeFilterDataRange(dates) { // 修改采购日期
      // console.warn("data",dates);
      if (dates.length) {
        dispatch({
          type: 'stockGlobalInOutSummary/setFilterDataRange',
          payload: {
            filterDataRange: dates,
          },
        });
        // 选择订单时间后自动搜索
        dispatch({
          type: 'stockGlobalInOutSummary/getList', // getRequisitionByFilter
          payload: { pageNo: 1 },
        });
      }
    },
    exportRequisition(id) {
      dispatch({
        type: 'stockGlobalInOutSummary/exportItem',
        payload: {
          id,
        },
      });
    },
    selectStore(value) {
      if (value) {
        dispatch({
          type: 'stockGlobalInOutSummary/queryDepot',
          payload: {
            rows: 10,
            storeId: value,
          },
        });
        dispatch({
          type: 'stockGlobalInOutSummary/findTreeList',
          payload: {
            type: '0',
          },
        });
      }
      dispatch({
        type: 'stockGlobalInOutSummary/querySuccess',
        payload: {
          storeId: value,
          depotId: '',
          inNewDepotId: '',
          searchTree: [],
        },
      });
      dispatch({
        type: 'stockGlobalInOutSummary/getList',
        payload: {
          storeId: value,
          pageNo: 1,
        },
      });
    },
    queryAll(value) {
      dispatch({
        type: 'stockGlobalInOutSummary/getList',
        payload: {
          value,
          pageNo: 1,
        },
      });
    },
    changeFilterOpterName(event) {
      dispatch({
        type: 'stockGlobalInOutSummary/setFilterOpterName',
        payload: {
          filterOpterName: event.target.value,
        },
      });
      // // 修改创建人后自动搜索
      // dispatch({
      //   type: 'stockGlobalInOutSummary/getList', // getRequisitionByFilter
      //   payload: { pageNo: 1 },
      // });
    },
    changeGoodsName(event) { //  编号
      const newValue = event.target.value;
      if (newValue.length > 30) {
        message.error('编码数量不能超过30个！');
        return false;
      }
      dispatch({
        type: 'stockGlobalInOutSummary/setFilterBillNo',
        payload: {
          goodsName: newValue,
        },
      });
    },
    filterRequisition() {
      dispatch({
        type: 'stockGlobalInOutSummary/getList', // getRequisitionByFilter
        payload: { pageNo: 1 },
      });
    },
  };

  const requisitionListDate = {
    menuData,
    storeId,
    dataSourceAll,
    listPagination,
    billStatus,
    loading,
    onPageChange(page) {
      dispatch({
        type: 'stockGlobalInOutSummary/getList',
        payload: {
          pageNo: page.current,
          pageSize: page.pageSize,
          storeId,
        },
      });
    },
    onPageSizeChange(current, pageSize) {
      dispatch({
        type: 'stockGlobalInOutSummary/getList',
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
      <StockGlobalReportSearch {...requisitionSearchList} />
      <StockGlobalReportList {...requisitionListDate} />
    </div>
  );
};

function mapStateToProps({ stockGlobalInOutSummary,merchantApp }) {
  return { stockGlobalInOutSummary, merchantApp };
}
export default connect(mapStateToProps)(StockGlobalInOutSummary);
