import { parse } from 'qs';
import { message } from 'antd';
// import {  } from '../../services/inventory/common';
import { query, queryDepot, queryChangeMonthEnd } from '../../services/inventory/zbMonthEnd';

export default {
  namespace: 'zbMonthEnd',
  state: { depotList: [], storeId: '', notChecked: [] },
  reducers: {
    showLoading(state) {
      return { ...state, loading: true };
    },
    hideLoading(state) {
      return { ...state, loading: false };
    },
    querySuccess(state, action) { return { ...state, ...action.payload, loading: false }; } },
  effects: {
    * query({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      const data = yield call(query, parse(payload));
      if (data.data && data.data.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            isCheck: data.data.data.isCheck,
            nowLast: data.data.data.nowLast,
            now: data.data.data.now,
            month: data.data.data.month,
            monthNext: data.data.data.monthNext,
            scmOutList: data.data.data.scmOutList,
            scmInList: data.data.data.scmInList,
            scmCheckList: data.data.data.scmCheckList,
            scmTransferList: data.data.data.scmTransferList,
            notChecked: data.data.data.notChecked,
          },
        });
      } else {
        message.warning(`操作失败，请参考：${data.data.errorInfo}`);
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
    * changeMonthEnd({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      const data = yield call(queryChangeMonthEnd, parse(payload));
      if (data.data && data.data.success) {
        message.success('月结成功');
        yield put({ type: 'reload' });
      } else {
        message.error(data.data.errorInfo);
        yield put({ type: 'hideLoading' });
      }
    },
    * reload(action, { put, select }) {
      const storeId = yield select(state => state.zbMonthEnd.storeId);
      // console.log('`我是测试的数据id看看是啥----$(queryString)`');
      yield put({ type: 'query', payload: { ...action.payload, storeId } });
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/stock/zbMonthEnd') {
          dispatch({
            type: 'queryDepot',
            payload: { ...location.query, orgType: 2, rows: 10 },
          });
        }
      });
    },
  },
};
