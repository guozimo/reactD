import { routerRedux } from 'dva/router';
import * as merchantPerfect from '../../services/settled/merchantDisplay';

export default {
  namespace: 'MerchantDisplay',
  state: {
    provinceList: [],
    cityList: [],
    areaList: [],
    initData: {},
    loading: false,
    authority: '',
  },
  reducers: {
    setAuthority(state, authority) {
      return {
        ...state,
        authority,
      };
    },
    setInitData(state, action) {
      return {
        ...state,
        initData: action.initData,
      };
    },

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

  },
  effects: {
    * getData(payload, { call, put }) {
      const { data: { data } } = yield call(merchantPerfect.getData);

      if (data) {
        yield put({
          type: 'setInitData',
          initData: data,
        });
        yield put({
          type: 'getProvince',
        });

        yield put({
          type: 'getDistrict',
          provinceId: data.tenProvince,
          getType: 'city',
        });
        yield put({
          type: 'getDistrict',
          provinceId: data.tenCity,
        });
      } else {
        yield put(routerRedux.push('/merchants/merchantsInfo/edit'));
      }
    },
    * getAuthority(payload, { call, put }) {
      const { data } = yield call(merchantPerfect.getAuthority);
      if (data.success) {
        yield put({
          type: 'setAuthority',
          authority: data.data.status,
        });
      }
    },

    * getProvince(payload, { call, put }) {
      const { data } = yield call(merchantPerfect.getProvince);

      yield put({
        type: 'setProvinceList',
        provinceList: data.data || [],
      });
    },

    * getDistrict({ provinceId, getType }, { call, put }) {
      if (getType === 'city') {
        const { data } = yield call(merchantPerfect.getDistrict, {
          provinceId,
        });

        yield put({
          type: 'setCityList',
          cityList: data.data || [],
        });
      } else {
        const { data } = yield call(merchantPerfect.getDistrict, {
          provinceId,
        });

        yield put({
          type: 'setAreaList',
          areaList: data.data || [],
        });
      }
    },

  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/merchants/merchantsInfo') {
          dispatch({
            type: 'getData',
          });
          dispatch({
            type: 'getAuthority',
          });
        }
      });
    },
  },
};
