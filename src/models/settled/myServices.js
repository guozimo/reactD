import { message } from 'antd';
import fetchList from '../../services/settled/myServices';

export default {
  namespace: 'myServices',
  state: {
    list: [],
  },

  reducers: {
    saveList(state, { list }) {
      return {
        ...state,
        list,
      };
    },
    showError(state, { msg }) {
      message.error(msg);
      return {
        ...state,
      };
    },
  },

  effects: {
    * fetchList({ payload }, { call, put }) {
      const { data } = yield call(fetchList);
      if (data.success) {
        yield put({
          type: 'saveList',
          list: data.data,
        });
      } else {
        yield put({
          type: 'getListError',
          msg: data.message,
        });
      }
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/merchants/myServices') {
          dispatch({
            type: 'fetchList',
          });
        }
      });
    },
  },

};
