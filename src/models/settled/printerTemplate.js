import { routerRedux } from 'dva/router';
import { message } from 'antd';
import * as printerTemplate from '../../services/settled/printerTemplate';


export default {
  namespace: 'printerTemplate',
  state: {
    fileList: [],
    initData: {},
    storeList: [],
    storeId: '',
    submitBtnLoading: false,
  },
  reducers: {
    setInitData(state, action) {
      return {
        ...state,
        initData: action.initData,
      };
    },
    clearFileList(state) {
      return {
        ...state,
        fileList: [],
      };
    },
    setStore(state, action) {
      return {
        ...state,
        storeList: action.storeList,
      };
    },
    setStoreId(state, action) {
      return {
        ...state,
        storeId: action.storeId,
      };
    },


    setFileList(state, action) {
      return {
        ...state,
        fileList: action.fileList,
      };
    },

    showSubmitLoading(state) {
      return {
        ...state,
        submitBtnLoading: true,
      };
    },

    submitSuccess(state) {
      message.success('资料提交成功！');
      return {
        ...state,
        submitBtnLoading: false,
      };
    },

    submitFail(state) {
      return {
        ...state,
        submitBtnLoading: true,
      };
    },
  },
  effects: {
    * getData(payload, { call, put, select }) {
      yield put({
        type: 'clearFileList',
      });
      yield put({
        type: 'setStoreId',
        storeId: window.localStorage.getItem('storeId'),
      });
      const printerTemplateState = yield select(state => state.printerTemplate);
      const { data: { data } } = yield call(printerTemplate.getData, {
        storeId: printerTemplateState.storeId,
      });

      if (data) {
        yield put({
          type: 'setInitData',
          initData: data,
        });
        if (data.printImage) {
          yield put({
            type: 'setFileList',
            fileList: [{
              uid: -1,
              status: 'done',
              url: data.printImage,
            }],
          });
        }
      }
    },
    * submit({ values }, { call, put }) {
      yield put({ type: 'showSubmitLoading' });
      const { data } = yield call(printerTemplate.create, values);
      if (data.success) {
        yield put({
          type: 'submitSuccess',
        });
        yield put(routerRedux.push('/merchants/PrinterTemplateDisplay'));
      } else {
        yield put({
          type: 'submitFail',
        });
        message.error(data.message || '资料提交失败！');
      }
    },
    * getStore(payload, { call, put }) {
      const { data } = yield call(printerTemplate.getStoreList);
      if (data.success) {
        yield put({
          type: 'setStore',
          storeList: data.data,
        });
      }
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/merchants/PrinterTemplate') {
          dispatch({
            type: 'getData',
          });
          dispatch({
            type: 'getStore',
          });
        }
      });
    },
  },
};
