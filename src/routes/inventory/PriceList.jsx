import React from 'react';
import { connect } from 'dva';
import PriceListSearch from '../../components/Inventory/PriceList/search';
import PriceListList from '../../components/Inventory/PriceList/list';

const PriceList = ({ priceListModule, dispatch }) => {
  const { orgId, orgList, loading, newData, dataSourceAll, billStatus, filterStatus, filterDataRange, filterOpterName, filterBillNo, listPagination } = priceListModule;
  // const { storeId, loading, depotList, supplierList, typeList, warehouseList, newData, dataSourceAll, pagination,
  // dataSource, count, editableMem, selectData } = priceListModule;
  const priceListSearchList = {
    orgId,
    newData,

    filterStatus,
    filterDataRange,
    filterOpterName,
    filterBillNo,
    orgList,
    key: orgId,
    // storeList: depotList,
    selectOrg(value) {
      dispatch({
        type: 'priceListModule/getList',
        payload: {
          distribId: value,
          pageNo: 1,
        },
      });
      // dispatch({
      //   type: 'priceListModule/mergeData',
      //   payload: {
      //     orgId: value,
      //   },
      // });
      dispatch({ // 保存机构ID并且获取门店列表
        type: 'priceListModule/setOrgId',
        payload: {
          distribId: value,
        },
      });
      dispatch({ // 保存机构ID，以方便filter.jsx显示所选择的机构信息
        type: 'priceListDetailsModule/setSelectedOrg',
        payload: {
          distribId: value,
        },
      });
      dispatch({ // 每次进入新增功能是需要清空所选择的门店
        type: 'priceListDetailsModule/setSelectedStore',
        payload: {
          storeList: [],
        },
      });

      // dispatch({ // 点击机构名称要清空原来选择的门店列表，已选择全部门店的数据
      //   type: 'priceListModule/saveStoreId',
      //   payload: { storeId: '' },
      // });
    },
    selectStore(value) {
      dispatch({
        type: 'priceListModule/getList',
        payload: {
          storeId: value,
          pageNo: 1,
        },
      });
      dispatch({
        type: 'priceListModule/mergeData',
        payload: {
          storeId: value,
        },
      });
      // dispatch({
      //   type: 'priceListModule/checkOrgInfo',
      //   payload: {
      //     storeId: value,
      //   },
      // });
    },
    onCreate(value) {
      dispatch({
        type: 'priceListModule/createBill',
        payload: {
          dataSource: [value],
          opType: 'create',
        },
      });
      dispatch({
        type: 'priceListDetailsModule/startWithType', // 写在此处不写在上面intoModel的原因是因为要驱动初始添加数据。
        payload: {
          opType: 'create',
        },
      });
    },
    queryAll(value) {
      dispatch({
        type: 'priceListModule/getList',
        payload: {
          value,
          pageNo: 1,
        },
      });
    },
    changeFilterStatus(event) {
      dispatch({
        type: 'priceListModule/setFilterStatus',
        payload: {
          filterStatus: event.target.value,
        },
      });

      // 选择订单状态后自动搜索
      dispatch({
        type: 'priceListModule/getList', // getPriceListByFilter
        payload: { pageNo: 1 },
      });
    },
    changeFilterDataRange(dates) {
      dispatch({
        type: 'priceListModule/setFilterDataRange',
        payload: {
          filterDataRange: dates,
        },
      });
      // 选择订单时间后自动搜索
      dispatch({
        type: 'priceListModule/getList', // getPriceListByFilter
        payload: { pageNo: 1 },
      });
    },
    changeFilterOpterName(event) {
      dispatch({
        type: 'priceListModule/setFilterOpterName',
        payload: {
          filterOpterName: event.target.value,
        },
      });
      // // 修改创建人后自动搜索
      // dispatch({
      //   type: 'priceListModule/getList', // getPriceListByFilter
      //   payload: { pageNo: 1 },
      // });
    },
    changeFilterBillNo(event) {
      dispatch({
        type: 'priceListModule/setFilterBillNo',
        payload: {
          filterBillNo: event.target.value,
        },
      });
    },
    filterPriceList() {
      dispatch({
        type: 'priceListModule/getList', // getPriceListByFilter
        payload: { pageNo: 1 },
      });
    },
  };

  const priceListListDate = {
    orgId,
    dataSourceAll,
    listPagination,
    billStatus,
    loading,
    toDetail(record, opType) {
      // console.log('record', record);
      dispatch({
        type: 'priceListModule/createBill',
        payload: {
          dataSource: [],
          opType,
          record,
        },
      });
      // dispatch({
      //   type: 'priceListDetailsModule/showDetailList',
      //   payload: {
      //     orgId,
      //     record,
      //     opType,
      //   },
      // });
      // dispatch({
      //   type: 'priceListDetailsModule/intoModel',
      //   payload: {
      //     orgId,
      //   },
      // });
      // dispatch({
      //   type: 'priceListDetailsModule/startWithType',
      //   payload: {
      //     opType,
      //   },
      // });
    },
    deleteItem(record) {
      dispatch({
        type: 'priceListModule/deletePriceListItem',
        payload: {
          record,
        },
      });
    },
    abolishItem(record) {
      dispatch({
        type: 'priceListModule/abolishPriceListItem',
        payload: {
          record,
        },
      });
    },
    onPageChange(page) {
      dispatch({
        type: 'priceListModule/getList',
        payload: {
          pageNo: page.current,
          pageSize: page.pageSize,
          orgId,
        },
      });
    },
    onPageSizeChange(current, pageSize) {
      dispatch({
        type: 'priceListModule/getList',
        payload: {
          pageNo: 1,
          pageSize,
          orgId,
        },
      });
    },
    exportPriceList(id) {
      dispatch({
        type: 'priceListModule/exportItem',
        payload: {
          id,
        },
      });
    },
  };

  return (
    <div className="routes">
      <PriceListSearch {...priceListSearchList} />
      <PriceListList {...priceListListDate} />
    </div>
  );
};

function mapStateToProps({ priceListModule }) {
  return { priceListModule };
}
export default connect(mapStateToProps)(PriceList);
