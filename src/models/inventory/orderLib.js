import { parse } from 'qs';
import moment from 'moment';
import { routerRedux } from 'dva/router';
import { message } from 'antd';
import { queryOrg, querySupplier, queryWarehouse, queryType } from '../../services/inventory/common';
import { fetchList, retreatAnItem, exportAnItem } from '../../services/inventory/orderLib';
// , queryAddPurchase, queryGoodsID, queryfind, queryExport, findScmInGoods, findTreeList
export default {
  namespace: 'orderLibModule',
  state: {
    orgId: '',
    orgList: [],
    storeId: '',
    storeList: [],

    newData: {
      key: 2,
      id: '',
    },
    filterStatus: '',
    filterDataRange: [moment().subtract(15, 'days'), moment()],
    filterOpterName: '',
    filterBillNo: '',
    selectedRows: [],
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
    updateData(state, action) {
      return { ...state, ...action.payload };
    },
    warehouseSuccess(state, action) { return { ...state, ...action.payload, loading: false }; },
    queryTypeSuccess(state, action) { return { ...state, ...action.payload }; },
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
    updateFilterOpterName(state, action) {
      return { ...state, filterOpterName: action.filterOpterName };
    },
    updateFilterBillNo(state, action) {
      return { ...state, filterBillNo: action.filterBillNo };
    },
    updateSelectedRows(state, action) {
      return { ...state, selectedRows: action.selectedRows };
    },
    setStoreId(state, action) {
      return { ...state, storeId: action.storeId };
    },
    saveOrgId(state, action) {
      return { ...state, orgId: action.orgId };
    },
  },
  effects: { // Fire an action or action a function here.
    * getList({ payload }, { call, put, select }) { // 请求内容
      yield put({ type: 'showLoading' });
      const { orgId, filterStatus, filterDataRange, filterOpterName, filterBillNo, listPagination } = yield select(state => state.orderLibModule);
      let storeId = yield select(state => state.orderLibModule.storeId);
      storeId = payload.storeId || storeId; // 没有storeId参数的话使用state的
      const distribId = payload.distribId || orgId; // 没有机构id参数的话使用state的orgId
      const pageNo = payload.pageNo || listPagination.current;
      const pageSize = payload.pageSize || listPagination.size;
      if (!distribId) {
        yield false;
      }
      const reqParams = {
        distribId,
        storeId,
        page: pageNo, // 查看第几页内容 默认1
        rows: pageSize, // 一页展示条数 默认20
        createUserName: filterOpterName, // 操作人
        billNo: filterBillNo, // 单据号
        // bussDate,//要货日期
        // remark,
        start: filterDataRange[0], // 开始时间
        end: filterDataRange[1], // 结束时间
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
        // yield put({
        //   type: 'querySupplier',
        //   payload: {
        //     status: 1,
        //     rows: '1000',
        //   },
        // });
        // yield put({
        //   type: 'queryWarehouse',
        //   payload: {
        //     status: 1,
        //     rows: '1000',
        //     queryString: '',
        //     limit: '1000',
        //   },
        // });
      } else {
        message.warning(`操作失败，请参考：${listData.data.errorInfo}`);
        yield put({ type: 'hideLoading' });
        yield put({
          type: 'updateData',
          payload: {
            dataSourceAll: [],
            listPagination: {
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: '共 0 条',
              current: 1,
              total: 0,
              size: 10,
              pageSizeOptions: [10, 20, 50, 100],
            },
          },
        });
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
          },
        });
      } else {
        message.warning(`操作失败，请参考：${data.data.errorInfo}`);
        yield put({ type: 'hideLoading' });
      }
    },
    * queryOrg({ payload }, { call, put }) {
      const data = yield call(queryOrg, parse(payload));
      if (data.data && data.data.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            orgList: data.data.data.aclStoreList,
            weatherList: data.data.data.weatherList,
            eventList: data.data.data.holidaysList,
          },
        });
      } else {
        message.error(`操作失败，请参考：${data.data.errorInfo}`);
      }
    },
    * queryStoreList({ payload }, { call, put }) {
      yield put({ type: 'saveOrgId', orgId: payload.distribId });
      const data = yield call(queryOrg, parse(payload));
      if (data.data && data.data.success) {
        const storeLists = data.data.data.aclStoreList;
        // const storeLists = storeLists1.slice(0, 1);
        let currStoreId = '';
        if (storeLists.length > 1) {
          storeLists.unshift({ id: '', name: '请选择门店' });
        } else if (storeLists.length === 1) {
          currStoreId = storeLists[0].id;
        }
        yield put({
          type: 'updateData',
          payload: {
            storeId: currStoreId,
            storeList: storeLists,
          },
        });
      } else {
        message.warning(`操作失败，请参考：${data.data.errorInfo}`);
      }
    },
    * generateBill({ payload }, { put }) { // 新增请购单
      const path = '/stock/orderLib/details';
      yield put(routerRedux.push(path));
    },
    * queryWarehouse({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      const data = yield call(queryWarehouse, parse(payload));
      if (data.data && data.data.success) {
        yield put({
          type: 'warehouseSuccess',
          payload: {
            warehouseList: data.data.data.page.data,
          },
        });
      } else {
        message.warning(`操作失败，请参考：${data.data.errorInfo}`);
        yield put({ type: 'hideLoading' });
      }
    },
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
    * retreatOrderLibItem({ payload }, { call, put, select }) { // 删除请购单
      const storeId = yield select(state => state.orderLibModule.storeId);
      const optData = yield call(retreatAnItem, { id: payload.id });
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
    * setFilterOpterName({ payload }, { put }) { // 设置操作人
      yield put({
        type: 'updateFilterOpterName',
        filterOpterName: payload.filterOpterName,
      });
    },
    * setFilterBillNo({ payload }, { put }) { // 设置订单状态
      yield put({
        type: 'updateFilterBillNo',
        filterBillNo: payload.filterBillNo,
      });
    },
    // * getOrderLibByFilter({ payload }, { select, put }) { // 删除请购单  gose here 2017-9-18 19:27:20
    //   const { storeId, filterStatus, filterDataRange, filterOpterName, filterBillNo } = yield select(state => state.orderLibModule);
    //   console.log("storeId, filterStatus, filterDataRange, filterOpterName, filterBillNo",storeId, filterStatus, filterDataRange, filterOpterName, filterBillNo);
    //   yield put({
    //     type: 'getList',
    //     payload: {
    //       storeId,
    //     },
    //   });
    // },
    * exportItem({ payload }, { call }) {
      // const storeId = yield select(state => state.orderLibModule.storeId);
      yield call(exportAnItem, { id: payload.id, storeId: payload.storeId });
    },
    * saveStoreId({ payload }, { put }) {
      yield put({
        type: 'setStoreId',
        storeId: payload.storeId,
      });
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
        if (location.pathname === '/stock/orderLib') {
          dispatch({
            type: 'queryOrg',
            payload: { ...location.query, rows: 10, orgType: 2 }, // orgType:1 门店 2:总部
          });
          // dispatch({
          //   type: 'querySupplier',
          //   payload: {
          //     status: 1,
          //     rows: '1000',
          //   },
          // });
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
          dispatch({
            type: 'queryType',
            payload: {
              t: 910,
            },
          });

          dispatch({
            type: 'getList', // getOrderLibByFilter
            payload: {},
          });
        }
        if (location.pathname === '/stock/orderLib/details') {
          dispatch({
            type: 'editableMem',
            payload: { dataSource: [] },
          });
          // dispatch({
          //   type: 'findTreeList',
          //   payload: { type: 0 },
          // });
        }
      });
    },
  },
};
