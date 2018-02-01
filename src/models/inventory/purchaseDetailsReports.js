import { parse } from 'qs';
import { message } from 'antd';
import moment from 'moment';
import { queryOrg, querySupplier, queryGoodsID } from '../../services/inventory/common';
import { query, exportAnItem, findAclStoreForPage } from '../../services/inventory/purchaseDetailsReports';

export default {
  namespace: 'purchaseDetailsReports',
  state: {
    originId: '',     // 机构Id
    originList: [],   // 机构列表
    weatherList: [],  // 门店列表
    storeName: '',    // 门店名称
    goodsName: '',    // 物资名称
    goodsList: [], // 物资列表
    busiName: '',     // 供应商名称
    startDate: '',    // 开始时间
    endDate: '',      // 结束时间
    dataSourceAll: [],
    filterDataRange: [moment(), moment()], // 时间框获取
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
  reducers: { // Update above state.
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
    // 请求门店
    * queryDepot({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      const data = yield call(findAclStoreForPage, parse(payload));
      const aclStoreList = data.data.data.aclStoreList;
      // const aclStoreList = aclStoreList1.slice(0, 1);
      if (data.data && data.data.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            weatherList: data.data.data.aclStoreList,
          },
        });
        if (aclStoreList.length === 1) {
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
    // 请求列表
    * getList({ payload }, { call, put, select }) { // 请求内容
      yield put({ type: 'showLoading' });
      const {
        originId,
        storeName,
        goodsName,
        busiName,
        filterDataRange,
        listPagination,
       } = yield select(state => state.purchaseDetailsReports);
      const pageNo = payload.pageNo || listPagination.current;
      const pageSize = payload.pageSize || listPagination.pageSize;
      const reqParams = {
        distribId: payload.originId || originId,
        page: pageNo, // 查看第几页内容 默认1
        rows: pageSize, // 一页展示条数 默认10
        storeId: storeName,
        goodsName,
        busiId: busiName,
        startDate: filterDataRange[0].format('YYYY-MM-DD'),
        endDate: filterDataRange[1].format('YYYY-MM-DD'),
      };
      const listData = yield call(query, parse(reqParams));
      if (listData.data && listData.data.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            dataSourceAll: listData.data.data.page.data,
            startDate: filterDataRange[0].format('YYYY-MM-DD'),
            endDate: filterDataRange[1].format('YYYY-MM-DD'),
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
    // ↓ 供应商
    * querySupplier({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      const data = yield call(querySupplier, parse(payload));
      if (data.data && data.data.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            supplierList: data.data.data.page.data,
          },
        });
      } else {
        message.warning(`操作失败，请参考：${data.data.errorInfo}`);
        yield put({ type: 'hideLoading' });
      }
    },
    // 请求机构
    * queryOrg({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      const data = yield call(queryOrg, parse(payload));
      if (data.data && data.data.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            originList: data.data.data.aclStoreList,
          },
        });
        if (data.data.data.aclStoreList.length === 1) {
          yield put({
            type: 'queryDepot',
            payload: {
              storeId: data.data.data.aclStoreList[0].id,
              orgType: 1,
            },
          });
          yield put({
            type: 'getList',
            payload: {
              originId: data.data.data.aclStoreList[0].id,
            },
          });
          yield put({
            type: 'querySupplier',
            payload: {
              rows: 1000,
            },
          });
          yield put({
            type: 'updateState',
            payload: {
              originId: data.data.data.aclStoreList[0].id,
            },
          });
        }
      } else {
        message.warning(`操作失败，请参考：${data.data.errorInfo}`);
        yield put({ type: 'hideLoading' });
      }
    },
    // 导出表格
    * exportItem({ payload }, { call, select }) {
      const {
        originId,
        storeName,
        goodsName,
        busiName,
        startDate,
        endDate,
      } = yield select(state => state.purchaseDetailsReports);
      const reqParams = {
        originId,
        storeId: storeName,
        goodsName,
        busiId: busiName,
        startDate,
        endDate,
      };
      yield call(exportAnItem, parse(reqParams));
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        // console.warn("location.pathname", location.pathname);
        if (location.pathname === '/stock/purchaseDetailsReports') {
          dispatch({
            type: 'queryOrg',
            payload: { ...location.query, rows: 10, orgType: 2 }, // orgType:1 门店 2:总部
          });
        }
      });
    },
  },
};
