import { message } from 'antd';
import * as keyShop from '../../services/settled/keyShop';

export default {
  namespace: 'keyShop',
  state: {
    provinceList: [],
    secondCategoryList: [],
    cityList: [],
    areaList: [],
    kbCategoryList: [],
    initData: {},
    submitBtnLoading: false,
  },
  reducers: {
    setProvinceList(state, action) {
      return {
        ...state,
        provinceList: action.provinceList,
      };
    },

    setCityList(state, action) {
      return {
        ...state,
        cityList: action.cityList,
      };
    },

    setAreaList(state, action) {
      return {
        ...state,
        areaList: action.areaList,
      };
    },

    setKbCategoryList(state, action) {
      return {
        ...state,
        kbCategoryList: action.kbCategoryList,
      };
    },

    setSecondCategoryList(state, action) {
      return {
        ...state,
        secondCategoryList: action.secondCategoryList,
      };
    },

    showSubmitLoading(state) {
      return {
        ...state,
        submitBtnLoading: true,
      };
    },

    setInitData(state, action) {
      return {
        ...state,
        initData: action.initData,
      };
    },

    submitSuccess(state) {
      message.success('资料提交成功！');

      setTimeout(() => {
        window.location.href = '/index.html#/infos/chain-set';
      }, 2000);

      return {
        ...state,
        submitBtnLoading: false,
      };
    },

    submitFail(state, { msg }) {
      if (msg) {
        message.error(msg, 10);
      } else {
        message.error('资料提交失败!');
      }
      return {
        ...state,
        submitBtnLoading: false,
      };
    },
  },
  effects: {
    * getData({ id }, { call, put }) {
      const { data: { data } } = yield call(keyShop.getStoreData, {
        storeId: id,
      });

      yield put({
        type: 'getProvince',
      });

      if (data) {
        yield put({
          type: 'setInitData',
          initData: data,
        });
        if (data.requestId) {
          yield put({
            type: 'getDistrict',
            provinceId: data.provinceCode || '',
            getType: 'city',
          });

          yield put({
            type: 'getDistrict',
            provinceId: data.cityCode || '',
          });

          yield put({
            type: 'getSecondCategoryList',
            categoryId: data.secondCategoryId,
          });
        }
      }
    },

    * getProvince(payload, { call, put }) {
      const { data } = yield call(keyShop.getProvince);
      yield put({
        type: 'setProvinceList',
        provinceList: data.data,
      });
    },

    * getDistrict({ provinceId, getType }, { call, put }) {
      if (getType === 'city') {
        const { data } = yield call(keyShop.getDistrict, {
          parentId: provinceId,
        });

        yield put({
          type: 'setCityList',
          cityList: data.data,
        });
      } else {
        const { data } = yield call(keyShop.getDistrict, {
          parentId: provinceId,
        });

        yield put({
          type: 'setAreaList',
          areaList: data.data,
        });
      }
    },

    * getKbCategoryList(payload, { call, put }) {
      const { data } = yield call(keyShop.getKbCategoryList);
      yield put({
        type: 'setKbCategoryList',
        kbCategoryList: data.data,
      });
    },

    * getSecondCategoryList({ categoryId }, { call, put }) {
      const { data } = yield call(keyShop.getSecondCategoryList, {
        categoryId,
      });
      yield put({
        type: 'setSecondCategoryList',
        secondCategoryList: data.data,
      });
    },

    * submit({ values }, { call, put }) {
      yield put({ type: 'showSubmitLoading' });

      const { data } = yield call(keyShop.create, values);

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
    setup({ dispatch, history }) {
      return history.listen((param) => {
        const { pathname, query } = param;
        if (pathname.indexOf('keyShop') > -1) {
          dispatch({
            type: 'getData',
            id: query.storeId,
          });
          dispatch({
            type: 'getProvince',
          });
          dispatch({
            type: 'getKbCategoryList',
          });
        }
      });
    },
  },
};
