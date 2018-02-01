import { message } from 'antd';
import * as authService from '../../services/settled/authorization';


export default {
  namespace: 'authorization',
  state: {
    list: [],
    elemeShops: [],
    stores: [],
    showUnBindModal: false,
    meiModal: false,
    meiList: [],
  },

  reducers: {
    saveList(state, { list }) {
      return {
        ...state,
        list,
      };
    },

    saveElemeShops(state, { elemeShops }) {
      return {
        ...state,
        elemeShops,
      };
    },

    saveMeiTuanList(state, { meiList }) {
      return {
        ...state,
        meiList,
      };
    },

    toggleMeiTuanModal(state, { meiModal }) {
      return {
        ...state,
        meiModal,
      };
    },

    saveStoreList(state, { stores }) {
      return {
        ...state,
        stores,
      };
    },

    showError(state, { msg }) {
      message.error(msg);

      return {
        ...state,
      };
    },

    showSuccess(state, { msg }) {
      message.success(msg);

      return {
        ...state,
      };
    },

    showUnBindModal(state) {
      return {
        ...state,
        showUnBindModal: true,
      };
    },

    hideUnBindModal(state) {
      return {
        ...state,
        showUnBindModal: false,
      };
    },
  },

  effects: {
    * fetchList(payload, { call, put }) {
      const { data } = yield call(authService.fetchList);

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

    * getMeiTuanList(payload, { call, put }) {
      const { data } = yield call(authService.getMeiTuanList);

      if (data.success) {
        yield put({
          type: 'saveMeiTuanList',
          meiList: data.data,
        });
      } else {
        yield put({
          type: 'showError',
          msg: data.message || '获取美团门店列表失败',
        });
      }
    },

    * getElemeList({ tenantId }, { call, put }) {
      const { data } = yield call(authService.elemeListShop, {
        aclTenantId: tenantId,
      });

      if (data.success) {
        yield put({
          type: 'saveElemeShops',
          elemeShops: data.data,
        });
      } else {
        yield put({
          type: 'showError',
          msg: data.message || '获取饿了么门店列表失败!',
        });
      }
    },

    * getStoreList(payload, { call, put }) {
      const { data } = yield call(authService.getStoreList);

      if (data.success) {
        yield put({
          type: 'saveStoreList',
          stores: data.data,
        });
      } else {
        yield put({
          type: 'showError',
          msg: data.message || '获取店铺列表失败!',
        });
      }
    },

    * submitShopBind({ values }, { call, put }) {
      const { data } = yield call(authService.bindElemeShop, values);

      if (data.success) {
        yield put({
          type: 'showSuccess',
          msg: data.message || '绑定饿了么店铺成功！',
        });
      } else {
        yield put({
          type: 'showError',
          msg: data.message || '绑定饿了么店铺失败!',
        });
      }
    },

    * findElemeShops(payload, { call, put }) {
      const { data } = yield call(authService.findElemeShops);

      if (data.success) {
        if (data.data.length) {
          yield put({
            type: 'saveStoreList',
            stores: data.data,
          });

          yield put({
            type: 'showUnBindModal',
          });
        } else {
          yield put({
            type: 'showError',
            msg: '没有需要解绑的店铺',
          });
        }
      } else {
        yield put({
          type: 'showError',
          msg: data.message || '获取店铺列表失败!',
        });
      }
    },

    * submitShopUnBind({ values }, { call, put }) {
      const { data } = yield call(authService.bindElemeShop, values);

      if (data.success) {
        yield put({
          type: 'showSuccess',
          msg: data.message || '饿了么店铺解绑成功！',
        });
      } else {
        yield put({
          type: 'showError',
          msg: data.message || '饿了么店铺解绑失败!',
        });
      }
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/merchants/authorize') {
          dispatch({
            type: 'fetchList',
          });
        }
      });
    },
  },
};
