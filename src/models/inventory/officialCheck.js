import { parse } from 'qs';
import moment from 'moment';
import { routerRedux } from 'dva/router';
import { message } from 'antd';
import { queryOrg, querySupplier, queryWarehouse, queryType } from '../../services/inventory/common';
import { fetchList, deleteAnItem, exportAnItem } from '../../services/inventory/officialCheck';
// , queryAddPurchase, queryGoodsID, queryfind, queryExport, findScmInGoods, findTreeList
export default {
  namespace: 'officialCheckModule',
  state: {
    orgId: '',
    orgList: [],
    storeId: '',
    storeList: [],
    reposId: '',
    reposList: [],

    newData: {
      key: 2,
      id: '',
    },
    checkTypes: '',
    checkStatus: '',
    filterDataRange: [moment().add(-1, 'month'), moment()],
    // filterOpterName: '',
    filterBillNo: '',
    // hasDeliveryCenter: false,
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
    updateCheckTypes(state, action) {
      return { ...state, checkTypes: action.checkTypes };
    },
    updateCheckStatus(state, action) {
      return { ...state, checkStatus: action.checkStatus };
    },
    updateFilterDataRange(state, action) {
      return { ...state, filterDataRange: action.filterDataRange };
    },
    // updateFilterOpterName(state, action) {
    //   return { ...state, filterOpterName: action.filterOpterName };
    // },
    updateFilterBillNo(state, action) {
      return { ...state, filterBillNo: action.filterBillNo };
    },
    // setOrgInfo(state, action) {
    //   return { ...state, hasDeliveryCenter: action.hasDeliveryCenter };
    // },
    setStoreId(state, action) {
      return { ...state, storeId: action.storeId };
    },
    setReposId(state, action) {
      return { ...state, reposId: action.reposId };
    },
    saveOrgId(state, action) {
      return { ...state, orgId: action.orgId };
    },
  },
  effects: { // Fire an action or action a function here.
    * getList({ payload }, { call, put, select }) { // 请求内容
      yield put({ type: 'showLoading' });
      // let storeId = yield select(state => state.officialCheckModule.storeId);
      const { orgId, reposId, checkTypes, checkStatus, filterDataRange, filterBillNo, listPagination } = yield select(state => state.officialCheckModule);

      // storeId = payload.storeId || storeId; // 没有storeId参数的话使用state的
      const pageNo = payload.pageNo || listPagination.current;
      const pageSize = payload.pageSize || listPagination.pageSize;
      const fixedOrgId = orgId || payload.distribId;
      if (!fixedOrgId) {
        yield false;
      }

      const reqParams = {
        page: pageNo, // 查看第几页内容 默认1
        rows: pageSize, // 一页展示条数 默认20
        orgType: 2, // 总部盘点为2
        storeId: fixedOrgId, // 机构ID
        checkMode: checkTypes, // 类型（ 日盘  941; 周盘  942; 月盘  943; 其他  944）
        depotId: reposId, // 仓库
        // createUserName: filterOpterName, // 操作人
        billNo: filterBillNo, // 单据号
        // bussDate,//要货日期
        // remark,
        startDate: filterDataRange[0], // 开始时间
        endDate: filterDataRange[1], // 结束时间
        status: checkStatus, // 状态（961 未完成；962 已完成）
      };
      const listData = yield call(fetchList, parse(reqParams));
      if (listData.data && listData.data.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            dataSourceAll: listData.data.data.page.data,
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
        yield put({
          type: 'querySupplier',
          payload: {
            status: 1,
            rows: '1000',
          },
        });
        // yield put({
        //   type: 'queryWarehouse',
        //   payload: {
        //     status: 1,
        //     rows: '1000',
        //     queryString: '',
        //     storeId,
        //     limit: '1000',
        //   },
        // });
        // yield put({
        //   type: 'queryType',
        //   payload: {
        //     t: 910,
        //   },
        // });
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
            orgList: data.data.data.aclStoreList,
            weatherList: data.data.data.weatherList,
            eventList: data.data.data.holidaysList,
          },
        });
      } else {
        message.warning(`操作失败，请参考：${data.data.errorInfo}`);
        yield put({ type: 'hideLoading' });
      }
    },
    * queryStoreList({ payload }, { call, put }) {
      yield put({ type: 'saveOrgId', orgId: payload.distribId });
      const data = yield call(queryOrg, parse(payload));
      if (data.data && data.data.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            storeList: data.data.data.aclStoreList,
            weatherList: data.data.data.weatherList,
            eventList: data.data.data.holidaysList,
          },
        });
      } else {
        message.warning(`操作失败，请参考：${data.data.errorInfo}`);
      }
    },
    * queryReposList({ payload }, { call, put }) {
      // yield put({ type: 'setReposId', reposId: payload.distribId });
      const data = yield call(queryWarehouse, parse(payload));
      if (data.data && data.data.success) {
        const reposList = data.data.data.page.data;
        yield put({
          type: 'querySuccess',
          payload: {
            reposList, // 仓库数据
          },
        });

        yield put({
          type: 'officialCheckDetailsModule/setReposList',
          reposList,
        });
      } else {
        message.warning(`操作失败，请参考：${data.data.errorInfo}`);
      }
    },
    * createBill({ payload }, { put }) { // 新增请购单
      const path = '/stock/officialCheck/details';
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
    * deleteOfficialCheckItem({ payload }, { call, put, select }) { // 删除请购单
      const storeId = yield select(state => state.officialCheckModule.storeId);
      const optData = yield call(deleteAnItem, { id: payload.id });
      if (optData.data.code === '200' && optData.data.success === true) { // 删除成功
        yield put({
          type: 'getList',
          payload: {
            storeId,
          },
        });
      }
    },
    * setCheckTypes({ payload }, { put }) { // 设置搜索状态
      yield put({
        type: 'updateCheckTypes',
        checkTypes: payload.checkTypes,
      });
    },
    * setCheckStatus({ payload }, { put }) { // 设置搜索状态
      yield put({
        type: 'updateCheckStatus',
        checkStatus: payload.checkStatus,
      });
    },
    * setFilterDataRange({ payload }, { put }) { // 设置搜索时间范围
      yield put({
        type: 'updateFilterDataRange',
        filterDataRange: payload.filterDataRange,
      });
    },
    // * setFilterOpterName({ payload }, { put }) { // 设置操作人
    //   yield put({
    //     type: 'updateFilterOpterName',
    //     filterOpterName: payload.filterOpterName,
    //   });
    // },
    * setFilterBillNo({ payload }, { put }) { // 设置订单状态
      yield put({
        type: 'updateFilterBillNo',
        filterBillNo: payload.filterBillNo,
      });
    },
    // * getOfficialCheckByFilter({ payload }, { select, put }) { // 删除请购单  gose here 2017-9-18 19:27:20
    //   const { storeId, checkTypes, filterDataRange, filterOpterName, filterBillNo } = yield select(state => state.officialCheckModule);
    //   console.log("storeId, checkTypes, filterDataRange, filterOpterName, filterBillNo",storeId, checkTypes, filterDataRange, filterOpterName, filterBillNo);
    //   yield put({
    //     type: 'getList',
    //     payload: {
    //       storeId,
    //     },
    //   });
    // },
    * exportItem({ payload }, { select, call }) {
      const storeId = yield select(state => state.officialCheckModule.storeId);
      yield call(exportAnItem, { id: payload.id, storeId });
    },
    // * checkOrgInfo({ payload }, { call, put }) {
    //   const orgData = yield call(fetchOrgInfo, {});
    //   console.log('orgData', orgData);
    //   if (orgData.data.code === '200' && orgData.data.success === true) { // 删除成功
    //     const hasDeliveryCenter = orgData.data.data.flag;
    //     console.log('hasDeliveryCenter', hasDeliveryCenter);
    //     yield put({
    //       type: 'setOrgInfo', hasDeliveryCenter,
    //     });
    //   }
    // },
    * saveStoreId({ payload }, { put }) {
      yield put({
        type: 'setStoreId',
        storeId: payload.storeId,
      });
    },
    * saveReposId({ payload }, { put }) {
      yield put({
        type: 'setReposId',
        reposId: payload.reposId,
      });
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/stock/officialCheck') {
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
          // dispatch({
          //   type: 'editableMem',
          //   payload: { dataSource: [] },
          // });
          dispatch({
            type: 'getList', // getOrderLibByFilter
            payload: {},
          });
        }
        if (location.pathname === '/stock/officialCheck/details') {
          // console.log('location.pathname',location.pathname);
          // dispatch({
          //   type: 'editableMem',
          //   payload: { dataSource: [] },
          // });
          // dispatch({
          //   type: 'findTreeList',
          //   payload: { type: 0 },
          // });
        }
      });
    },
  },
};
