import React from 'react';
import { connect } from 'dva';
import OfficialCheckSearch from '../../components/Inventory/OfficialCheck/search';
import OfficialCheckList from '../../components/Inventory/OfficialCheck/list';

const OfficialCheck = ({ officialCheckModule, dispatch, merchantApp }) => {
  const { orgId, storeId, reposId, orgList, storeList, reposList, loading, newData, dataSourceAll, checkTypes, checkStatus, filterDataRange, filterBillNo, listPagination } = officialCheckModule;
  // const { storeId, loading, depotList, supplierList, typeList, warehouseList, newData, dataSourceAll, pagination,
  // dataSource, count, editableMem, selectData } = officialCheckModule;
  const { menuData } = merchantApp;
  const officialCheckSearchList = {
    menuData,
    orgId,
    storeId,
    reposId,
    orgList,
    storeList,
    reposList,

    checkTypes,
    checkStatus,

    newData,
    filterDataRange,
    filterBillNo,

    selectOrg(value) {
      dispatch({ // 点击机构名称要清空原来选择的门店列表，已选择全部门店的数据
        type: 'officialCheckModule/saveStoreId',
        payload: { storeId: '' },
      });
      dispatch({ // 点击机构名称要清空原来选择的仓库，已选择全部仓库的数据
        type: 'officialCheckModule/saveReposId',
        payload: { reposId: '' },
      });
      dispatch({
        type: 'officialCheckModule/querySuccess',
        payload: {
          orgId: value,
        },
      });
      dispatch({
        type: 'officialCheckModule/getList',
        payload: {
          distribId: value,
          pageNo: 1,
        },
      });
      // dispatch({ // 保存机构ID并且获取门店列表
      //   type: 'officialCheckModule/queryStoreList',
      //   payload: {
      //     distribId: value,
      //     orgType: 2, // orgType:1 门店 2:总部
      //   },
      // });
      dispatch({ // 保存机构ID并且获取门店列表
        type: 'officialCheckModule/queryReposList',
        payload: {
          storeId: value,
          // orgType: 2, // orgType:1 门店 2:总部
          limit: '1000',
          queryString: '',
          rows: '1000',
          status: 1,
        },
      });
    },
    selectStore(value) {
      dispatch({ // 点击请购机构后立即保存设置
        type: 'officialCheckModule/saveStoreId',
        payload: { storeId: value },
      });
      dispatch({ // 点击订单状态后立即搜索
        type: 'officialCheckModule/getList', // getOrderLibByFilter
        payload: { pageNo: 1 },
      });
    },
    selectRepos(value) {
      dispatch({ // 点击仓库后立即保存设置
        type: 'officialCheckModule/saveReposId',
        payload: { reposId: value },
      });
      dispatch({ // 点击仓库后立即搜索
        type: 'officialCheckModule/getList', // getOrderLibByFilter
        payload: { pageNo: 1 },
      });
    },
    onCreate(value) {
      dispatch({
        type: 'officialCheckModule/createBill',
        payload: {
          dataSource: [value],
        },
      });
      dispatch({
        type: 'officialCheckDetailsModule/mergeData',
        payload: {
          storeId,
          currRemarks: '',
          reposId: '',
        },
      });
      dispatch({
        type: 'officialCheckDetailsModule/startWithType', // 写在此处不写在上面intoModel的原因是因为要驱动初始添加数据。
        payload: {
          opType: 'create',
        },
      });
    },
    queryAll(value) {
      dispatch({
        type: 'officialCheckModule/getList',
        payload: {
          value,
          pageNo: 1,
        },
      });
    },
    changeCheckTypes(event) {
      dispatch({
        type: 'officialCheckModule/setCheckTypes',
        payload: {
          checkTypes: event.target.value,
        },
      });

      // 选择订单状态后自动搜索
      dispatch({
        type: 'officialCheckModule/getList', // getOfficialCheckByFilter
        payload: { pageNo: 1 },
      });
    },
    changeCheckStatus(event) {
      dispatch({
        type: 'officialCheckModule/setCheckStatus',
        payload: {
          checkStatus: event.target.value,
        },
      });

      // 选择订单状态后自动搜索
      dispatch({
        type: 'officialCheckModule/getList', // getOfficialCheckByFilter
        payload: { pageNo: 1 },
      });
    },
    changeFilterDataRange(dates) {
      dispatch({
        type: 'officialCheckModule/setFilterDataRange',
        payload: {
          filterDataRange: dates,
        },
      });
      // 选择订单时间后自动搜索
      dispatch({
        type: 'officialCheckModule/getList', // getOfficialCheckByFilter
        payload: { pageNo: 1 },
      });
    },
    // changeFilterOpterName(event) {
    //   dispatch({
    //     type: 'officialCheckModule/setFilterOpterName',
    //     payload: {
    //       filterOpterName: event.target.value,
    //     },
    //   });
    //   // // 修改创建人后自动搜索
    //   // dispatch({
    //   //   type: 'officialCheckModule/getList', // getOfficialCheckByFilter
    //   //   payload: { pageNo: 1 },
    //   // });
    // },
    changeFilterBillNo(event) {
      dispatch({
        type: 'officialCheckModule/setFilterBillNo',
        payload: {
          filterBillNo: event.target.value,
        },
      });
      dispatch({
        type: 'officialCheckModule/getList',
        payload: {
          pageNo: 1,
        },
      });
    },
    filterOfficialCheck() {
      dispatch({
        type: 'officialCheckModule/getList', // getOfficialCheckByFilter
        payload: { pageNo: 1 },
      });
    },
  };

  const officialCheckListDate = {
    menuData,
    orgId,
    storeId,
    dataSourceAll,
    listPagination,
    loading,
    toDetail(record, opType, editableRowObj) {
      // console.log('record', record);
      dispatch({
        type: 'officialCheckModule/createBill',
        payload: {
          dataSource: [],
        },
      });
      dispatch({
        type: 'officialCheckDetailsModule/showDetailList',
        payload: {
          id: record.id,
          storeId,
          record,
          editableRowObj,
        },
      });
      dispatch({
        type: 'officialCheckDetailsModule/startWithType',
        payload: {
          opType,
        },
      });
      dispatch({
        type: 'officialCheckDetailsModule/mergeData',
        payload: {
          storeId,
        },
      });
    },
    deleteItem(id) {
      dispatch({
        type: 'officialCheckModule/deleteOfficialCheckItem',
        payload: {
          id,
        },
      });
    },
    onPageChange(page) {
      dispatch({
        type: 'officialCheckModule/getList',
        payload: {
          pageNo: page.current,
          pageSize: page.pageSize,
          storeId,
        },
      });
    },
    onPageSizeChange(current, pageSize) {
      dispatch({
        type: 'officialCheckModule/getList',
        payload: {
          pageNo: 1,
          pageSize,
          storeId,
        },
      });
    },
    exportOfficialCheck(id) {
      dispatch({
        type: 'officialCheckModule/exportItem',
        payload: {
          id,
        },
      });
    },
  };

  return (
    <div className="routes">
      <OfficialCheckSearch {...officialCheckSearchList} />
      <OfficialCheckList {...officialCheckListDate} />
    </div>
  );
};

function mapStateToProps({ officialCheckModule, merchantApp }) {
  return { officialCheckModule, merchantApp };
}
export default connect(mapStateToProps)(OfficialCheck);
