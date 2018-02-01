import { routerRedux } from 'dva/router';
import { message } from 'antd';
import { parse } from 'qs';
import pathToRegexp from 'path-to-regexp';
import { create, remove, update, query } from '../../services/inventory/utilities';
import { queryDepot } from '../../services/inventory/common';

message.config({
  top: 300,
  duration: 5,
});

export default {
  namespace: 'utilities',
  state: {
    list: [],
    listUtilities: [],
    depotList: [],
    loading: false,
    currentItem: {},
    modalVisible: false,
    modalType: 'create',
    modalKey: null,
    storeId: null,
    modalError: false,
    modalErrorValue: null,
    searchWord: null,
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => `共 ${total} 条`,
      current: 1,
      total: 0,
      size: 'default',
      pageSizeOptions: [10, 20, 50, 100],
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        const pathname = location.pathname;
        const re = pathToRegexp('/stock/utilities/:storeId');
        const match = re.exec(pathname);
        // 如果匹配则把storeId保存并请求该店信息，无论是否匹配，都请求分类
        if (match) {
          const storeId = match[1];
          dispatch({
            type: 'querySuccess',
            payload: { storeId },
          });
          dispatch({
            type: 'query',
            payload: { rows: 10, storeId },
          });
          dispatch({
            type: 'queryDepot',
            payload: { ...location.query, rows: 10 },
          });
        } else if (location.pathname === '/stock/utilities') {
          dispatch({
            type: 'queryDepot',
            payload: { ...location.query, rows: 10 },
          });
        }
      });
    },
  },

  effects: {
    * query({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      const data = yield call(query, parse(payload));
      if (data.data && data.data.success) {
        const listUtil = data.data.data.scmUtilitiesCount;
        for (let i = 0; i < listUtil.length; i += 1) {
          listUtil[i].id = i;
        }
        yield put({
          type: 'querySuccess',
          payload: {
            list: listUtil,
            listUtilities: data.data.data.scmUtilities,
          },
        });
      } else {
        message.error(data.data.errorInfo);
        yield put({ type: 'hideLoading' });
      }
    },
    * queryDepot({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      const data = yield call(queryDepot, parse(payload));
      if (data.data && data.data.success) {
        const aclStoreList = data.data.data.aclStoreList;
        yield put({
          type: 'querySuccess',
          payload: {
            depotList: aclStoreList,
          },
        });
      } else {
        message.error(data.data.errorInfo);
        yield put({ type: 'hideLoading' });
      }
    },
    * delete({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      const data = yield call(remove, { id: payload.id });
      if (data.data && data.data.success) {
        yield put({ type: 'reload' });
      } else {
        message.error(data.data.errorInfo);
        yield put({ type: 'hideLoading' });
      }
    },
    * create({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      const data = yield call(create, payload);
      if (data.data && data.data.success) {
        yield put({ type: 'hideModal' });
        yield put({ type: 'reload' });
        yield put({
          type: 'querySuccess',
          payload: {
            modalError: false,
            modalErrorValue: null,
          },
        });
      } else {
        yield put({
          type: 'querySuccess',
          payload: {
            modalError: true,
            modalErrorValue: data.data.errorInfo,
          },
        });
      }
    },
    * update({ payload }, { select, call, put }) {
      yield put({ type: 'showLoading' });
      const id = yield select(({ utilities }) => utilities.currentItem.id);
      const newUtilities = { ...payload, id };
      const data = yield call(update, newUtilities);
      if (data.data && data.data.success) {
        yield put({ type: 'hideModal' });
        yield put({ type: 'reload' });
        yield put({
          type: 'querySuccess',
          payload: {
            modalError: false,
            modalErrorValue: null,
          },
        });
      } else {
        yield put({
          type: 'querySuccess',
          payload: {
            modalError: true,
            modalErrorValue: data.data.errorInfo,
          },
        });
      }
    },
    * reload(action, { put, select }) {
      const storeId = yield select(state => state.utilities.storeId);
      const queryString = yield select(state => state.utilities.searchWord);
      yield put({ type: 'query', payload: { ...action.payload, storeId, queryString } });
    },
    * detail({ payload }, { put }) {
      const path = `/stock/utilitiesItem/${payload.id}/${payload.storeId}/${payload.utilitiesName}`;
      yield put(routerRedux.push(path));
    },
  },

  reducers: {
    showLoading(state) {
      return { ...state, loading: true };
    },
    hideLoading(state) {
      return { ...state, loading: false };
    },
    querySuccess(state, action) {
      return { ...state, ...action.payload, loading: false };
    },
    showModal(state, action) {
      return {
        ...state,
        ...action.payload,
        modalVisible: true,
        modalKey: Date.parse(new Date()) / 1000,
      };
    },
    hideModal(state) {
      return { ...state, modalVisible: false };
    },
  },
};
