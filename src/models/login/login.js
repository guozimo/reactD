import { message } from 'antd';
import { login, logout, getAuthority } from '../../services/Login/login';
import { getUserInfo, saveLocal } from '../../utils';

export default {
  namespace: 'login',
  state: {
    isLogin: false,
    winHeight: 600,
  },
  reducers: {
    logIn(state) {
      return { ...state, isLogin: true };
    },
    noLogin(state) {
      return { ...state, isLogin: false };
    },
    save(state, { data }) {
      saveLocal('userInfo', data);
      return { ...state };
    },
    setWinHeight(state, { winHeight }) {
      return { ...state, winHeight };
    },
  },
  effects: {
    * fetchLogin({ values }, { call, put }) {
      message.config({
        top: 100,
      });
      const { data } = yield call(login, { ...values });
      if (data.success) {
        yield put({
          type: 'save',
          data: data.data,
        });
        const res = yield call(getAuthority);
        if (res.data && res.data.data.status === 2) {
          window.location.href = '/settled.html#/merchants/merchantsInfo';
        } else if (res.data && res.data.data.aclStoreListSize) {
          window.location.href = '/settled.html#/merchants/merchantsInfo';
        } else {
          window.location.href = '/settled.html#/merchants/merchantsInfo';
        }
      } else {
        const userInfo = getUserInfo();
        if (data.message === '该用户已经登录，不要重复登录' || data.code === '10003') {
          // 重复登陆，但本地用户信息被清除的情况下视为无效登陆，需清cookie，重新登陆
          if (JSON.stringify(userInfo) === '{}') {
            yield call(logout);
            message.error('登陆信息已失效，请刷新重试！');
            return;
          }
          if (!userInfo.tenName) {
            window.location.href = '/settled.html#/merchants/merchantsInfo/edit';
          } else {
            window.location.href = '/settled.html#/merchants/merchantsInfo';
          }
        } else if (typeof data !== 'object') {
          message.error(data);
        } else {
          message.error(data.message);
        }
      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/login') {
          const winHeight = (window.innerHeight || window.document.documentElement.height) - 115;
          dispatch({
            type: 'setWinHeight',
            winHeight,
          });
          const userInfo = getUserInfo();
          if (userInfo.userAccount) {
            dispatch({ type: 'logIn' });
          } else {
            dispatch({ type: 'noLogin' });
          }
        }
      });
    },
  },

};
