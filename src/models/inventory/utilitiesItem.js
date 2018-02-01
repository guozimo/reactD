import { parse } from 'qs';
import pathToRegexp from 'path-to-regexp';
import { routerRedux } from 'dva/router';
import { message } from 'antd';
import { create, remove, update, query, queryForm } from '../../services/inventory/utilitiesItem';
import { queryTime } from '../../services/inventory/common';

message.config({
  top: 300,
  duration: 5,
});

export default {
  namespace: 'utilitiesItem',
  state: {
    list: [],
    loading: false,
    currentItem: {},
    modalVisible: false,
    modalType: 'create',
    modalKey: null,
    startDateValue: null,
    endDateValue: null,
    endDateOpen: false,
    utilitiesId: null,
    storeId: null,
    utilitiesName: null,
    preCnt: 0,
    nextDate: null,
    startDateOn: true,
    modalError: false,
    modalErrorValue: null,
    serverTime: null,
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
        const re = pathToRegexp('/stock/utilitiesItem/:itemId/:storeId/:utilitiesName');
        const match = re.exec(pathname);
        if (match) {
          const itemId = match[1];
          const storeId = match[2];
          const utilitiesName = match[3];
          dispatch({
            type: 'query',
            payload: { ...location.query, rows: 10, storeId, id: itemId },
          });
          dispatch({
            type: 'querySuccess',
            payload: {
              utilitiesId: itemId,
              storeId,
              utilitiesName,
              startDateValue: null,
              endDateValue: null,
            },
          });
          dispatch({
            type: 'queryDate',
            payload: {},
          });
        }
      });
    },
  },

  effects: {
    * query({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      const data = yield call(query, parse(payload));
      const listData = data.data.data.scmUtilitiesDetail.data;
      for (let i = 0; i < listData.length; i += 1) {
        listData[i].enterDate = listData[i].startDate.concat(' 至 ', listData[i].endDate);
      }

      if (data.data && data.data.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            list: listData,
            pagination: {
              showSizeChanger: true,
              showQuickJumper: true,
              total: data.data.data.scmUtilitiesDetail.totalCount,
              current: data.data.data.scmUtilitiesDetail.page,
              showTotal: total => `共 ${total} 条`,
              size: data.data.data.scmUtilitiesDetail.limit,
              pageSizeOptions: [10, 20, 50, 100],
            },
          },
        });
      } else {
        message.error(data.data.errorInfo);
        yield put({ type: 'hideLoading' });
      }
    },
    * queryAdd({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      const data = yield call(queryForm, parse(payload));
      const addData = data.data.data;
      if (addData) {
        yield put({
          type: 'querySuccess',
          payload: addData,
        });
      }
    },
    * queryDate({ payload }, { call, put }) {
      const data = yield call(queryTime, parse(payload));
      if (data.data && data.data.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            serverTime: data.data.data.substr(0, 10),
          },
        });
      }
    },
    * delete({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      const data = yield call(remove, { id: payload.id, utilitiesId: payload.utilitiesId });
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
      const id = yield select(({ utilitiesItem }) => utilitiesItem.currentItem.id);
      const newUtilitiesItem = { ...payload, id };
      const data = yield call(update, newUtilitiesItem);
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
      const pagination = yield select(state => state.utilitiesItem.pagination);
      const id = yield select(state => state.utilitiesItem.utilitiesId);
      const storeId = yield select(state => state.utilitiesItem.storeId);
      const startDate = yield select(state => state.utilitiesItem.startDateValue);
      const endDate = yield select(state => state.utilitiesItem.endDateValue);
      yield put({ type: 'query', payload: { ...action.payload, page: pagination.current, rows: pagination.size, id, storeId, startDate, endDate } });
    },
    * back({ payload }, { put }) {
      // const path = '/stock/utilities';
      const path = `/stock/utilities/${payload.storeId}`;
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
