import { parse } from 'qs';
import { message } from 'antd';
import { queryDepot } from '../../services/inventory/common';
import { query, queryChangeMonthEnd } from '../../services/inventory/monthEnd';

export default {
  namespace: 'monthEnd',
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
            scmDirectList: data.data.data.scmDirectList,
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
      const storeLists = data.data.data.aclStoreList;
      // 判断门店列表是否只有一个，若是默认显示
      // const storeLists = storeLists1.slice(0, 1);
      if (data.data && data.data.success) {
        if (storeLists.length === 1) {
          yield put({
            type: 'querySuccess',
            payload: {
              depotList: storeLists,
              storeId: storeLists[0].id,
            },
          });
          yield put({
            type: 'query',
            payload: {
              storeId: storeLists[0].id,
            },
          });
        } else {
          yield put({
            type: 'querySuccess',
            payload: {
              depotList: storeLists,
            },
          });
        }
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
      const storeId = yield select(state => state.monthEnd.storeId);
      yield put({ type: 'query', payload: { ...action.payload, storeId } });
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/stock/monthEnd') {
          dispatch({
            type: 'queryDepot',
            payload: { ...location.query, rows: 10 },
          });
        }
      });
    },
  },
};
