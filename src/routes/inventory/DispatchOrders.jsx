import React from 'react';
import { connect } from 'dva';
import { message } from 'antd'
import _ from 'lodash';
import DispatchOrdersSearch from '../../components/Inventory/DispatchOrders/search';
import DispatchOrdersList from '../../components/Inventory/DispatchOrders/list';

const DispatchOrders = ({ dispatchOrders, dispatch, merchantApp }) => {
  const { storeId,
          distribId,
          depotId,
          dataSourceAll,
          depotList,
          orderStatusList,
          depotDispatchList,
          wareHouseList,
          filterBillNo,
          filterDataRange,
          opType,
          filterStatus,
          loading,
          listPagination,
          initialOrgName,
        } = dispatchOrders;
  const { menuData } = merchantApp;
  const requisitionSearchList = {
    menuData,
    storeId,
    distribId,
    depotId,
    opType,
    orderStatusList,
    wareHouseList,
    filterBillNo,
    filterDataRange,
    depotDispatchList,
    filterStatus,
    initialOrgName,
    key: distribId,
    storeList: depotList,
    selectStore(value) {
      if (value) {
        dispatch({
          type: 'dispatchOrders/querySuccess',
          payload: {
            distribId: value,
            filterStatus: '',
          },
        });
        dispatch({
          type: 'dispatchOrders/queryStore',
          payload: {
            distribId: value,
            pageNo: 1,
          },
        });
        dispatch({
          type: 'dispatchOrders/queryWarehouse',
          payload: {
            status: 1,
            rows: '1000',
            queryString: '',
            limit: '1000',
          },
        });
        dispatch({ // 点击机构名称要清空原来选择的门店列表，已选择全部门店的数据
          type: 'dispatchOrders/saveStoreId',
          payload: { storeId: '' },
        });
        dispatch({
          type: 'dispatchOrders/getList',
          payload: {
            distribId: value,
            pageNo: 1,
          },
        });
      }
    },
    selectWareHouse(value) {
      dispatch({
        type: 'dispatchOrders/querySuccess',
        payload: {
          depotId: value,
        },
      });
      dispatch({ // 点击仓库后立即搜索
        type: 'dispatchOrders/getList', // getStockOutByFilter
        payload: { pageNo: 1 },
      });
    },
    changeFilterStatus(event) {
      dispatch({
        type: 'dispatchOrders/setFilterStatus',
        payload: {
          filterStatus: event.target.value,
        },
      });

      dispatch({ // 点击订单状态后立即搜索
        type: 'dispatchOrders/getList', // getStockOutByFilter
        payload: { pageNo: 1 },
      });
    },
    changeFilterBillNo(event) {
      dispatch({
        type: 'dispatchOrders/setFilterBillNo',
        payload: {
          filterBillNo: event.target.value,
        },
      });
    },
    enterFilterBillNo() {
      dispatch({ // 输入编号后立即搜索
        type: 'dispatchOrders/getList',
        payload: { pageNo: 1 },
      });
    },
    changeFilterDataRange(dates) {
      dispatch({
        type: 'dispatchOrders/setFilterDataRange',
        payload: {
          filterDataRange: dates,
        },
      });
      dispatch({ // 设置请购日期后立即搜索
        type: 'dispatchOrders/getList', // getStockOutByFilter
        payload: { pageNo: 1 },
      });
    },
    updateStore(value) {
      dispatch({
        type: 'dispatchOrders/querySuccess',
        payload: {
          storeId: value,
        },
      });
      dispatch({
        type: 'dispatchOrders/getList', // getStockOutByFilter
        payload: { pageNo: 1 },
      });
    },
    filterDispatchOrders() {
      dispatch({
        type: 'dispatchOrders/getList', // getStockOutByFilter
        payload: { pageNo: 1 },
      });
    },
  };

  const requisitionListDate = {
    menuData,
    storeId,
    distribId,
    loading,
    dataSourceAll,
    listPagination,
    onView(id) {
      dispatch({
        type: 'dispatchOrders/toItem',
        payload: {
          type: 'view',
          id,
        },
      });
    },
    onEdit(id) {
      dispatch({
        type: 'dispatchOrders/toItem',
        payload: {
          type: 'edit',
          id,
        },
      });
    },
    onExport(id) { // 导出
      dispatch({
        type: 'dispatchOrders/export',
        payload: {
          id,
          storeId: distribId,
        },
      });
    },
    onClose(id, status) {
      dispatch({
        type: 'dispatchOrders/close',
        payload: {
          id,
          status,
        },
      });
    },
    onPageChange(page) {
      dispatch({
        type: 'dispatchOrders/getList',
        payload: {
          pageNo: page.current,
          pageSize: page.pageSize,
          storeId,
        },
      });
    },
    onPageSizeChange(current, pageSize) {
      dispatch({
        type: 'dispatchOrders/getList',
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
      <DispatchOrdersSearch {...requisitionSearchList} />
      <DispatchOrdersList {...requisitionListDate} />
    </div>
  );
};

function mapStateToProps({ dispatchOrders, merchantApp }) {
  return { dispatchOrders, merchantApp };
}
export default connect(mapStateToProps)(DispatchOrders);
