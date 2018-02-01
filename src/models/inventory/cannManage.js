import { parse } from 'qs';
import moment from 'moment';
import { routerRedux } from 'dva/router';
import { message } from 'antd';
import pathToRegexp from 'path-to-regexp';
import { queryOrg, querySupplier, queryWarehouse, queryType, queryDepot } from '../../services/inventory/common';
import { query, exportAnItem, delScmTransfer } from '../../services/inventory/cannManage';
// , queryAddPurchase, queryGoodsID, queryfind, queryExport, findScmInGoods, findTreeList
export default {
  namespace: 'cannManage',
  state: {
    storeId: '',
    depotList: [],
    depotCannList: [], // 出入库

    newData: {
      key: 2,
      id: '',
    },
    filterStatus: '',
    filterDataRange: [moment().add(-1, 'month'), moment()], // 采购日期
    filterOpterName: '',
    filterBillNo: '', // 首页编号
    outNewDepotId: '', // 首页调出仓库ID
    inNewDepotId: '', // 首页调入仓库ID
    listPagination: {
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
    warehouseSuccess(state, action) { return { ...state, ...action.payload, loading: false }; },
    queryTypeSuccess(state, action) { return { ...state, ...action.payload, loading: false }; },
    supplierSuccess(state, action) { return { ...state, ...action.payload, loading: false }; },
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
  },
  effects: { // Fire an action or action a function here.
    * queryDepot({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      const data = yield call(queryDepot, parse(payload));
      if (data.data && data.data.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            depotCannList: data.data.data.page.data,
            // weatherList: data.data.data.aclStoreList,
            // eventList: data.data.data.holidaysList,
          },
        });
      } else {
        message.warning(`操作失败，请参考：${data.data.errorInfo}`);
        yield put({ type: 'hideLoading' });
      }
    },
    * getList({ payload }, { call, put, select }) { // 请求内容
      yield put({ type: 'showLoading' });
      let storeId = yield select(state => state.cannManage.storeId);
      const {
        filterStatus,
        filterDataRange,
        filterBillNo,
        outNewDepotId,
        inNewDepotId,
        listPagination,
        } = yield select(state => state.cannManage);

      storeId = payload.storeId || storeId; // 没有storeId参数的话使用state的
      const pageNo = payload.pageNo || listPagination.current;
      const pageSize = payload.pageSize || listPagination.pageSize;
      let reqParams = {};
      if (filterDataRange.length !== 0) {
        reqParams = {
          storeId,
          page: pageNo, // 查看第几页内容 默认1
          rows: pageSize, // 一页展示条数 默认20
          billNo: filterBillNo, // 单据号
          outDepotId: outNewDepotId, // 调出库
          inDepotId: inNewDepotId, // 调入库
          // bussDate,//要货日期
          // remark,
          startDate: filterDataRange[0].format('YYYY-MM-DD'), // 开始时间
          endDate: filterDataRange[1].format('YYYY-MM-DD'), // 结束时间
          status: filterStatus, // 状态（964：待处理，965：已提交，962：已完成）
        };
      }
      const listData = yield call(query, parse(reqParams));
      if (listData.data && listData.data.success) {
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
      } else {
        message.warning(`操作失败，请参考：${listData.data.errorInfo}`);
        yield put({ type: 'hideLoading' });
      }
    },
    * querySupplier({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
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
        yield put({ type: 'hideLoading' });
      }
    },
    * queryOrg({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      const data = yield call(queryOrg, parse(payload));
      if (data.data && data.data.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            depotList: data.data.data.aclStoreList,
            weatherList: data.data.data.weatherList,
            eventList: data.data.data.holidaysList,
          },
        });
      } else {
        message.warning(`操作失败，请参考：${data.data.errorInfo}`);
        yield put({ type: 'hideLoading' });
      }
    },
    * createBill({ payload }, { put, select }) { // 新增请购单
      let storeIdAll = '';
      // console.warn("payload.dataSource[0]",payload.dataSource);
      if (payload.dataSource[0]) {
        storeIdAll = payload.dataSource[0];
      } else {
        const storeId = yield select(state => state.cannManage.storeId);
        storeIdAll = storeId;
      }
      // console.log("storeIdAll",storeIdAll);
      const timeId = moment().valueOf();
      const path = `/stock/cannManage/details/${timeId}`;
      const cannManageAll = {
        storeId: storeIdAll,
        cannId: payload.cannId,
        opType: payload.opType,
      };
      window.sessionStorage.setItem(`cannManage_${timeId}`, JSON.stringify(cannManageAll));
      yield put(routerRedux.push(path));
    },
    * queryWarehouse({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      const data = yield call(queryWarehouse, parse(payload));
      if (data.data && data.data.success) {
        yield put({
          type: 'warehouseSuccess',
          payload: {
            warehouseList: data.data.data.page.data,
          },
        });
      } else {
        message.warning(`操作失败，请参考：${data.data.errorInfo}`);
        yield put({ type: 'hideLoading' });
      }
    },
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
    * deleteRequisitionItem({ payload }, { call, put }) { // 删除请购单
      // const storeId = yield select(state => state.cannManage.storeId);
      const optData = yield call(delScmTransfer, parse(payload));
      if (optData.data.code === '200' && optData.data.success === true) { // 删除成功
        yield put({
          type: 'getList',
          payload: {
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
    //   const { storeId, filterStatus, filterDataRange, filterOpterName, filterBillNo } = yield select(state => state.cannManage);
    //   console.log("storeId, filterStatus, filterDataRange, filterOpterName, filterBillNo",storeId, filterStatus, filterDataRange, filterOpterName, filterBillNo);
    //   yield put({
    //     type: 'getList',
    //     payload: {
    //       storeId,
    //     },
    //   });
    // },
    * exportItem({ payload }, { select, call }) {
      const storeId = yield select(state => state.cannManage.storeId);
      yield call(exportAnItem, { id: payload.id, storeId });
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        // console.warn("location.pathname", location.pathname);
        if (location.pathname === '/stock/cannManage') {
          dispatch({
            type: 'queryOrg',
            payload: { ...location.query, rows: 10, orgType: 2 }, // orgType:1 门店 2:总部
          });
          // dispatch({
          //   type: 'querySupplier',
          //   payload: {
          //     status: 1,
          //     rows: '1000',
          //   },
          // });
          // dispatch({
          //   type: 'queryWarehouse',
          //   payload: {
          //     status: 1,
          //     rows: '1000',
          //     queryString: '',
          //     storeId: '',
          //     limit: '1000',
          //   },
          // });
          // dispatch({
          //   type: 'queryType',
          //   payload: {
          //     t: 910,
          //   },
          // });
          // // dispatch({
          // //   type: 'editableMem',
          // //   payload: { dataSource: [] },
          // // });
          // dispatch({
          //   type: 'getList', // getOrderLibByFilter
          //   payload: {},
          // });
        }
        const pathname = location.pathname;
        const re = pathToRegexp('/stock/cannManage/details/:storeIdKey');
        const match = re.exec(pathname);
        if (match) {
          const storeIdKey = match[1];
          let cannManageAll = window.sessionStorage.getItem(`cannManage_${storeIdKey}`);
          // console.warn("请求的全部的值", JSON.parse(cannManageAll));
          cannManageAll = JSON.parse(cannManageAll);
          // console.warn("33333333请求的全部的值", cannManageAll.storeId, cannManageAll.type);
          dispatch({
            type: 'querySuccess',
            payload: { storeId: cannManageAll.storeId },
          });
        }
        // if (location.pathname === '/stock/cannManage/details/:storeIdKey') {
        //   const pathname = location.pathname;
        //   const re = pathToRegexp('/stock/cannManage/details?');
        //   const match = re.exec(pathname);
        //   console.warn("match",match,"pathname",pathname);
        //   console.warn("-----------------进来了");
        //   // dispatch({
        //   //   type: 'editableMem',
        //   //   payload: { dataSource: [] },
        //   // });
        //   dispatch({
        //     type: 'findTreeList',
        //     payload: { type: 0 },
        //   });
        // }
      });
    },
  },
};
