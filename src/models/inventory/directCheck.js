import { parse } from 'qs';
import { routerRedux } from 'dva/router';
import moment from 'moment';
import { message } from 'antd';
import { queryDepot, querySupplier, queryType } from '../../services/inventory/common';
import { fetchList, deleteAnItem, exportAnItem } from '../../services/inventory/directCheck';
// , queryAddPurchase, queryGoodsID, queryfind, queryExport, findScmInGoods, findTreeList
export default {
  namespace: 'directCheckModule',
  state: {
    storeId: '',
    depotList: [],
    newData: {
      key: 2,
      id: '',
    },
    supplierList: [],
    filterStatus: '',
    filterDataRange: [moment().subtract(1, 'month'), moment()],
    busiId: '',
    filterBillNo: '',
    selectedRows: [],
    hasAutoSelected: false, // 默认false标示没有设置过，设置过的话在只有一个机构自动选中后不再进入选中项之后的流程
    listPagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => `共 ${total} 条`,
      current: 1,
      total: 0,
      size: 10,
      pageSizeOptions: [10, 20, 50, 100],
    },
  },
  reducers: { // Update above state.
    querySuccess(state, action) {
      return { ...state, ...action.payload, loading: false };
    },
    warehouseSuccess(state, action) { return { ...state, ...action.payload, loading: false }; },
    queryTypeSuccess(state, action) { return { ...state, ...action.payload, loading: false }; },
    supplierSuccess(state, action) { return { ...state, ...action.payload, loading: false }; },
    showLoading(state) {
      return { ...state, loading: true };
    },
    hideLoading(state) {
      return { ...state, loading: false };
    },
    updateFilterStatus(state, action) {
      return { ...state, filterStatus: action.filterStatus };
    },
    updateFilterDataRange(state, action) {
      return { ...state, filterDataRange: action.filterDataRange };
    },
    updateSuppier(state, action) {
      return { ...state, busiId: action.busiId };
    },
    updateFilterBillNo(state, action) {
      return { ...state, filterBillNo: action.filterBillNo };
    },
    updateSelectedRows(state, action) {
      return { ...state, selectedRows: action.selectedRows };
    },
  },
  effects: { // Fire an action or action a function here.
    * getList({ payload }, { call, put, select }) { // 请求内容
      yield put({ type: 'showLoading' });
      let storeId = yield select(state => state.directCheckModule.storeId);
      const { filterStatus, filterDataRange, busiId, filterBillNo, listPagination } = yield select(state => state.directCheckModule);

      storeId = payload.storeId || storeId; // 没有storeId参数的话使用state的
      const pageNo = payload.pageNo || listPagination.current;
      const pageSize = payload.pageSize || listPagination.size;
      if (!storeId) {
        yield false;
      }
      const reqParams = {
        storeId,
        page: pageNo, // 查看第几页内容 默认1
        rows: pageSize, // 一页展示条数 默认20
        busiId, // 操作人
        billNo: filterBillNo, // 单据号
        // bussDate, // 要货日期
        // remark,
        startDate: moment(filterDataRange[0]).format('YYYY-MM-DD'), // 开始时间
        endDate: moment(filterDataRange[1]).format('YYYY-MM-DD'), // 结束时间
        status: filterStatus, // 状态（964：待处理，965：已提交，962：已完成）
      };
      const listData = yield call(fetchList, parse(reqParams));
      // 清空选中行
      yield put({ type: 'updateSelectedRows', selectedRows: [] });
      if (listData.data && listData.data.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            dataSourceAll: listData.data.data.page.data,
            billStatus: listData.data.data.billStatus,
            listPagination: {
              showSizeChanger: true,
              showQuickJumper: true,
              total: listData.data.data.page.totalCount,
              current: listData.data.data.page.page,
              showTotal: total => `共 ${total} 条`,
              size: listData.data.data.page.limit,
              pageSizeOptions: [10, 20, 50, 100],
            },
          },
        });
      } else {
        message.warning(`操作失败，请参考：${listData.data.errorInfo}`);
        yield put({ type: 'hideLoading' });
      }
    },
    * querySupplier({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      const data = yield call(querySupplier, parse(payload));
      if (data.data && data.data.success) {
        yield put({
          type: 'supplierSuccess',
          payload: {
            supplierList: data.data.data.page.data,
            hasAutoSelected: true,
          },
        });
      } else {
        message.warning(`操作失败，请参考：${data.data.errorInfo}`);
        yield put({ type: 'hideLoading' });
      }
    },
    * queryDepot({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
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
        message.warning(`操作失败，请参考：${data.data.errorInfo}`);
        yield put({ type: 'hideLoading' });
      }
    },
    * createBill({ payload }, { put }) { // 新增请购单
      // console.log("-----------------------payload",payload);
      const path = `/stock/directCheck/details/${payload.opType}/${payload.id}/${payload.storeId}`;
      yield put(routerRedux.push(path));
    },
    // * queryWarehouse({ payload }, { call, put }) {
    //   yield put({ type: 'showLoading' });
    //   const data = yield call(queryWarehouse, parse(payload));
    //   if (data.data && data.data.success) {
    //     yield put({
    //       type: 'warehouseSuccess',
    //       payload: {
    //         warehouseList: data.data.data.page.data,
    //       },
    //     });
    //   } else {
    //     message.warning(`操作失败，请参考：${data.data.errorInfo}`);
    //     yield put({ type: 'hideLoading' });
    //   }
    // },
    * queryType({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      const data = yield call(queryType, parse(payload));
      if (data.data && data.data.success) {
        yield put({
          type: 'queryTypeSuccess',
          payload: {
            typeList: data.data.data,
          },
        });
      } else {
        message.warning(`操作失败，请参考：${data.data.errorInfo}`);
        yield put({ type: 'hideLoading' });
      }
    },
    * deleteDirectCheckItem({ payload }, { call, put, select }) { // 删除请购单
      const storeId = yield select(state => state.directCheckModule.storeId);
      const optData = yield call(deleteAnItem, { delIds: [payload.id], storeId });
      if (optData.data.code === '200' && optData.data.success === true) { // 删除成功
        yield put({
          type: 'getList',
          payload: {
            storeId,
          },
        });
      }
    },
    * setFilterStatus({ payload }, { put }) { // 设置搜索状态
      yield put({
        type: 'updateFilterStatus',
        filterStatus: payload.filterStatus,
      });
    },
    * setFilterDataRange({ payload }, { put }) { // 设置搜索时间范围
      yield put({
        type: 'updateFilterDataRange',
        filterDataRange: payload.filterDataRange,
      });
    },
    * changeSupplier({ payload }, { put }) { // 设置操作人
      yield put({
        type: 'updateSuppier',
        busiId: payload.busiId,
      });
    },
    * setFilterBillNo({ payload }, { put }) { // 设置订单状态
      yield put({
        type: 'updateFilterBillNo',
        filterBillNo: payload.filterBillNo,
      });
    },
    // * getDirectCheckByFilter({ payload }, { select, put }) { // 删除请购单  gose here 2017-9-18 19:27:20
    //   const { storeId, filterStatus, filterDataRange, filterOpterName, filterBillNo } = yield select(state => state.directCheckModule);
    //   console.log("storeId, filterStatus, filterDataRange, filterOpterName, filterBillNo",storeId, filterStatus, filterDataRange, filterOpterName, filterBillNo);
    //   yield put({
    //     type: 'getList',
    //     payload: {
    //       storeId,
    //     },
    //   });
    // },
    * exportItem({ payload }, { select, call }) {
      const storeId = yield select(state => state.directCheckModule.storeId);
      yield call(exportAnItem, { id: payload.id, storeId });
    },
    * setSelectedRows({ payload }, { put }) { // 同步选中行
      yield put({
        type: 'updateSelectedRows',
        selectedRows: payload.selectedRows,
      });
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/stock/directCheck') {
          dispatch({
            type: 'queryDepot',
            payload: { ...location.query, rows: 10, orgType: 1 }, // orgType:1 门店 2:总部
          });
          dispatch({
            type: 'getList',
            payload: {},
          });
          // dispatch({
          //   type: 'queryWarehouse',
          //   payload: {
          //     status: 1,
          //     rows: '1000',
          //     queryString: '',
          //     storeId: '',
          //     limit: '1000',
          //   },
          // });
          // dispatch({
          //   type: 'queryType',
          //   payload: {
          //     t: 910,
          //   },
          // });
          // dispatch({
          //   type: 'editableMem',
          //   payload: { dataSource: [] },
          // });
        }
        // if (location.pathname === '/stock/directCheck/details/:type/:idKye/:storeId') {
        //   dispatch({
        //     type: 'editableMem',
        //     payload: { dataSource: [] },
        //   });
          // dispatch({
          //   type: 'findTreeList',
          //   payload: { type: 0 },
          // });
        // }
      });
    },
  },
};
