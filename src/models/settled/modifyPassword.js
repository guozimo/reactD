import { message } from 'antd';
import modifyPassword from '../../services/settled/modifyPassword';

export default {
  namespace: 'modifyPassword',
  state: {
    submitBtnLoading: false,
  },
  reducers: {
    showSubmitLoading(state) {
      return {
        ...state,
        submitBtnLoading: true,
      };
    },

    submitSuccess(state) {
      message.success('密码修改成功！');

      return {
        ...state,
        submitBtnLoading: false,
      };
    },
    submitFail(state, { msg }) {
      message.error(msg || '密码修改失败！');

      return {
        ...state,
        submitBtnLoading: false,
      };
    },
  },
  effects: {
    * submit({ values }, { call, put }) {
      yield put({ type: 'showSubmitLoading' });
      const { data } = yield call(modifyPassword, values);

      if (data.success) {
        yield put({ type: 'submitSuccess' });
      } else {
        yield put({
          type: 'submitFail',
          msg: data.message,
        });
      }
    },

  },

  subscriptions: {

  },

};
