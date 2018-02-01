import React from 'react';
import { connect } from 'dva';
import OrderLibSearch from '../../components/Inventory/OrderLib/search';
import OrderLibList from '../../components/Inventory/OrderLib/list';

const OrderLib = ({ orderLibModule, dispatch, merchantApp }) => {
  const { orgId, storeId, orgList, storeList, loading, newData, dataSourceAll, billStatus, filterStatus, filterDataRange, filterOpterName, filterBillNo, listPagination, selectedRows } = orderLibModule;
  // const { storeId, loading, depotList, supplierList, typeList, warehouseList, newData, dataSourceAll, pagination,
  // dataSource, count, editableMem, selectData } = orderLibModule;
  const { menuData } = merchantApp;
  const orderLibSearchList = {
    menuData,
    orgId,
    storeId,
    newData,

    filterStatus,
    filterDataRange,
    filterOpterName,
    filterBillNo,
    selectedRows,
    orgList,
    storeList,
    key: orgId,
    selectOrg(value) {
      dispatch({ // 保存机构ID并且获取门店列表
        type: 'orderLibModule/queryStoreList',
        payload: {
          distribId: value,
          orgType: 1, // orgType:1 门店 2:总部
        },
      });
      dispatch({
        type: 'orderLibModule/updateData',
        payload: {
          dataSourceAll: [],
        },
      });
      dispatch({ // 点击机构名称要清空原来选择的门店列表，已选择全部门店的数据
        type: 'orderLibModule/saveStoreId',
        payload: { storeId: '' },
      });
      dispatch({
        type: 'orderLibModule/getList',
        payload: {
          distribId: value,
          pageNo: 1,
        },
      });
    },
    selectStore(value) {
      dispatch({ // 点击请购机构后立即保存设置
        type: 'orderLibModule/saveStoreId',
        payload: { storeId: value },
      });
      dispatch({ // 点击订单状态后立即搜索
        type: 'orderLibModule/getList', // getOrderLibByFilter
        payload: { pageNo: 1 },
      });
    },
    onGenerate(value) {
      dispatch({
        type: 'orderLibModule/generateBill',
        payload: {
        },
      });
      dispatch({
        type: 'orderLibDetailsModule/intoModel',
        payload: {
          storeId,
        },
      });
      dispatch({
        type: 'orderLibDetailsModule/showDetailListInGeneration',
        payload: {
        },
      });
      dispatch({
        type: 'orderLibDetailsModule/startWithType', // 写在此处不卸载上面intoModel的原因是因为要驱动初始添加数据。
        payload: {
          opType: 'generate',
        },
      });
    },
    queryAll(value) {
      dispatch({
        type: 'orderLibModule/getList',
        payload: {
          value,
          pageNo: 1,
        },
      });
    },
    changeFilterStatus(event) {
      dispatch({
        type: 'orderLibModule/setFilterStatus',
        payload: {
          filterStatus: event.target.value,
        },
      });

      dispatch({ // 点击订单状态后立即搜索
        type: 'orderLibModule/getList', // getOrderLibByFilter
        payload: { pageNo: 1 },
      });
    },
    changeFilterDataRange(dates) {
      dispatch({
        type: 'orderLibModule/setFilterDataRange',
        payload: {
          filterDataRange: dates,
        },
      });

      dispatch({ // 设置请购日期后立即搜索
        type: 'orderLibModule/getList', // getOrderLibByFilter
        payload: { pageNo: 1 },
      });
    },
    changeFilterOpterName(event) {
      dispatch({
        type: 'orderLibModule/setFilterOpterName',
        payload: {
          filterOpterName: event.target.value,
        },
      });
    },
    changeFilterBillNo(event) {
      dispatch({
        type: 'orderLibModule/setFilterBillNo',
        payload: {
          filterBillNo: event.target.value,
        },
      });
    },
    enterFilterBillNo() {
      dispatch({ // 输入编号后立即搜索
        type: 'orderLibModule/getList',
        payload: { pageNo: 1 },
      });
    },
    filterOrderLib() {
      dispatch({
        type: 'orderLibModule/getList', // getOrderLibByFilter
        payload: { pageNo: 1 },
      });
    },
  };

  const orderLibListDate = {
    menuData,
    orgId,
    storeId,
    dataSourceAll,
    listPagination,
    billStatus,
    loading,
    selectedRows,
    toDetail(record, opType) {
      dispatch({
        type: 'orderLibModule/generateBill',
        payload: {
          dataSource: [],
        },
      });
      dispatch({
        type: 'orderLibDetailsModule/intoModel',
        payload: {
          storeId,
        },
      });
      dispatch({
        type: 'orderLibDetailsModule/showDetailList',
        payload: {
          selIds: [record.id],
          selectedNos:[record.billNo],
          bussDate:record.bussDate,
          billInfo: record,
        },
      });
      dispatch({
        type: 'orderLibDetailsModule/startWithType',
        payload: {
          opType,
        },
      });
    },
    retreatItem(id) {
      dispatch({
        type: 'orderLibModule/retreatOrderLibItem',
        payload: {
          id,
        },
      });
    },
    onPageChange(page) {
      dispatch({
        type: 'orderLibModule/getList',
        payload: {
          pageNo: page.current,
          pageSize: page.pageSize,
          storeId,
        },
      });
    },
    onPageSizeChange(current, pageSize) {
      dispatch({
        type: 'orderLibModule/getList',
        payload: {
          pageNo: 1,
          pageSize,
          storeId,
        },
      });
    },
    exportOrderLib(id, storeId) {
      dispatch({
        type: 'orderLibModule/exportItem',
        payload: {
          id,
          storeId,
        },
      });
    },
    latestSelectedRows(selectedRows) {
      dispatch({
        type: 'orderLibModule/setSelectedRows',
        payload: {
          selectedRows,
        },
      });
    }
  };

  return (
    <div className="routes">
      <OrderLibSearch {...orderLibSearchList} />
      <OrderLibList {...orderLibListDate} />
    </div>
  );
};

function mapStateToProps({ orderLibModule, merchantApp }) {
  return { orderLibModule, merchantApp };
}
export default connect(mapStateToProps)(OrderLib);
