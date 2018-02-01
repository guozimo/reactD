/* eslint-disable max-len */
import { parse } from 'qs';
import moment from 'moment';
import { message } from 'antd';
import { queryOrg, queryWarehouse, queryGoodsID } from '../../services/inventory/common';
import { query, exportAnItem, findAclStoreForPage } from '../../services/inventory/distributionDetailReport';

export default {
  namespace: 'distributionDetailReport',
  state: {
    storeId: '',
    depotList: [],
    weatherList: [],  // 门店
    depotCannList: [], // 出入库
    dataSourceAll: [],
    newData: {
      key: 2,
      id: '',
    },
    filterStatus: '',
    goodsName: '', // 物资名称
    goodsList: [], // 物资列表
    depotName: '',
    inNewDepotId: '', // 首页调入仓库ID
    storeName: '',    // 门店名称
    bussDate: [moment(), moment()],    // 请购日期
    searchTree: [], // 类别
    depotListAll: [], // 仓库列表
    cateId: '',
    listPagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => `共 ${total} 条`,
      current: 1,
      total: 0,
      pageSize: 10,
      pageSizeOptions: ['10', '20', '50', '100'],
    },
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
    updateState(state, action) {
      return { ...state, ...action.payload };
    },
  },
  effects: {
    // 请求物资列表
    * queryGoodsMini({ payload }, { call, put }) {
      // yield put({ type: 'hideLoading' });
      const data = yield call(queryGoodsID, parse(payload));
      if (data.data && data.data.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            goodsList: data.data.data.data,
          },
        });
      } else {
        message.warning(`操作失败，请参考：${data.data.errorInfo}`);
        yield put({ type: 'hideLoading' });
      }
    },
    * findAclStoreForPage({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      const data = yield call(findAclStoreForPage, parse(payload));
      if (data.data && data.data.success) {
        // const storeData = data.data.data.aclStoreList;
        // storeData.unshift({ id: '', name: '请选择' });
        yield put({
          type: 'querySuccess',
          payload: {
            weatherList: data.data.data.aclStoreList,
          },
        });
        if (data.data.data.aclStoreList.length === 1) {
          yield put({
            type: 'updateState',
            payload: {
              storeName: data.data.data.aclStoreList[0].id,
            },
          });
        }
      } else {
        message.warning(`操作失败，请参考：${data.data.errorInfo}`);
        yield put({ type: 'hideLoading' });
      }
    },
    * getList({ payload }, { call, put, select }) { // 请求内容
      yield put({ type: 'showLoading' });
      const { storeId, storeName, goodsName, depotName, bussDate, listPagination } = yield select(state => state.distributionDetailReport);
      const pageNo = payload.pageNo || listPagination.current;
      const pageSize = payload.pageSize || listPagination.pageSize;
      const reqParams = {
        distribId: payload.distribId || storeId,
        storeId: storeName,
        goodsName,
        depotId: depotName,
        page: pageNo, // 查看第几页内容 默认1
        rows: pageSize,   // 一页展示条数 默认20
        startDate: bussDate[0].format('YYYY-MM-DD'), // 开始时间
        endDate: bussDate[1].format('YYYY-MM-DD'), // 结束时间
      };
      const listData = yield call(query, parse(reqParams));
      if (listData.data && listData.data.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            dataSourceAll: listData.data.data.page.data,
            listPagination: {
              showSizeChanger: true,
              showQuickJumper: true,
              total: listData.data.data.page.totalCount,
              current: listData.data.data.page.page,
              showTotal: total => `共 ${total} 条`,
              pageSize: listData.data.data.page.limit,
              pageSizeOptions: ['10', '20', '50', '100'],
            },
          },
        });
      } else {
        message.warning(`操作失败，请参考：${listData.data.errorInfo}`);
        yield put({ type: 'hideLoading' });
      }
    },
    * queryOrg({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      const data = yield call(queryOrg, parse(payload));
      if (data.data && data.data.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            depotList: data.data.data.aclStoreList,
          },
        });

        if (data.data.data.aclStoreList.length === 1) {
          yield put({
            type: 'findAclStoreForPage',
            payload: {
              storeId: data.data.data.aclStoreList[0].id,
              orgType: 1,
            },
          });
          yield put({
            type: 'getList',
            payload: {
              storeId: data.data.data.aclStoreList[0].id,
            },
          });
          yield put({
            type: 'updateState',
            payload: {
              storeId: data.data.data.aclStoreList[0].id,
            },
          });
        }
      } else {
        message.warning(`操作失败，请参考：${data.data.errorInfo}`);
        yield put({ type: 'hideLoading' });
      }
    },
    * exportItem({ payload }, { select, call }) {
      const { storeId, bussDate, storeName, depotName, goodsName } = yield select(state => state.distributionDetailReport);
      let reqParams = {};
      if (bussDate.length !== 0) {
        reqParams = {
          distribId: payload.distribId || storeId,
          storeId: storeName,
          depotId: depotName,
          goodsName,
          startDate: bussDate[0].format('YYYY-MM-DD'), // 开始时间
          endDate: bussDate[1].format('YYYY-MM-DD'), // 结束时间
        };
      }
      yield call(exportAnItem, parse(reqParams));
    },
    * queryWarehouse({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      const data = yield call(queryWarehouse, parse(payload));
      if (data.data && data.data.success) {
        // const depotData = data.data.data.page.data;
        // depotData.unshift({ id: '', depotName: '请选择' });
        yield put({
          type: 'querySuccess',
          payload: {
            depotListAll: data.data.data.page.data,
          },
        });
      } else {
        message.warning(`操作失败，请参考：${data.data.errorInfo}`);
        yield put({ type: 'hideLoading' });
      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        // console.warn("location.pathname", location.pathname);
        if (location.pathname === '/stock/distributionDetailReport') {
          dispatch({
            type: 'queryOrg',
            payload: { ...location.query, rows: 10, orgType: 2 }, // orgType:1 门店 2:总部
          });
        }
      });
    },
  },
};
