import React from 'react';
import { connect } from 'dva';
import StockOutSearch from '../../components/Inventory/StockOut/search';
import StockOutList from '../../components/Inventory/StockOut/list';

const StockOut = ({ stockOutModule, dispatch, merchantApp }) => {
  const { storeId, angencyList, stockOutTypeList,
    listPagination, dataSourceAll, filterStatus,
    filterDataRange, stockOutHouseList, supplierList,
    filterBillNo, billType, depotId,
    busiId, billStatus, loading, loadingList, monthDate, nowDate, initialOrgName } = stockOutModule;
  const { menuData } = merchantApp;
  const stockOutSearchList = {
    menuData,
    storeId,
    filterStatus,
    filterDataRange,
    filterBillNo,
    billType,
    depotId,
    busiId,
    listPagination,
    dataSourceAll,
    angencyList,
    nowDate,
    monthDate,
    initialOrgName,
    billTypeList: stockOutTypeList,
    wareHouseList: stockOutHouseList,
    theSupplierList: supplierList,
    selectStore(value) {
      dispatch({
        type: 'stockOutModule/querySuccess',
        payload: {
          storeId: value,
        },
      });
      dispatch({
        type: 'stockOutModule/queryWarehouse',
        payload: {
          rows: '1000',
          storeId: value,
        },
      });
      dispatch({
        type: 'stockOutModule/queryType',
        payload: {
          t: 910,
        },
      });
      dispatch({ // 选择机构后立即搜索
        type: 'stockOutModule/getList', // getStockOutByFilter
        payload: { pageNo: 1 },
      });
    },
    onAdd() {
      dispatch({
        type: 'stockOutModule/toItem',
        payload: {
          type: 'add',
          storeId,
        },
      });
      dispatch({
        type: 'stockOutDetailsModule/getMonthDate',
        payload: { monthDate },
      });
    },
    selectBillType(value) {
      dispatch({
        type: 'stockOutModule/querySuccess',
        payload: {
          billType: value,
        },
      });
      dispatch({ // 点击类型后立即搜索
        type: 'stockOutModule/getList', // getStockOutByFilter
        payload: { pageNo: 1 },
      });
    },
    selectWareHouse(value) {
      dispatch({
        type: 'stockOutModule/querySuccess',
        payload: {
          depotId: value,
        },
      });
      dispatch({ // 点击仓库后立即搜索
        type: 'stockOutModule/getList', // getStockOutByFilter
        payload: { pageNo: 1 },
      });
    },
    // selectSupplier(value) {
    //   dispatch({
    //     type: 'stockOutModule/querySuccess',
    //     payload: {
    //       busiId: value,
    //     },
    //   });
    //   dispatch({ // 点击供应商后立即搜索
    //     type: 'stockOutModule/getList', // getStockOutByFilter
    //     payload: { pageNo: 1 },
    //   });
    // },
    changeFilterStatus(event) {
      dispatch({
        type: 'stockOutModule/setFilterStatus',
        payload: {
          filterStatus: event.target.value,
        },
      });

      dispatch({ // 点击订单状态后立即搜索
        type: 'stockOutModule/getList', // getStockOutByFilter
        payload: { pageNo: 1 },
      });
    },
    changeFilterDataRange(dates) {
      dispatch({
        type: 'stockOutModule/setFilterDataRange',
        payload: {
          filterDataRange: dates,
        },
      });
      dispatch({ // 设置请购日期后立即搜索
        type: 'stockOutModule/getList', // getStockOutByFilter
        payload: { pageNo: 1 },
      });
    },
    changeFilterBillNo(event) {
      dispatch({
        type: 'stockOutModule/setFilterBillNo',
        payload: {
          filterBillNo: event.target.value,
        },
      });
      dispatch({ // 设置请购日期后立即搜索
        type: 'stockOutModule/getList', // getStockOutByFilter
        payload: { pageNo: 1 },
      });
    },
    // changeFilterRemarks(event) {
    //   dispatch({
    //     type: 'stockOutModule/setFilterRemarks',
    //     payload: {
    //       filterRemarks: event.target.value,
    //     },
    //   });
    //   dispatch({ // 设置备注后立即搜索
    //     type: 'stockOutModule/getList', // getStockOutByFilter
    //     payload: { pageNo: 1 },
    //   });
    // },
    filterStockOut() {
      dispatch({
        type: 'stockOutModule/getList', // getStockOutByFilter
        payload: { pageNo: 1 },
      });
    },
  };

  const stockOutListData = {
    menuData,
    storeId,
    dataSourceAll,
    listPagination,
    billStatus,
    loading,
    loadingList,
    monthDate,
    onView(id) {
      dispatch({
        type: 'stockOutModule/toItem',
        payload: {
          type: 'view',
          id,
          storeId,
        },
      });
    },
    onEdit(id) {
      dispatch({
        type: 'stockOutModule/toItem',
        payload: {
          type: 'edit',
          id,
          storeId,
        },
      });
      // dispatch({
      //   type: 'stockOutModule/resetSearchList',
      //   payload: {
      //     storeId,
      //   },
      // });
    },
    onExport(id) { // 导出
      dispatch({
        type: 'stockOutModule/export',
        payload: {
          id,
          storeId,
        },
      });
    },
    onDelete(id) {
      dispatch({
        type: 'stockOutModule/delete',
        payload: {
          id,
          storeId,
        },
      });
    },
    onReverse(id) { // 反审核
      dispatch({
        type: 'stockOutModule/reverse',
        payload: {
          id,
          storeId,
        },
      });
    },
    exportStockOut(id) {
      dispatch({
        type: 'stockOutModule/exportItem',
        payload: {
          id,
        },
      });
    },
    onPageChange(page) {
      dispatch({
        type: 'stockOutModule/getList',
        payload: {
          pageNo: page.current,
          pageSize: page.pageSize,
          storeId,
        },
      });
    },
    onPageSizeChange(current, pageSize) {
      dispatch({
        type: 'stockOutModule/getList',
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
      <StockOutSearch {...stockOutSearchList} />
      <StockOutList {...stockOutListData} />
    </div>
  );
};


function mapStateToProps({ stockOutModule, merchantApp }) {
  return { stockOutModule, merchantApp };
}
export default connect(mapStateToProps)(StockOut);
