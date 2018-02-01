import React from 'react';
import { connect } from 'dva';
import DirectCheckSearch from '../../components/Inventory/DirectCheck/search';
import DirectCheckList from '../../components/Inventory/DirectCheck/list';

const DirectCheck = ({ directCheckModule, dispatch, merchantApp }) => {
  const { storeId, depotList, loading, supplierList, newData, dataSourceAll, billStatus, filterStatus, filterDataRange, busiId, filterBillNo, listPagination, selectedRows,
    hasAutoSelected } = directCheckModule;
  // const { storeId, loading, depotList, supplierList, typeList, warehouseList, newData, dataSourceAll, pagination,
  // dataSource, count, editableMem, selectData } = directCheckModule;
  const { menuData } = merchantApp;
  const directCheckSearchList = {
    menuData,
    storeId,
    newData,
    supplierList,
    filterStatus,
    filterDataRange,
    busiId,
    filterBillNo,
    selectedRows,
    hasAutoSelected,
    storeList: depotList,
    selectStore(value) {
      dispatch({
        type: 'directCheckModule/getList',
        payload: {
          storeId: value,
          pageNo: 1,
        },
      });
      dispatch({
        type: 'directCheckModule/querySuccess',
        payload: {
          storeId: value,
        },
      });
      dispatch({
        type: 'directCheckModule/querySupplier',
        payload: {
          status: 1,
          rows: '1000',
        },
      });
    },
    onCreate(value) {
      dispatch({
        type: 'directCheckModule/createBill',
        payload: {
          dataSource: [value],
        },
      });
      dispatch({
        type: 'directCheckDetailsModule/intoModel',
        payload: {
          storeId,
        },
      });
      dispatch({
        type: 'directCheckDetailsModule/startWithType', // 写在此处不卸载上面intoModel的原因是因为要驱动初始添加数据。
        payload: {
          opType: 'create',
        },
      });
    },
    queryAll(value) {
      dispatch({
        type: 'directCheckModule/getList',
        payload: {
          value,
          pageNo: 1,
        },
      });
    },
    changeFilterStatus(event) {
      dispatch({
        type: 'directCheckModule/setFilterStatus',
        payload: {
          filterStatus: event.target.value,
        },
      });

      dispatch({ // 选择验收状态后立即返回列表
        type: 'directCheckModule/getList', // getDirectCheckByFilter
        payload: { pageNo: 1 },
      });
    },
    changeFilterDataRange(dates) {
      dispatch({
        type: 'directCheckModule/setFilterDataRange',
        payload: {
          filterDataRange: dates,
        },
      });

      dispatch({ // 选择时间范围后立即返回列表
        type: 'directCheckModule/getList', // getDirectCheckByFilter
        payload: { pageNo: 1 },
      });
    },
    changeSupplier(value) {
      // const newSupplierList
      dispatch({
        type: 'directCheckModule/changeSupplier',
        payload: {
          busiId: value,
        },
      });
      dispatch({ // 选择时间范围后立即返回列表
        type: 'directCheckModule/getList', // getDirectCheckByFilter
        payload: { pageNo: 1 },
      });
    },
    changeFilterBillNo(event) {
      dispatch({
        type: 'directCheckModule/setFilterBillNo',
        payload: {
          filterBillNo: event.target.value,
        },
      });
    },
    filterDirectCheck() {
      dispatch({
        type: 'directCheckModule/getList', // getDirectCheckByFilter
        payload: { pageNo: 1 },
      });
    },
  };

  const directCheckListDate = {
    menuData,
    storeId,
    dataSourceAll,
    listPagination,
    billStatus,
    loading,
    selectedRows,
    toDetail(record, opType) {
      dispatch({
        type: 'directCheckModule/createBill',
        payload: {
          dataSource: [],
          id: record.id,
          storeId,
          opType,
        },
      });
      // dispatch({
      //   type: 'directCheckDetailsModule/showDetailList',
      //   payload: {
      //     id: record.id,
      //     storeId,
      //     record
      //   },
      // });
      // dispatch({
      //   type: 'directCheckDetailsModule/startWithType',
      //   payload: {
      //     opType,
      //   },
      // });
    },
    deleteItem(id) {
      dispatch({
        type: 'directCheckModule/deleteDirectCheckItem',
        payload: {
          id,
        },
      });
    },
    onPageChange(page) {
      dispatch({
        type: 'directCheckModule/getList',
        payload: {
          pageNo: page.current,
          pageSize: page.pageSize,
          storeId,
        },
      });
    },
    onPageSizeChange(current, pageSize) {
      dispatch({
        type: 'directCheckModule/getList',
        payload: {
          pageNo: 1,
          pageSize,
          storeId,
        },
      });
    },
    exportDirectCheck(id) {
      dispatch({
        type: 'directCheckModule/exportItem',
        payload: {
          id,
        },
      });
    },
    latestSelectedRows(selectingRows) {
      dispatch({
        type: 'directCheckModule/setSelectedRows',
        payload: {
          selectedRows: selectingRows,
        },
      });
    }
  };

  return (
    <div className="routes">
      <DirectCheckSearch {...directCheckSearchList} />
      <DirectCheckList {...directCheckListDate} />
    </div>
  );
};

function mapStateToProps({ directCheckModule, merchantApp }) {
  return { directCheckModule, merchantApp };
}
export default connect(mapStateToProps)(DirectCheck);
