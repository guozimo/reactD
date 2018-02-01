// import { message } from 'antd';
import * as batchImport from '../../services/settled/batchImport';

export default {
  namespace: 'batchImport',
  state: {
    list: [],
    stores: [],
    loading: false,
  },

  reducers: {
    save(state, { list }) {
      return {
        ...state,
        list,
      };
    },

    showLoading(state) {
      return { ...state, loading: true };
    },

    saveStoreList(state, { stores }) {
      return {
        ...state,
        stores,
      };
    },
  },

  effects: {

    * fetch({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      const data = yield call(batchImport.findDataForPage);
      if (data) {
        console.log(data.data.data.page);
        yield put({
          type: 'save',
          list: data.data.data.page,
        });

        yield put({
          type: 'saveStoreList',
          stores: data.data.data.aclStoreList,
        });
      }
    },

    * downloadTable(payload, { call }) {
      const data = yield call(batchImport.downloadTable);
      if (data) {
        window.open(data.data.data);
      }
    },

    * downloadTableQu(payload, { call }) {
      const data = yield call(batchImport.downloadTableQu);
      if (data) {
        window.open(data.data.data);
      }
    },

    * downloadDish(payload, { call }) {
      const data = yield call(batchImport.downloadDish);
      if (data) {
        window.open(data.data.data);
      }
    },

    * downloadCategory(payload, { call }) {
      const data = yield call(batchImport.downloadCategory);
      if (data) {
        window.open(data.data.data);
      }
    },

  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/merchants/batchImport') {
          dispatch({
            type: 'fetch',
            // payload: { query , rows: 10 }
          });
        }
      });
    },
  },
};
