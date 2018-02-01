import { parse } from 'qs';
import { message } from 'antd';
import moment from 'moment';
import { queryOrg, querySupplier, queryWarehouse, queryType, findTreeList, queryDepot } from '../../services/inventory/common';
import { query, exportAnItem } from '../../services/inventory/stockGlobalInOutSummary';
// , queryAddPurchase, queryGoodsID, queryfind, queryExport, findScmInGoods, findTreeList
export default {
  namespace: 'stockGlobalInOutSummary',
  state: {
    storeId: '',
    depotList: [],
    depotCannList: [], // 出入库

    newData: {
      key: 2,
      id: '',
    },
    filterOpterName: '',
    goodsName: '', // 物资名称
    depotId: '', // 首页调出仓库ID
    inNewDepotId: '', // 首页调入仓库ID
    searchTree: [], // 类别
    cateId: '',
    filterDataRange: [moment(), moment()],
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
    updateFilterDataRange(state, action) {
      return { ...state, filterDataRange: action.filterDataRange };
    },
    hideLoading(state) {
      return { ...state, loading: false };
    },
    updateFilterOpterName(state, action) {
      return { ...state, filterOpterName: action.filterOpterName };
    },
    updateFilterBillNo(state, action) {
      return { ...state, goodsName: action.goodsName };
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
    * findTreeList({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      const data = yield call(findTreeList, parse(payload));
      if (data) {
        yield put({
          type: 'querySuccess',
          payload: {
            searchTree: data.data.data,
          },
        });
      }
    },
    * setFilterDataRange({ payload }, { put }) { // 设置搜索时间范围
      yield put({
        type: 'updateFilterDataRange',
        filterDataRange: payload.filterDataRange,
      });
    },
    * getList({ payload }, { call, put, select }) { // 请求内容
      yield put({ type: 'showLoading' });
      let storeId = yield select(state => state.stockGlobalInOutSummary.storeId);
      const {
        goodsName,
        depotId,
        cateId,
        filterDataRange,
        listPagination,
        } = yield select(state => state.stockGlobalInOutSummary);

      storeId = payload.storeId || storeId; // 没有storeId参数的话使用state的
      const pageNo = payload.pageNo || listPagination.current;
      const pageSize = payload.pageSize || listPagination.pageSize;
      let reqParams = {};
      if (filterDataRange.length !== 0) {
        reqParams = {
          storeId,
          page: pageNo, // 查看第几页内容 默认1
          rows: pageSize, // 一页展示条数 默认20
          goodsName,
          depotId,
          cateId,
          startDate: filterDataRange[0].format('YYYY-MM-DD'), // 开始时间
          endDate: filterDataRange[1].format('YYYY-MM-DD'), // 结束时间
        };
      }
      const listData = yield call(query, parse(reqParams));
      if (listData.data && listData.data.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            dataSourceAll: listData.data.data.data,
            listPagination: {
              showSizeChanger: true,
              showQuickJumper: true,
              total: listData.data.data.totalCount,
              current: listData.data.data.page,
              showTotal: total => `共 ${total} 条`,
              pageSize: listData.data.data.limit,
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
    * setFilterOpterName({ payload }, { put }) { // 设置操作人
      yield put({
        type: 'updateFilterOpterName',
        filterOpterName: payload.filterOpterName,
      });
    },
    * setFilterBillNo({ payload }, { put }) { // 设置订单状态
      yield put({
        type: 'updateFilterBillNo',
        goodsName: payload.goodsName,
      });
    },
    * exportItem({ payload }, { select, call }) {
      const { storeId, goodsName, depotId, cateId, filterDataRange } = yield select(state => state.stockGlobalInOutSummary);
      let reqParams = {};
      if (filterDataRange.length !== 0) {
        reqParams = {
          storeId,
          goodsName,
          depotId,
          cateId,
          startDate: filterDataRange[0].format('YYYY-MM-DD'), // 开始时间
          endDate: filterDataRange[1].format('YYYY-MM-DD'), // 结束时间
        };
      }
      yield call(exportAnItem, parse(reqParams));
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        // console.warn("location.pathname", location.pathname);
        if (location.pathname === '/stock/stockGlobalInOutSummary') {
          dispatch({
            type: 'queryOrg',
            payload: { ...location.query, rows: 10, orgType: 2 }, // orgType:1 门店 2:总部
          });
        }
      });
    },
  },
};
