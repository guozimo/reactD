import { parse } from 'qs';
import { message } from 'antd';
import { remove, query, queryTree, queryGoods, exports } from '../../services/inventory/cut';
import { queryTime, queryDepot } from '../../services/inventory/common';

message.config({
  top: 300,
  duration: 5,
});

export default {
  namespace: 'cut',
  state: {
    list: [],
    depotList: [],
    listGoods: [],
    searchTree: [],
    loading: false,
    goodsId: '',
    selectedRowKeys: null,
    goodsCode: '',
    goodsCategory: [],
    currentItem: {},
    modalVisible: false,
    modalType: 'create',
    modalKey: null,
    startDateValue: null,
    endDateValue: null,
    endDateOpen: false,
    serverTime: null,
    cateId: null,
    storeId: null,
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => `共 ${total} 条`,
      current: 1,
      total: 0,
      size: 'default',
      pageSizeOptions: [10, 20, 50, 100],
    },
    paginationGoods: {
      showTotal: total => `共 ${total} 条`,
      current: 1,
      total: 0,
      size: 'default',
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/stock/cut') {
          dispatch({
            type: 'queryDepot',
            payload: { ...location.query, rows: 10 },
          });
          dispatch({
            type: 'queryDate',
            payload: {},
          });
          dispatch({
            type: 'queryTree',
            payload: {
              type: '0',
            },
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
            list: data.data.data.page.data,
            pagination: {
              showSizeChanger: true,
              showQuickJumper: true,
              total: data.data.data.page.totalCount,
              current: data.data.data.page.page,
              showTotal: total => `共 ${total} 条`,
              size: data.data.data.page.limit,
              pageSizeOptions: [10, 20, 50, 100],
            },
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
    * exports({ payload }, { call }) {
      yield call(exports, payload);
    },
    * reload(action, { put, select }) {
      const pagination = yield select(state => state.cut.pagination);
      const storeId = yield select(state => state.cut.storeId);
      yield put({ type: 'query', payload: { ...action.payload, page: pagination.current, rows: pagination.size, storeId } });
    },
    * queryTree({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      const data = yield call(queryTree, parse(payload));
      if (data) {
        yield put({
          type: 'querySuccess',
          payload: {
            searchTree: data.data.data,
          },
        });
      }
    },
    * queryGoods({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      const data = yield call(queryGoods, parse(payload));
      if (data) {
        yield put({
          type: 'querySuccess',
          payload: {
            listGoods: data.data.data.page.data,
            paginationGoods: {
              total: data.data.data.page.totalCount,
              current: data.data.data.page.page,
              showTotal: total => `共 ${total} 条`,
            },
          },
        });
      }
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
