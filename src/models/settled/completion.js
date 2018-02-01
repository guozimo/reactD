import { routerRedux } from 'dva/router';
import { message } from 'antd';
import * as merchantPerfect from '../../services/settled/completion';


export default {
  namespace: 'merchantCompletion',
  state: {
    provinceList: [],
    cityList: [],
    areaList: [],
    fileList: [],
    initData: {},
    submitBtnLoading: false,
    authority: '',
    YeTaiList: [],
    showYeTaiImg: false,
  },
  reducers: {
    showYeTaiImg(state) {
      return {
        ...state,
        showYeTaiImg: true,
      };
    },
    setAuthority(state, authority) {
      return {
        ...state,
        authority,
      };
    },
    setProvinceList(state, action) {
      return {
        ...state,
        provinceList: action.provinceList,
      };
    },
    setYeTai(state, action) {
      return {
        ...state,
        YeTaiList: action.YeTaiList,
      };
    },

    setInitData(state, action) {
      return {
        ...state,
        initData: action.initData,
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

    submitSuccess(state, { data }) {
      message.success('资料提交成功！');

      window.localStorage.setItem('userInfo', JSON.stringify(data));

      return {
        ...state,
        submitBtnLoading: false,
      };
    },

    submitFail(state) {
      return {
        ...state,
        submitBtnLoading: false,
      };
    },
  },
  effects: {
    * getAuthority(payload, { call, put }) {
      const { data } = yield call(merchantPerfect.getAuthority);
      if (data.success) {
        if (data.data.status === 2) {
          yield put(routerRedux.push('/merchants/merchantsInfo'));
        } else {
          yield put(routerRedux.push('/merchants/restaurantSet'));
        }
        yield put({
          type: 'setAuthority',
          authority: data.data.status,
        });
      }
    },
    * getYeTai(payload, { call, put }) {
      const { data } = yield call(merchantPerfect.getYeTai);
      if (data.success) {
        yield put({
          type: 'setYeTai',
          YeTaiList: data.data,
        });
      }
    },
    * getData(payload, { call, put }) {
      const { data: { data } } = yield call(merchantPerfect.getData);

      yield put({
        type: 'getProvince',
      });
      if (data) {
        yield put({
          type: 'showYeTaiImg',
        });

        yield put({
          type: 'setInitData',
          initData: data,
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

        yield put({
          type: 'setFileList',
          fileList: [{
            uid: -1,
            status: 'done',
            url: data.braLogo,
          }],
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

    * submit({ isUpdate, values }, { call, put }) {
      yield put({ type: 'showSubmitLoading' });

      const { data } = yield call(merchantPerfect.create, values);

      // 完善商户信息后，同步更新 本地存储的用户信息
      if (data.success) {
        yield put({
          type: 'submitSuccess',
          data: data.data,
        });

        yield put({
          type: 'merchantApp/authSuccess',
          userInfo: data.data,
        });

        // 首次完善商户信息后，自动跳转至 餐厅设置
        yield put(routerRedux.push('/merchants/merchantsInfo'));
        if (!isUpdate) {
          yield put({
            type: 'merchantApp/queryAuthority',
          });

          // yield put(routerRedux.push('/merchants/restaurantSet'));
        } else {
          yield put(routerRedux.push('/merchants/merchantsInfo'));
        }
      } else {
        yield put({
          type: 'submitFail',
        });

        message.error(data.message || '资料提交失败！');
      }
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/merchants/merchantsInfo/edit') {
          dispatch({
            type: 'getData',
          });
        }
      });
    },
  },
};
