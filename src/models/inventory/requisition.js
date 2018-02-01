import { parse } from 'qs';
import moment from 'moment';
import { routerRedux } from 'dva/router';
import { message } from 'antd';
import { queryDepot, querySupplier, queryType } from '../../services/inventory/common';
import { fetchList, deleteAnItem, exportAnItem, fetchOrgInfo } from '../../services/inventory/requisition';
// , queryAddPurchase, queryGoodsID, queryfind, queryExport, findScmInGoods, findTreeList
export default {
  namespace: 'requisitionModule',
  state: {
    storeId: '',
    depotList: [], // 门店列表
    newData: {
      key: 2,
      id: '',
    },
    filterStatus: '',
    filterDataRange: [moment().subtract(1, 'month'), moment()], // 请购日期
    filterOpterName: '',
    filterBillNo: '', // 请购单号
    hasDeliveryCenter: false,
    hasAutoSelected: false, // 默认false标示没有设置过，设置过的话在只有一个机构自动选中后不再进入选中项之后的流程
    listPagination: { // 表格配置项
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => `共 ${total} 条`,
      current: 1,
      total: 0,
      pageSize: 10,
      pageSizeOptions: [10, 20, 50, 100],
    },
  },
  reducers: { // Update above state.
    querySuccess(state, action) {
      return { ...state, ...action.payload, loading: false };
    },
    mergeData(state, action) {
      return { ...state, ...action.payload };
    },
    warehouseSuccess(state, action) { return { ...state, ...action.payload, loading: false }; },
    queryTypeSuccess(state, action) { return { ...state, ...action.payload }; },
    supplierSuccess(state, action) { return { ...state, ...action.payload }; },
    showLoading(state) {
      return { ...state, loading: true };
    },
    hideLoading(state) {
      return { ...state, loading: false };
    },
    updateFilterStatus(state, action) {
      return { ...state, filterStatus: action.filterStatus };
    },
    updateFilterDataRange(state, action) {
      return { ...state, filterDataRange: action.filterDataRange };
    },
    updateFilterOpterName(state, action) {
      return { ...state, filterOpterName: action.filterOpterName };
    },
    updateFilterBillNo(state, action) {
      return { ...state, filterBillNo: action.filterBillNo };
    },
    setOrgInfo(state, action) {
      return { ...state, hasDeliveryCenter: action.hasDeliveryCenter, hasAutoSelected: true };
    },
  },
  effects: { // Fire an action or action a function here.
    * getList({ payload }, { call, put, select }) { // 请求内容
      yield put({ type: 'showLoading' });
      let storeId = yield select(state => state.requisitionModule.storeId);
      const { filterStatus, filterDataRange, filterOpterName, filterBillNo, listPagination } = yield select(state => state.requisitionModule);

      storeId = payload.storeId || storeId; // 没有storeId参数的话使用state的
      const pageNo = payload.pageNo || listPagination.current;
      const pageSize = payload.pageSize || listPagination.pageSize;
      if (!storeId) {
        yield false;
      }

      const reqParams = {
        storeId,
        page: pageNo, // 查看第几页内容 默认1
        rows: pageSize, // 一页展示条数 默认20
        createUserName: filterOpterName, // 操作人
        billNo: filterBillNo, // 单据号
        // bussDate,//要货日期
        // remark,
        start: filterDataRange[0], // 开始时间
        end: filterDataRange[1], // 结束时间
        status: filterStatus, // 状态（964：待处理，965：已提交，962：已完成）
      };
      const listData = yield call(fetchList, parse(reqParams));
      // console.log(listData);
      if (listData.data && listData.data.success) {
        if (listData.data.data.page === null) {
          yield put({
            type: 'querySuccess',
            payload: {
              dataSourceAll: null,
              billStatus: listData.data.data.billStatus,
              listPagination: {
                showSizeChanger: true,
                showQuickJumper: true,
                total: 0,
                current: 0,
                pageSize: 10,
                pageSizeOptions: [10, 20, 50, 100],
              },
            },
          });
        } else {
          yield put({
            type: 'querySuccess',
            payload: {
              dataSourceAll: listData.data.data.page.data,
              billStatus: listData.data.data.billStatus,
              listPagination: {
                showSizeChanger: true,
                showQuickJumper: true,
                total: listData.data.data.page.totalCount,
                current: listData.data.data.page.page,
                showTotal: total => `共 ${total} 条`,
                pageSize: listData.data.data.page.limit,
                pageSizeOptions: [10, 20, 50, 100],
              },
            },
          });
        }
      } else {
        message.warning(`操作失败，请参考：${listData.data.errorInfo}`);
        yield put({ type: 'hideLoading' });
      }
    },
    * querySupplier({ payload }, { call, put }) {
      // yield put({ type: 'showLoading' });
      const data = yield call(querySupplier, parse(payload));
      if (data.data && data.data.success) {
        yield put({
          type: 'supplierSuccess',
          payload: {
            supplierList: data.data.data.page.data,
          },
        });
      } else {
        message.warning(`操作失败，请参考：${data.data.errorInfo}`);
        // yield put({ type: 'hideLoading' });
      }
    },
    * queryDepot({ payload }, { call, put }) {
      // yield put({ type: 'showLoading' });
      const data = yield call(queryDepot, parse(payload));
      const storeLists = data.data.data.aclStoreList;
      // 判断门店请购门店列表是否只有一个，若是默认显示
      // const storeLists = storeLists1.slice(0, 1);
      if (data.data && data.data.success) {
        if (storeLists.length === 1) {
          yield put({
            type: 'mergeData',
            payload: {
              depotList: storeLists,
              storeId: storeLists[0].id,
            },
          });
          yield put({
            type: 'getList',
            payload: {
              storeId: storeLists[0].id,
              pageNo: 1,
            },
          });
        } else {
          yield put({
            type: 'mergeData',
            payload: {
              depotList: storeLists,
            },
          });
        }
      } else {
        message.warning(`操作失败，请参考：${data.data.errorInfo}`);
        // yield put({ type: 'hideLoading' });
      }
    },
    * createBill({ payload }, { put }) { // 新增请购单
      const path = `/stock/requisition/details/${payload.opType}/${payload.id}/${payload.storeId}`;
      yield put(routerRedux.push(path));
    },
    // 与queryDepot重复，去掉
    // * queryWarehouse({ payload }, { call, put }) {
    //   yield put({ type: 'showLoading' });
    //   const data = yield call(queryWarehouse, parse(payload));
    //   if (data.data && data.data.success) {
    //     yield put({
    //       type: 'warehouseSuccess',
    //       payload: {
    //         warehouseList: data.data.data.page.data,
    //       },
    //     });
    //   } else {
    //     message.warning(`操作失败，请参考：${data.data.errorInfo}`);
    //     yield put({ type: 'hideLoading' });
    //   }
    // },
    * queryType({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      const data = yield call(queryType, parse(payload));
      if (data.data && data.data.success) {
        yield put({
          type: 'queryTypeSuccess',
          payload: {
            typeList: data.data.data,
          },
        });
      } else {
        message.warning(`操作失败，请参考：${data.data.errorInfo}`);
        yield put({ type: 'hideLoading' });
      }
    },
    * deleteRequisitionItem({ payload }, { call, put, select }) { // 删除请购单
      const storeId = yield select(state => state.requisitionModule.storeId);
      const optData = yield call(deleteAnItem, { delIds: [payload.id], storeId });
      if (optData.data.code === '200' && optData.data.success === true) { // 删除成功
        yield put({
          type: 'getList',
          payload: {
            storeId,
          },
        });
      }
    },
    * setFilterStatus({ payload }, { put }) { // 设置搜索状态
      yield put({
        type: 'updateFilterStatus',
        filterStatus: payload.filterStatus,
      });
    },
    * setFilterDataRange({ payload }, { put }) { // 设置搜索时间范围
      yield put({
        type: 'updateFilterDataRange',
        filterDataRange: payload.filterDataRange,
      });
    },
    * setFilterOpterName({ payload }, { put }) { // 设置操作人
      yield put({
        type: 'updateFilterOpterName',
        filterOpterName: payload.filterOpterName,
      });
    },
    * setFilterBillNo({ payload }, { put }) { // 设置订单状态
      yield put({
        type: 'updateFilterBillNo',
        filterBillNo: payload.filterBillNo,
      });
    },
    // * getRequisitionByFilter({ payload }, { select, put }) { // 删除请购单  gose here 2017-9-18 19:27:20
    //   const { storeId, filterStatus, filterDataRange, filterOpterName, filterBillNo } = yield select(state => state.requisitionModule);
    //   console.log("storeId, filterStatus, filterDataRange, filterOpterName, filterBillNo",storeId, filterStatus, filterDataRange, filterOpterName, filterBillNo);
    //   yield put({
    //     type: 'getList',
    //     payload: {
    //       storeId,
    //     },
    //   });
    // },
    * exportItem({ payload }, { select, call }) {
      const storeId = yield select(state => state.requisitionModule.storeId);
      yield call(exportAnItem, { id: payload.id, storeId });
    },
    * checkOrgInfo({ payload }, { call, put }) {
      const orgData = yield call(fetchOrgInfo, { storeId: payload.storeId });
      if (orgData.data.code === '200' && orgData.data.success === true) { // 删除成功
        const hasDeliveryCenter = orgData.data.data.flag;
        yield put({
          type: 'setOrgInfo', hasDeliveryCenter,
        });
      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/stock/requisition') {
          dispatch({
            type: 'queryDepot',
            payload: { ...location.query, rows: 10, orgType: 1 }, // orgType:1 门店 2:总部
          });
          dispatch({
            type: 'querySupplier',
            payload: {
              status: 1,
              rows: '1000',
            },
          });
          dispatch({
            type: 'getList', // getOrderLibByFilter
            payload: {},
          });
        }
        // if (location.pathname === '/stock/requisition/details') {
          // console.log('location.pathname',location.pathname);
          // dispatch({
          //   type: 'editableMem',
          //   payload: { dataSource: [] },
          // });
          // dispatch({
          //   type: 'findTreeList',
          //   payload: { type: 0 },
          // });
        // }
      });
    },
  },
};
