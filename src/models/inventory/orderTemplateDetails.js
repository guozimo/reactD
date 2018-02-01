import { parse } from 'qs';
// import moment from 'moment';
// import pathToRegexp from 'path-to-regexp';
// import { routerRedux } from 'dva/router';
import _ from 'lodash';
import { message } from 'antd';
import { orderTemplateDetailsItemModel } from './_common';
import { fetchList, disabledOrNot } from '../../services/inventory/orderTemplate';

export default {
  namespace: 'orderTempDetailsModule',
  state: {
    storeId: '',
    pageType: 'view',
    // template list
    templateNo: '',
    templateName: '',
    listPagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => `共 ${total} 条`,
      current: 1,
      total: 0,
      size: 10,
      pageSizeOptions: [10, 20, 50, 100],
    },
    statusList: [{
      name: '启用',
      status: 1,
    }, {
      name: '停用',
      status: 0,
    }],
  },
  reducers: {
    querySuccess(state, action) {
      return { ...state, ...action.payload, loading: false };
    },
    showLoading(state) {
      return { ...state, loading: true };
    },
    hideLoading(state) {
      return { ...state, loading: false };
    },
    updateTemplateNo(state, action) {
      return { ...state, templateNo: action.templateNo };
    },
    changePageType(state, action) {
      return { ...state, pageType: action.pageType };
    },
    mergeData(state, action) {
      return { ...state, ...action.payload };
    },
  },
  effects: {
    * getTemplates({ payload }, { call, put, select }) {
      yield put({ type: 'showLoading' });
      // let storeId = yield select(state => state.orderTemplateModule.storeId);
      // storeId = payload.storeId || storeId; // 没有storeId参数的话使用state的
      const { templateNo, templateName, listPagination } = yield select(state => state.orderTemplateModule);
      const templateNames = payload.templateName || templateName;
      const templateNos = payload.templateNo || templateNo;
      const pageNo = payload.pageNo || listPagination.current;
      const pageSize = payload.pageSize || listPagination.size;
      const reqParams = {
        templateNo: templateNos,
        templateName: templateNames,
        page: pageNo,
        rows: pageSize,
      };
      const data = yield call(fetchList, parse(reqParams));
      if (data.data && data.data.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            dataSourceAll: data.data.data.page.data,
            listPagination: {
              showSizeChanger: true,
              showQuickJumper: true,
              total: data.data.data.page.totalCount,
              current: data.data.data.page.page,
              showTotal: total => `共 ${total} 条`,
              size: data.data.data.page.limit,
              pageSizeOptions: [10, 20, 50, 100],
            },
          },
        });
      } else {
        message.error(data.data.errorInfo);
        yield put({ type: 'hideLoading' });
      }
    },
    * setTemplateNo({ payload }, { put }) { // 设置订单状态
      yield put({
        type: 'updateTemplateNo',
        templateNo: payload.templateNo,
      });
    },
    // * importTemplates({ payload }, { put, call }) {
    //   const reqParams = {
    //     upload:
    //   };
    //   const data = yield call(uploadTemplates, parse(reqParams));
    // },
    * disabledOrNot({ payload }, { call }) {
      const id = payload.id;
      const status = payload.status;
      const reqParams = {
        id,
        status,
      };
      const data = yield call(disabledOrNot, parse(reqParams));
      console.warn('data  data', data);
    },
    * startWithType({ payload }, { put, select }) { // 改为编辑状态
      yield put({ type: 'changePageType', pageType: payload.pageType });
      const storePageType = yield select(state => state.orderTempDetailsModule.pageType);
      // console.log("startWithType pageType", pageType);
      if (storePageType === 'create') {
        const rowsObj = [];
        const emptyItem = _.cloneDeep(orderTemplateDetailsItemModel);
        rowsObj.push(emptyItem);
        yield put({ type: 'mergeData', payload: { pageDetail: rowsObj } });
      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/stock/orderTemplate') {
          dispatch({
            type: 'getTemplates',
            payload: {
              rows: 10,
            },
          });
        }
      });
    },
  },
};
