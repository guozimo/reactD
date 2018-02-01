import { message } from 'antd';
import { routerRedux } from 'dva/router';
import { logout, menuList, hasPower, queryAuthority } from '../services/app';
import { makeMenu, clearLocalStorage, getUserInfo } from '../utils/';

export default {
  namespace: 'merchantApp',
  state: {
    isLogin: false,
    userInfo: {},
    showSider: false,
    menuData: {
      list: {},
      group: {},
    },
    hasItemPower: false,
    hasSupplyChain: false,
  },
  reducers: {
    authSuccess(state, { userInfo }) {
      return {
        ...state,
        userInfo,
        isLogin: true,
      };
    },

    authFail(state) {
      return {
        ...state,
        isLogin: false,
      };
    },

    showMenu(state, { menuData }) {
      return {
        ...state,
        menuData,
      };
    },

    hideMenu(state) {
      return {
        ...state,
        showSider: false,
      };
    },
    showMenus(state) {
      return {
        ...state,
        showSider: true,
      };
    },
    hasSupplyChain(state, { hasSupplyChain }) {
      return {
        ...state,
        hasSupplyChain,
      };
    },
    logoutAct(state) {
      clearLocalStorage();
      window.location.href = '/index.html#/login';

      return {
        ...state,
      };
    },

    showItem(state, { hasItemPower }) {
      return {
        ...state,
        hasItemPower,
      };
    },
  },
  effects: {
    * checkLogin(payload, { put }) {
      const userInfoData = getUserInfo();
      if (userInfoData.userAccount) {
        yield put({
          type: 'authSuccess',
          userInfo: userInfoData,
        });
      } else {
        yield put({ type: 'authFail' });
      }
    },

    * getMenuList(payload, { put, call }) {
      const { data } = yield call(menuList);
      // console.log(data);
      // 有菜单权限 并且 已经完善商户信息 才展示菜单
      if (data.success && getUserInfo().tenName) {
        yield put({
          type: 'showMenu',
          menuData: makeMenu(data.data),
        });
      } else {
        yield put({ type: 'hideMenu' });
      }
    },
    * queryAuthority(payload, { put, call }) {
      const { data } = yield call(queryAuthority);
      if (data.success) {
        yield put({
          type: 'hasSupplyChain',
          hasSupplyChain: data.data.hasSupplyChain,
        });
        if (data.data.status === 2) {
          yield put({
            type: 'hideMenu',
          });
        } else {
          yield put({
            type: 'showMenus',
          });
          yield put({
            type: 'getMenuList',
          });
        }
      }
    },

    * getPower(payload, { call, put }) {
      const { data } = yield call(hasPower);

      if (data.success) {
        yield put({
          type: 'showItem',
          hasItemPower: (data.data === 1),
        });
      }
    },

    * logOut(payload, { put, call }) {
      const { data } = yield call(logout);

      if (data.success) {
        yield put({ type: 'logoutAct' });
      } else {
        message.error('退出失败！');
      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/') {
          dispatch(routerRedux.push('/login'));
        }
      });
    },
  },
};
