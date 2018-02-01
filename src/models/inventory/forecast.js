import { parse } from 'qs';
import { message } from 'antd';
import { create, remove, update, query, queryChart, exports, queryDepot } from '../../services/inventory/forecast';
import { queryTime } from '../../services/inventory/common';

message.config({
  top: 300,
  duration: 5,
});

export default {
  namespace: 'forecast',
  state: {
    list: [],
    depotList: [],
    weatherList: [],
    eventList: [],
    salesChart: [],
    storeId: null,
    loading: false,
    currentItem: {},
    startDateValue: null,
    modalVisible: false,
    modalType: 'create',
    modalKey: null,
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
        if (location.pathname === '/stock/forecast') {
          dispatch({
            type: 'queryDepot',
            payload: { ...location.query, rows: 10 },
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
      if (data.data && data.data.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            list: data.data.data,
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
        yield put({
          type: 'querySuccess',
          payload: {
            depotList: data.data.data.aclStoreList,
            weatherList: data.data.data.weatherList,
            eventList: data.data.data.holidaysList,
          },
        });
      } else {
        message.error(data.data.errorInfo);
        yield put({ type: 'hideLoading' });
      }
    },
    * queryChart({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      const data = yield call(queryChart, parse(payload));
      if (data.data.data) {
        yield put({
          type: 'querySuccess',
          payload: {
            salesChart: data.data.data.page.data,
          },
        });
      } else {
        yield put({
          type: 'querySuccess',
          payload: {
            salesChart: [],
          },
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
      const data = yield call(remove, { id: payload });
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
          type: 'modalState',
          payload: {
            modalError: false,
            modalErrorValue: null,
          },
        });
      } else {
        yield put({
          type: 'modalState',
          payload: {
            modalError: true,
            modalErrorValue: data.data.errorInfo,
          },
        });
      }
    },

    * update({ payload }, { select, call, put }) {
      yield put({ type: 'showLoading' });
      const id = yield select(({ forecast }) => forecast.currentItem.id);
      const newForecast = { ...payload, id };
      const data = yield call(update, newForecast);
      if (data.data && data.data.success) {
        yield put({ type: 'hideModal' });
        yield put({ type: 'reload' });
        yield put({
          type: 'modalState',
          payload: {
            modalError: false,
            modalErrorValue: null,
          },
        });
      } else {
        yield put({
          type: 'modalState',
          payload: {
            modalError: true,
            modalErrorValue: data.data.errorInfo,
          },
        });
      }
    },
    * exports({ payload }, { call }) {
      yield call(exports, payload);
    },
    * reload(action, { put, select }) {
      const storeId = yield select(state => state.forecast.storeId);
      const forecastDate = yield select(state => state.forecast.startDateValue);
      yield put({ type: 'query', payload: { ...action.payload, storeId, forecastDate } });
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
    modalState(state, action) {
      return { ...state, ...action.payload, loading: false };
    },
  },
};
