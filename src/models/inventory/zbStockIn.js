import { parse } from 'qs';
import { message } from 'antd';
import { routerRedux } from 'dva/router';
import pathToRegexp from 'path-to-regexp';
import moment from 'moment';
import { queryOrg, queryType, queryWarehouse, querySupplier, zbReverse } from '../../services/inventory/common';
import { queryList, remove, zbExport } from '../../services/inventory/zbStockIn';

const dateFormat = 'YYYY-MM-DD';
message.config({
  top: 300,
  duration: 5,
});

export default {
  namespace: 'zbStockIn',
  state: {
    loading: false,
    depotList: [], // 机构列表
    storeId: '', // 机构id
    dataList: [],
    startDate: moment().add(-1, 'month').format(dateFormat),
    endDate: moment(new Date()).format(dateFormat),
    monthDate: 0,
    baseInfo: { // 基础信息，一些搜索下拉选项之类的
      billType: [],
      status: [
        {
          code: '',
          name: '请选择',
        },
        {
          code: '962',
          name: '已完成',
        },
        {
          code: '961',
          name: '未完成',
        },
      ],
      warehouse: [],
      supplier: [],
    },
    filters: {
      billNo: null,
      billType: '',
      busiId: '',
      depotId: '',
      status: '',
    },
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => `共 ${total} 条`,
      current: 1,
      total: 0,
      pageSize: 10,
      pageSizeOptions: ['10', '20', '50', '100'],
    },
  },
  effects: {
    * queryDepot({ payload }, { call, put, select }) {
      message.destroy();
      const data = yield call(queryOrg, parse(payload));
      if (data.data && data.data.success) {
        const aclStoreList = data.data.data.aclStoreList;
        yield put({
          type: 'updateState',
          payload: {
            depotList: aclStoreList,
          },
        });
        // 如果机构长度为1，默认选中该机构
        if (aclStoreList.length === 1) {
          const startDate = yield select(state => state.zbStockIn.startDate);
          const endDate = yield select(state => state.zbStockIn.endDate);
          yield put({
            type: 'updateState',
            payload: {
              storeId: aclStoreList[0].id,
            },
          });
          yield put({
            type: 'queryList',
            payload: {
              storeId: aclStoreList[0].id,
              rows: 10,
              startDate,
              endDate,
            },
          });
          yield put({
            type: 'queryWarehouse',
            payload: {
              rows: '1000',
              storeId: aclStoreList[0].id,
            },
          });
        }
      } else {
        message.error(data.data.errorInfo);
        yield put({ type: 'hideLoading' });
      }
    },
    * queryType({ payload }, { call, put, select }) {
      message.destroy();
      const data = yield call(queryType, parse(payload));
      if (data.data && data.data.success) {
        let typeArray = data.data.data.filter(type => type.dictName.indexOf('入') > -1);
        typeArray = typeArray.filter(type => type.dictName !== '配送入库单' && type.dictName !== '直运入库单'); // 总部入库单据类型不显示配送，直运方向
        typeArray.unshift({ dictCode: '', dictName: '请选择' });
        const baseInfoOld = yield select(state => state.zbStockIn.baseInfo);
        yield put({
          type: 'updateState',
          payload: {
            baseInfo: { ...baseInfoOld, billType: typeArray },
          },
        });
      } else {
        message.warning(`操作失败，请参考：${data.data.errorInfo}`);
        yield put({ type: 'hideLoading' });
      }
    },
    * queryWarehouse({ payload }, { call, put, select }) {
      message.destroy();
      const data = yield call(queryWarehouse, parse(payload));
      if (data.data && data.data.success) {
        const warehouseArray = data.data.data.page.data;
        warehouseArray.unshift({ id: '', depotName: '请选择' });
        const baseInfoOld = yield select(state => state.zbStockIn.baseInfo);
        yield put({
          type: 'updateState',
          payload: {
            baseInfo: { ...baseInfoOld, warehouse: warehouseArray },
          },
        });
      } else {
        message.warning(`操作失败，请参考：${data.data.errorInfo}`);
        yield put({ type: 'hideLoading' });
      }
    },
    * querySupplier({ payload }, { call, put, select }) {
      message.destroy();
      const data = yield call(querySupplier, parse(payload));
      if (data.data && data.data.success) {
        const supplierArray = data.data.data.page.data;
        supplierArray.unshift({ id: '', suppName: '请选择' });
        const baseInfoOld = yield select(state => state.zbStockIn.baseInfo);
        yield put({
          type: 'updateState',
          payload: {
            baseInfo: { ...baseInfoOld, supplier: supplierArray },
          },
        });
      } else {
        message.warning(`操作失败，请参考：${data.data.errorInfo}`);
        yield put({ type: 'hideLoading' });
      }
    },
    * queryList({ payload }, { call, put, select }) {
      yield put({ type: 'showLoading' });
      const data = yield call(queryList, parse(payload));
      if (data.data && data.data.success) {
        const paginationOld = yield select(state => state.zbStockIn.pagination);
        yield put({
          type: 'querySuccess',
          payload: {
            dataList: data.data.data.page.data,
            monthDate: data.data.data.monthDate,
            pagination: {
              ...paginationOld,
              total: data.data.data.page.totalCount,
              current: data.data.data.page.page,
              pageSize: data.data.data.page.limit,
            },
          },
        });
      } else {
        message.warning(`操作失败，请参考：${data.data.errorInfo}`);
        yield put({ type: 'hideLoading' });
      }
    },
    * toItem({ payload }, { put }) {
      let path = '';
      if (payload.type === 'add') {
        path = `/stock/zb/stockIn/item/add/${payload.storeId}/0`;
      } else if (payload.type === 'view') {
        path = `/stock/zb/stockIn/item/view/${payload.storeId}/${payload.id}`;
      } else if (payload.type === 'edit') {
        path = `/stock/zb/stockIn/item/edit/${payload.storeId}/${payload.id}`;
      }
      yield put(routerRedux.push(path));
    },
    * delete({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      const data = yield call(remove, { id: payload.id, storeId: payload.storeId });
      if (data.data && data.data.success) {
        message.success('删除成功！');
        yield put({ type: 'reload' });
      } else {
        message.error(data.data.errorInfo);
        yield put({ type: 'hideLoading' });
      }
    },
    * reverse({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      const data = yield call(zbReverse, { id: payload.id, storeId: payload.storeId });
      if (data.data && data.data.success) {
        message.success('反审成功！');
        yield put({ type: 'reload' });
      } else {
        message.error(data.data.errorInfo);
        yield put({ type: 'hideLoading' });
      }
    },
    * export({ payload }, { call }) {
      yield call(zbExport, { id: payload.id, storeId: payload.storeId });
    },
    * reload(action, { put, select }) {
      const zbData = yield select(state => state.zbStockIn);
      yield put(
        {
          type: 'queryList',
          payload: {
            billNo: zbData.filters.billNo,
            billType: zbData.filters.billType ? Number(zbData.filters.billType) : '',
            busiId: zbData.filters.busiId,
            depotId: zbData.filters.depotId,
            status: zbData.filters.status,
            startDate: zbData.startDate,
            endDate: zbData.endDate,
            storeId: zbData.storeId,
            page: zbData.pagination.current,
            rows: zbData.pagination.pageSize,
          },
        });
    },
    // 从入库单详情退回来时请求的方法,这里用payload传递过来的storeId，
    // 防止storeId没来得及传递给zbData
    * backReload({ payload }, { put, select }) {
      const zbData = yield select(state => state.zbStockIn);
      yield put(
        {
          type: 'queryList',
          payload: {
            billNo: zbData.filters.billNo,
            billType: zbData.filters.billType ? Number(zbData.filters.billType) : '',
            busiId: zbData.filters.busiId,
            depotId: zbData.filters.depotId,
            status: zbData.filters.status,
            startDate: zbData.startDate,
            endDate: zbData.endDate,
            storeId: payload.storeId,
            page: zbData.pagination.current,
            rows: zbData.pagination.pageSize,
          },
        });
    },
  },
  reducers: {
    showLoading(state) {
      return { ...state, loading: true };
    },
    hideLoading(state) {
      return { ...state, loading: false };
    },
    querySuccess(state, action) { return { ...state, ...action.payload, loading: false }; },
    updateState(state, action) { return { ...state, ...action.payload }; },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        const pathname = location.pathname;
        const re = pathToRegexp('/stock/zb/stockIn/:storeId');
        const match = re.exec(pathname);
        // 如果匹配则把storeId保存并请求该店信息，无论是否匹配，都请求分类
        if (match) {
          const storeId = match[1];
          dispatch({
            type: 'querySuccess',
            payload: { storeId },
          });
          dispatch({
            type: 'backReload',
            payload: {
              storeId,
            },
          });
          dispatch({
            type: 'queryWarehouse',
            payload: {
              rows: '1000',
              storeId,
            },
          });
          dispatch({
            type: 'queryDepot',
            payload: { ...location.query, rows: 10, orgType: 2 },
          });
          dispatch({
            type: 'queryType',
            payload: { t: 910 },
          });
          dispatch({
            type: 'querySupplier',
            payload: {
              status: 1,
              rows: '1000',
            },
          });
        } else if (location.pathname === '/stock/zb/stockIn') {
          dispatch({
            type: 'queryDepot',
            payload: { ...location.query, rows: 10, orgType: 2 },
          });
          dispatch({
            type: 'queryType',
            payload: { t: 910 },
          });
          dispatch({
            type: 'querySupplier',
            payload: {
              status: 1,
              rows: '1000',
            },
          });
        }
      });
    },
  },
};
