import { parse } from 'qs';
import moment from 'moment';
import { routerRedux } from 'dva/router';
import { message } from 'antd';
import { queryDepot } from '../../services/inventory/common';
import { fetchList } from '../../services/inventory/dispatchCheck';

export default {
  namespace: 'dispatchCheck',
  state: { // 初始化
    storeId: '', // 门店id
    depotList: [], // 门店列表
    dispatchBillNo: '', // 配送出库单号
    dispatchStatus: '', // 验收状态
    billNo: '', // 配送单号
    filterDataRange: [moment().add(-1, 'month'), moment()], // 单号创建日期
    dataSourceAll: [], // 数据数组
    listPagination: { // 分页器
      showSizeChanger: true, // 是否可以改变 pageSize
      showQuickJumper: true, // 是否可以快速跳转至某页
      showTotal: total => `共 ${total} 条`, // 用于显示数据总量和当前数据顺序
      current: 1,  // 当前页数
      total: 0,    // 数据总数
      pageSize: 10, // 每页条数
      pageSizeOptions: [10, 20, 50, 100], // 指定每页可以显示多少条
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
     // 请求表格内容
    * getList({ payload }, { call, put, select }) {
      yield put({ type: 'showLoading' });
      let storeId = yield select(state => state.dispatchCheck.storeId);
      const {
        dispatchStatus, filterDataRange, billNo, dispatchBillNo, listPagination,
      } = yield select(state => state.dispatchCheck);
      storeId = payload.storeId || storeId; // 没有storeId参数的话使用state的
      const pageNo = payload.pageNo || listPagination.current;
      const pageSize = payload.pageSize || listPagination.pageSize;
      if (!storeId) {
        yield false;
      }
      const reqParams = {
        storeId,
        page: pageNo, // 查看第几页内容 默认1
        rows: pageSize, // 一页展示条数 默认10
        billNo: dispatchBillNo, // 配送出库单号
        upBillNo: billNo, // 配送单号
        startDate: moment(filterDataRange[0]).format('YYYY-MM-DD'),
        endDate: moment(filterDataRange[1]).format('YYYY-MM-DD'),
        auditStatus: dispatchStatus, // 状态（1已验收  0待验收）
      };
      const listData = yield call(fetchList, parse(reqParams));
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
              pageSizeOptions: [10, 20, 50, 100],
            },
          },
        });
      } else {
        message.warning(`获取表格操作失败，请参考：${listData.data.errorInfo}`);
        yield put({ type: 'hideLoading' });
      }
    },
    // 请求门店
    * queryDepot({ payload }, { call, put }) {
      const data = yield call(queryDepot, parse(payload));
      const storeLists = data.data.data.aclStoreList;
      // 判断门店列表是否只有一个，若是默认显示
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
        message.warning(`请求门店操作失败，请参考：${data.data.errorInfo}`);
        yield put({ type: 'hideLoading' });
      }
    },
    // 设置配送出库单号
    * setDispatchBillNo({ payload }, { put }) {
      yield put({
        type: 'updateState',
        payload: {
          dispatchBillNo: payload.dispatchBillNo,
        },
      });
    },
    // 改变验收状态
    * setDispatchStatus({ payload }, { put }) {
      yield put({
        type: 'updateState',
        payload: {
          dispatchStatus: payload.dispatchStatus,
        },
      });
    },
    // 设置配送单号
    * setBillNo({ payload }, { put }) {
      yield put({
        type: 'updateState',
        payload: {
          billNo: payload.billNo,
        },
      });
    },
    // 修改单号创建日期
    * setFilterDataRange({ payload }, { put }) {
      yield put({
        type: 'updateState',
        payload: {
          filterDataRange: payload.filterDataRange,
        },
      });
    },
    // 点击查看、验收，实现路由页面跳转
    * createBill({ payload }, { put }) { // 新增请购单
      let path = '';
      if (payload.opType === 'view') {
        path = `/stock/dispatchCheck/details/view/${payload.storeId}/${payload.id}`;
      }
      if (payload.opType === 'check') {
        path = `/stock/dispatchCheck/details/check/${payload.storeId}/${payload.id}`;
      }
      yield put(routerRedux.push(path));
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/stock/dispatchCheck') {
          dispatch({
            type: 'queryDepot',
            payload: { ...location.query, rows: 10, orgType: 1 }, // orgType:1 门店 2:总部
          });
          dispatch({
            type: 'getList',
            payload: {},
          });
        }
      });
    },
  },
};
