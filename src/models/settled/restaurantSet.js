import { message } from 'antd';
import * as completion from '../../services/settled/completion';
import * as restaurantSet from '../../services/settled/restaurantSet';


const formatCuisine = (data) => {
  const result = [];
  if (data) {
    data.forEach((item) => {
      result.push({
        label: item.dictName,
        value: item.dictCode,
      });
    });
  }

  return result;
};

export default {
  namespace: 'restaurantSet',
  state: {
    provinceList: [],
    cityList: [],
    areaList: [],
    circleList: [],
    cuisine: [],
    submitBtnLoading: false,
    YeTaiList: [],
    YeTai: null,
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

    setCircleList(state, action) {
      return {
        ...state,
        circleList: action.circleList,
      };
    },

    setCuisine(state, action) {
      return {
        ...state,
        cuisine: action.cuisine,
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

      setTimeout(() => {
        window.location.href = '/index.html#/infos/chain-set';
      }, 2000);

      return {
        ...state,
        submitBtnLoading: false,
      };
    },

    submitFail(state, { msg }) {
      message.error(msg || '资料提交失败！');

      return {
        ...state,
        submitBtnLoading: false,
      };
    },
    setYeTai(state, action) {
      return {
        ...state,
        YeTaiList: action.YeTaiList,
      };
    },
    setYeTaiOne(state, { YeTai }) {
      return {
        ...state,
        YeTai,
      };
    },
  },
  effects: {
    * getData(payload, { call, put }) {
      const { data: { data } } = yield call(completion.getData);
      if (data) {
        yield put({
          type: 'setYeTaiOne',
          YeTai: data.format.toString(),
        });
      }
    },
    * getYeTai(payload, { call, put }) {
      const { data } = yield call(completion.getYeTai);
      if (data.success) {
        yield put({
          type: 'setYeTai',
          YeTaiList: data.data,
        });
      }
    },
    * getProvince(payload, { call, put }) {
      const { data } = yield call(completion.getProvince);

      yield put({
        type: 'setProvinceList',
        provinceList: data.data,
      });
    },

    * getDistrict({ provinceId, getType }, { call, put }) {
      if (getType === 'city') {
        const { data } = yield call(completion.getDistrict, {
          provinceId,
        });

        yield put({
          type: 'setCityList',
          cityList: data.data,
        });
      } else {
        const { data } = yield call(completion.getDistrict, {
          provinceId,
        });

        yield put({
          type: 'setAreaList',
          areaList: data.data,
        });
      }
    },

    * getCircle({ areaCode }, { call, put }) {
      const { data } = yield call(restaurantSet.getCircle, {
        areaCode,
      });

      yield put({
        type: 'setCircleList',
        circleList: data.data,
      });
    },

    * getCookStyle({ dictCode }, { call, put }) {
      const { data: { data } } = yield call(restaurantSet.getCookStyle, {
        dictCode,
      });

      yield put({
        type: 'setCuisine',
        cuisine: formatCuisine(data),
      });
    },


    * submit({ values }, { call, put }) {
      yield put({ type: 'showSubmitLoading' });

      const { data } = yield call(restaurantSet.create, values);

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
      return history.listen(({ pathname }) => {
        if (pathname === '/merchants/restaurantSet') {
          dispatch({
            type: 'getProvince',
          });
          dispatch({
            type: 'getData',
          });
        }
      });
    },
  },
};
