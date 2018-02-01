import { message } from 'antd';
import * as forgetPassword from '../../services/settled/forgetPassword';


export default {
  namespace: 'forgetPassword',
  state: {
    codeBtnStatus: false,
    submitBtnLoading: false,
    endTime: null,
  },
  reducers: {
    codeBtnDisable(state, action) {
      return {
        ...state,
        codeBtnStatus: true,
        endTime: action.endTime,
      };
    },

    codeBtnEnable(state) {
      return {
        ...state,
        codeBtnStatus: false,
      };
    },

    showSubmitLoading(state) {
      return {
        ...state,
        submitBtnLoading: true,
      };
    },

    registerSuccess(state) {
      message.success('手机找回密码正确');

      setTimeout(() => {
        window.location.href = '/index.html';
      }, 2000);

      return {
        ...state,
        submitBtnLoading: false,
      };
    },

    registerFail(state, { msg }) {
      message.error(msg || '手机找回密码错误');

      return {
        ...state,
        submitBtnLoading: false,
      };
    },
  },
  effects: {
    * send({ phoneNum }, { call, put }) {
      const { data } = yield call(forgetPassword.send, {
        mobilePhoneNumber: phoneNum,
      });

      if (data.success) {
        yield put({
          type: 'codeBtnDisable',
          endTime: +new Date() + 59000,
        });
      } else {
        yield put({ type: 'codeBtnEnable' });
        yield put({
          type: 'registerFail',
          msg: data.message,
        });
      }
    },

    * submit({ values }, { call, put }) {
      yield put({ type: 'showSubmitLoading' });
      const { data } = yield call(forgetPassword.create, values);

      if (data.success) {
        yield put({ type: 'registerSuccess' });
      } else {
        yield put({
          type: 'registerFail',
          msg: data.message,
        });
      }
    },
  },
};
