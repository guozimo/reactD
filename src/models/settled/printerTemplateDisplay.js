import * as printerTemplateDisplay from '../../services/settled/printerTemplateDisplay';

export default {
  namespace: 'PrinterTemplateDisplay',
  state: {
    fileList: [],
    initData: {},
    storeList: [],
    storeId: '',
    storeName: '',
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
    // setStoreName(state, action) {
    //   const storeId = window.localStorage.getItem('storeId');
    //   action.storeList.map((data) => {
    //     if (storeId === data.id) {
    //       action.getStoreName = data.name;
    //     }
    //   })
    //   return {
    //     ...state,
    //     storeName: action.getStoreName,
    //   };
    // },


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

  },
  effects: {
    * getData(payload, { call, put, select }) {
      yield put({
        type: 'setStoreId',
        storeId: window.localStorage.getItem('storeId'),
      });
      const PrinterTemplateDisplayState = yield select(state => state.PrinterTemplateDisplay);
      const { data: { data } } = yield call(printerTemplateDisplay.getData, {
        storeId: PrinterTemplateDisplayState.storeId,
      });

      if (data) {
        yield put({
          type: 'setInitData',
          initData: data,
        });
      }
    },
    * getStore(payload, { call, put }) {
      const { data } = yield call(printerTemplateDisplay.getStoreList);
      if (data.success) {
        yield put({
          type: 'setStore',
          storeList: data.data,
        });
        // yield put({
        //   type: 'setStoreName',
        //   storeList: data.data,
        // });
      }
    },

  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/merchants/PrinterTemplateDisplay') {
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
