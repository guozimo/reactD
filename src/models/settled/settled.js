import { routerRedux } from 'dva/router';
import { message } from 'antd';
import * as merchantSettled from '../../services/settled/settled';


export default {
  namespace: 'merchantSettled',
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
      message.success('注册成功');

      return {
        ...state,
        submitBtnLoading: false,
      };
    },

    registerFail(state, { msg }) {
      message.error(msg || '注册失败');

      return {
        ...state,
        submitBtnLoading: false,
      };
    },
  },
  effects: {
    * send({ phoneNum }, { call, put }) {
      const { data } = yield call(merchantSettled.send, {
        mobile: phoneNum,
      });

      if (data.success) {
        yield put({
          type: 'codeBtnDisable',
          endTime: +new Date() + 59000,
        });
      } else {
        yield put({ type: 'codeBtnEnable' });
      }
    },

    * verify({ phoneNum }, { call }) {
      yield call(merchantSettled.verify, {
        mobile: phoneNum,
      });
    },

    * submit({ values }, { call, put }) {
      yield put({ type: 'showSubmitLoading' });

      const { data } = yield call(merchantSettled.create, values);

      if (data.success) {
        yield put({ type: 'registerSuccess' });

        yield put(routerRedux.push('/merchants/merchantsInfo/edit'));
      } else {
        yield put({
          type: 'registerFail',
          msg: data.message,
        });
      }
    },
  },
};
