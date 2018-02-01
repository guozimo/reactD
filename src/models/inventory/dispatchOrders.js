import { parse } from 'qs';
import moment from 'moment';
import { routerRedux } from 'dva/router';
// import pathToRegexp from 'path-to-regexp';
import { message } from 'antd';
import { queryOrg, queryWarehouse } from '../../services/inventory/common';
import { queryStoreList, queryExport, closeScmDirect } from '../../services/inventory/dispatchOrders';

export default {
  namespace: 'dispatchOrders',
  state: {
    storeId: '',
    distribId: '',
    depotId: '',
    depotList: [],
    orderStatusList: [],
    wareHouseList: [],
    depotDispatchList: [],
    initialOrgName: '',
    pageType: 'view',
    fetching: false,
    newData: {
      key: 2,
      id: '',
    },
    filterStatus: '',
    filterDataRange: [moment().add(-15, 'days'), moment()], // 订单时间
    filterOpterName: '',
    filterBillNo: '', // 配送订单号
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
    queryStoreSuccess(state, action) {
      return { ...state, ...action.payload };
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
    updateFilterBillNo(state, action) {
      return { ...state, filterBillNo: action.filterBillNo };
    },
    updateFilterDataRange(state, action) {
      return { ...state, filterDataRange: action.filterDataRange };
    },
    setStoreId(state, action) {
      return { ...state, storeId: action.storeId };
    },
  },
  effects: {
    * getList({ payload }, { call, put, select }) { // 请求内容
      yield put({ type: 'showLoading' });
      let { storeId, distribId, depotId } = yield select(state => state.dispatchOrders);
      const listPagination = yield select(state => state.dispatchOrders.listPagination);
      const {
        filterStatus,
        filterDataRange,
        filterBillNo,
        } = yield select(state => state.dispatchOrders);

      const pageNo = payload.pageNo || listPagination.current;
      const pageSize = payload.pageSize || listPagination.pageSize;
      storeId = payload.storeId || storeId; // 没有storeId参数的话使用state的
      distribId = payload.distribId || distribId;
      depotId = payload.depotId || depotId;
      if (!distribId) {
        yield false;
      }
      let reqParams = {};
      if (filterDataRange.length !== 0) {
        reqParams = {
          storeId,
          distribId,
          depotId,
          page: pageNo, // 总共页数
          rows: pageSize, // 一页显示多少条
          billNo: filterBillNo, // 配送订单号
          // remark,
          startDate: filterDataRange[0].format('YYYY-MM-DD'), // 开始时间
          endDate: filterDataRange[1].format('YYYY-MM-DD'), // 结束时间
          status: filterStatus, // 状态（964：待处理，965：已提交，962：已完成）
        };
      }
      const listData = yield call(queryStoreList, parse(reqParams));
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
        yield put({
          type: 'queryStoreSuccess',
          payload: {
            dataSourceAll: [],
            listPagination: {
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: '共 0 条',
              current: 1,
              total: 0,
              size: 10,
              pageSizeOptions: [10, 20, 50, 100],
            },
          },
        });
        yield put({ type: 'hideLoading' });
      }
    },
    * queryOrg({ payload }, { call, put }) { // 配送机构 depotList
      yield put({ type: 'showLoading' });
      const data = yield call(queryOrg, parse(payload));
      if (data.data && data.data.success) {
        const storeLists = data.data.data.aclStoreList;
        let currDistribId = '';
        let initialValue;
        if (storeLists.length === 1) {
          currDistribId = storeLists[0].id;
          initialValue = storeLists[0].name;
          const storeData = yield call(queryOrg, parse(Object.assign(payload, { distribId: currDistribId, orgType: 1 })));
          const storeIdItem = storeData.data.data.aclStoreList;
          const currStoreId = storeIdItem[0].id;
          yield put({
            type: 'querySuccess',
            payload: {
              distribId: currDistribId,
              initialOrgName: initialValue,
              depotList: storeLists,
            },
          });
          yield put({
            type: 'queryStore',
            payload: {
              distribId: currDistribId,
              orgType: 1,
            },
          });
          yield put({
            type: 'queryWarehouse',
            payload: {
              storeId: currDistribId,
            },
          });
          yield put({
            type: 'getList',
            payload: {
              storeId: storeIdItem.length === 1 ? currStoreId : '',
              distribId: currDistribId,
            },
          });
        }
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
    * queryWarehouse({ payload }, { call, put, select }) { // 出库仓库
      yield put({ type: 'showLoading' });
      const distribId = yield select(state => state.dispatchOrders.distribId);
      const data = yield call(queryWarehouse, parse({ storeId: distribId }));
      if (data.data && data.data.success) {
        const houseList = data.data.data.page.data;
        houseList.unshift({ id: '', depotName: '请选择' });
        yield put({
          type: 'querySuccess',
          payload: {
            wareHouseList: houseList,
          },
        });
      } else {
        message.error(`返回数据出错，原因：${data.data.errorInfo}`);
        yield put({ type: 'hideLoading' });
      }
    },
    * setFilterDataRange({ payload }, { put }) { // 设置搜索时间范围
      yield put({
        type: 'updateFilterDataRange',
        filterDataRange: payload.filterDataRange,
      });
    },
    * queryStore({ payload }, { call, put, select }) { // 收货机构
      // yield put({ type: 'showLoading' });
      const { distribId } = yield select(state => state.dispatchOrders);
      const distribIds = payload.distribId || distribId;
      const data = yield call(queryOrg, parse(Object.assign(payload, { distribId: distribIds, orgType: 1 })));
      if (data.data && data.data.success) {
        const storeLists = data.data.data.aclStoreList;
        // const storeLists = storeLists1.slice(0, 1);
        let currStoreId = '';
        let initialValue = '请选择';
        if (storeLists.length > 1) {
          storeLists.unshift({ id: '', name: initialValue });
        } else if (storeLists.length === 1) {
          currStoreId = storeLists[0].id;
          initialValue = storeLists[0].name;
        }
        yield put({
          type: 'queryStoreSuccess',
          payload: {
            storeId: currStoreId,
            depotDispatchList: storeLists,
          },
        });
      } else {
        message.warning(`操作失败，请参考：${data.data.errorInfo}`);
        // yield put({ type: 'hideLoading' });
      }
    },
    * setFilterStatus({ payload }, { put }) { // 设置搜索状态
      yield put({
        type: 'updateFilterStatus',
        filterStatus: payload.filterStatus,
      });
    },
    * setFilterBillNo({ payload }, { put }) { // 配送订单号
      yield put({
        type: 'updateFilterBillNo',
        filterBillNo: payload.filterBillNo,
      });
    },
    * saveStoreId({ payload }, { put }) {
      yield put({
        type: 'setStoreId',
        storeId: payload.storeId,
      });
    },
    * toItem({ payload }, { put }) { // 编辑查看配送订单
      let path = '';
      if (payload.type === 'view') {
        path = `/stock/dispatchOrders/details/view/${payload.id}`;
      } else if (payload.type === 'edit') {
        path = `/stock/dispatchOrders/details/edit/${payload.id}`;
      }
      yield put(routerRedux.push(path));
    },
    * export({ payload }, { call }) { // 导出 接口使用window.open(url)
      yield call(queryExport, { payload });
    },
    * close({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      const data = yield call(closeScmDirect, { id: payload.id, status: payload.status });
      if (data.data && data.data.success) {
        yield put({ type: 'reload' });
        message.success('关闭成功！');
      } else {
        message.error(data.data.errorInfo);
        yield put({ type: 'hideLoading' });
      }
    },
    * reload(action, { put }) {
      yield put(
        {
          type: 'getList',
          payload: {
            loading: false,
          },
        });
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/stock/dispatchOrders') {
          dispatch({
            type: 'queryOrg',
            payload: { ...location.query, rows: 10, orgType: 2 }, // orgType:1 门店 2:总部
          });
          dispatch({
            type: 'getList',
            payload: {
              rows: 10,
            },
          });
        }
      });
    },
  },
};
