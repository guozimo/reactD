import { parse } from 'qs';
import { message } from 'antd';
import moment from 'moment';
import { queryOrg, queryWarehouse, findTreeList } from '../../services/inventory/common';
import { exportAnItem, getList } from '../../services/inventory/stockCheckDetailReport';

export default {
  namespace: 'stockCheckDetailReport',
  state: { // 初始化
    storeId: '', // 机构id
    depotList: [], // 机构列表
    filterDataRange: [moment(), moment()], // 时间
    goodsName: '', // 物品名称
    depotId: '', // 首页调出仓库id
    depotListAll: [], // 仓库列表
    cateId: '', // 分类id
    searchTree: [], // 类别
    dataSourceAll: [], // 表格内的数据数组
    loading: false, // 显示加载
    listPagination: { // 分页
      showSizeChanger: true,  // 是否可以改变 pageSize
      showQuickJumper: true,  // 是否可以快速跳转至某页
      showTotal: total => `共 ${total} 条`, // 用于显示数据总量和当前数据顺序
      current: 1,   // 当前页数
      total: 0,     // 数据总数
      pageSize: 10,   // 每页条数
      pageSizeOptions: [10, 20, 50, 100], // 指定每页可以显示多少条
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
  effects: { // Fire an action or action a function here.
    // 获取机构列表
    * queryOrg({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      const data = yield call(queryOrg, parse(payload));
      const storeLists = data.data.data.aclStoreList;
      // 判断机构列表是否只有一个，若是默认显示
      // const storeLists = storeLists1.slice(0, 1);
      if (data.data && data.data.success) {
        if (storeLists.length === 1) {
          yield put({
            type: 'querySuccess',
            payload: {
              depotList: storeLists,
              storeId: storeLists[0].id,
            },
          });
          yield put({
            type: 'getList',
            payload: {
              storeId: storeLists[0].id,
              pageNo: 1,
            },
          });
        } else {
          yield put({
            type: 'querySuccess',
            payload: {
              depotList: storeLists,
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
      const { storeId, filterDataRange } = yield select(state => state.stockCheckDetailReport);
      let reqParams = {};
      if (filterDataRange.length !== 0) {
        reqParams = {
          storeId,
          startDate: filterDataRange[0].format('YYYY-MM-DD'), // 开始时间
          endDate: filterDataRange[1].format('YYYY-MM-DD'), // 结束时间
        };
      }
      yield call(exportAnItem, parse(reqParams));
    },
    // 设置搜索时间范围
    * setFilterDataRange({ payload }, { put }) {
      yield put({
        type: 'updateState',
        payload: {
          filterDataRange: payload.filterDataRange,
        },
      });
    },
    // 请求列表内容
    * getList({ payload }, { call, put, select }) {
      yield put({ type: 'showLoading' });
      let storeId = yield select(state => state.stockCheckDetailReport.storeId);
      const {
        goodsName,
        depotId,
        filterDataRange,
        cateId,
        listPagination,
      } = yield select(state => state.stockCheckDetailReport);
      storeId = payload.storeId || storeId; // 没有storeId参数的话使用state的
      const pageNo = payload.pageNo || listPagination.current;
      const pageSize = payload.pageSize || listPagination.pageSize;
      let reqParams = {};
      if (filterDataRange.length !== 0) {
        reqParams = {
          storeId,
          page: pageNo, // 查看第几页内容 默认1
          rows: pageSize, // 一页展示条数 默认20
          goodsName,
          depotId,
          cateId,
          startDate: filterDataRange[0].format('YYYY-MM-DD'),
          endDate: filterDataRange[1].format('YYYY-MM-DD'),
        };
      }
      const listData = yield call(getList, parse(reqParams));
      if (listData.data && listData.data.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            dataSourceAll: listData.data.data.data,
            listPagination: {
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: total => `共 ${total} 条`,
              current: listData.data.data.page,
              total: listData.data.data.totalCount,
              pageSize: listData.data.data.limit,
              pageSizeOptions: [10, 20, 50, 100],
            },
          },
        });
      } else {
        message.warning(`操作失败，请参考：${listData.data.errorInfo}`);
        yield put({ type: 'hideLoading' });
      }
    },
    // 设置物品名称或编码
    * setFilterBillNo({ payload }, { put }) {
      yield put({
        type: 'updateState',
        payload: {
          goodsName: payload.goodsName,
        },
      });
    },
    // 请求仓库
    * queryWarehouse({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      const data = yield call(queryWarehouse, parse(payload));
      if (data.data && data.data.success) {
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
    // 请求类别
    * findTreeList({ payload }, { put, call }) {
      yield put({ type: 'showLoading' });
      const data = yield call(findTreeList, parse(payload));
      if (data.data && data.data.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            searchTree: data.data.data,
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
        const pathname = location.pathname;
        if (pathname === '/stock/stockCheckDetailReport') {
          dispatch({
            type: 'queryOrg',
            payload: { ...location.query, rows: 10, orgType: 2 }, // orgType:1 门店 2:总部
          });
        }
      });
    },
  },
};
