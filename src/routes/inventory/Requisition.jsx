import React from 'react';
import { connect } from 'dva';
import RequisitionSearch from '../../components/Inventory/Requisition/search';
import RequisitionList from '../../components/Inventory/Requisition/list';

const Requisition = ({ requisitionModule, dispatch, merchantApp }) => {
  const { storeId, depotList, loading, newData, dataSourceAll, billStatus, filterStatus, filterDataRange, filterOpterName, filterBillNo, listPagination, hasDeliveryCenter,
    hasAutoSelected } = requisitionModule;
  // const { storeId, loading, depotList, supplierList, typeList, warehouseList, newData, dataSourceAll, pagination,
  // dataSource, count, editableMem, selectData } = requisitionModule;
  const { menuData } = merchantApp;
  const requisitionSearchList = {
    menuData,
    storeId,
    newData,

    filterStatus,
    filterDataRange,
    filterOpterName,
    filterBillNo,
    hasDeliveryCenter,
    hasAutoSelected,
    storeList: depotList,
    selectStore(value) {
      dispatch({
        type: 'requisitionModule/mergeData',
        payload: {
          storeId: value,
        },
      });
      dispatch({
        type: 'requisitionModule/checkOrgInfo',
        payload: {
          storeId: value,
        },
      });
      dispatch({
        type: 'requisitionModule/getList',
        payload: {
          storeId: value,
          pageNo: 1,
        },
      });
    },
    onCreate(value) {
      dispatch({
        type: 'requisitionModule/createBill',
        payload: {
          dataSource: [value],
          id: 'add',
          storeId,
          opType: 'create',
        },
      });
      // dispatch({
      //   type: 'requisitionDetailsModule/intoModel',
      //   payload: {
      //     storeId,
      //   },
      // });
      // dispatch({
      //   type: 'requisitionDetailsModule/startWithType', // 写在此处不写在上面intoModel的原因是因为要驱动初始添加数据。
      //   payload: {
      //     opType: 'create',
      //   },
      // });
    },
    queryAll(value) {
      dispatch({
        type: 'requisitionModule/getList',
        payload: {
          value,
          pageNo: 1,
        },
      });
    },
    changeFilterStatus(event) {
      dispatch({
        type: 'requisitionModule/setFilterStatus',
        payload: {
          filterStatus: event.target.value,
        },
      });

      // 选择订单状态后自动搜索
      dispatch({
        type: 'requisitionModule/getList', // getRequisitionByFilter
        payload: { pageNo: 1 },
      });
    },
    changeFilterDataRange(dates) {
      dispatch({
        type: 'requisitionModule/setFilterDataRange',
        payload: {
          filterDataRange: dates,
        },
      });
      // 选择订单时间后自动搜索
      dispatch({
        type: 'requisitionModule/getList', // getRequisitionByFilter
        payload: { pageNo: 1 },
      });
    },
    changeFilterOpterName(event) {
      dispatch({
        type: 'requisitionModule/setFilterOpterName',
        payload: {
          filterOpterName: event.target.value,
        },
      });
      // // 修改创建人后自动搜索
      // dispatch({
      //   type: 'requisitionModule/getList', // getRequisitionByFilter
      //   payload: { pageNo: 1 },
      // });
    },
    changeFilterBillNo(event) {
      dispatch({
        type: 'requisitionModule/setFilterBillNo',
        payload: {
          filterBillNo: event.target.value,
        },
      });
    },
    filterRequisition() {
      dispatch({
        type: 'requisitionModule/getList', // getRequisitionByFilter
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
    toDetail(record, opType) {
      // console.log('record', record);
      dispatch({
        type: 'requisitionModule/createBill',
        payload: {
          dataSource: [],
          id: record.id,
          storeId,
          opType,
        },
      });
      // dispatch({
      //   type: 'requisitionDetailsModule/showDetailList',
      //   payload: {
      //     id: record.id,
      //     storeId,
      //     record,
      //   },
      // });
      // dispatch({
      //   type: 'requisitionDetailsModule/startWithType',
      //   payload: {
      //     opType,
      //   },
      // });
      // dispatch({
      //   type: 'requisitionDetailsModule/intoModel',
      //   payload: {
      //     storeId,
      //   },
      // });
    },
    deleteItem(id) {
      dispatch({
        type: 'requisitionModule/deleteRequisitionItem',
        payload: {
          id,
        },
      });
    },
    onPageChange(page) {
      dispatch({
        type: 'requisitionModule/getList',
        payload: {
          pageNo: page.current,
          pageSize: page.pageSize,
          storeId,
        },
      });
    },
    onPageSizeChange(current, pageSize) {
      dispatch({
        type: 'requisitionModule/getList',
        payload: {
          pageNo: 1,
          pageSize,
          storeId,
        },
      });
    },
    exportRequisition(id) {
      dispatch({
        type: 'requisitionModule/exportItem',
        payload: {
          id,
        },
      });
    },
  };

  return (
    <div className="routes">
      <RequisitionSearch {...requisitionSearchList} />
      <RequisitionList {...requisitionListDate} />
    </div>
  );
};

function mapStateToProps({ requisitionModule, merchantApp }) {
  return { requisitionModule, merchantApp };
}
export default connect(mapStateToProps)(Requisition);
