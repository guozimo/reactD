import { parse } from 'qs';
import moment from 'moment';
import { routerRedux } from 'dva/router';
import { message } from 'antd';
import { queryOrg, querySupplier, queryType } from '../../services/inventory/common';
import { fetchList, deleteAnItem, abolishAnItem, exportAnItem } from '../../services/inventory/priceList';
// , queryAddPurchase, queryGoodsID, queryfind, queryExport, findScmInGoods, findTreeList
export default {
  namespace: 'priceListModule',
  state: {
    orgId: '',
    orgList: [],
    storeId: '',
    depotList: [],

    newData: {
      key: 2,
      id: '',
    },
    filterStatus: '',
    filterDataRange: [moment().add(-1, 'month'), moment()],
    filterOpterName: '',
    filterBillNo: '',
    // hasDeliveryCenter: false,
    listPagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => `共 ${total} 条`,
      current: 1,
      total: 0,
      pageSize: 10,
      pageSizeOptions: [10, 20, 50, 100],
    },
    billStatus: { 960: '已作废', 962: '已审核', 961: '待审核' },
  },
  reducers: { // Update above state.
    mergeData(state, action) {
      return { ...state, ...action.payload };
    },
    warehouseSuccess(state, action) { return { ...state, ...action.payload, loading: false }; },
    queryTypeSuccess(state, action) { return { ...state, ...action.payload, loading: false }; },
    supplierSuccess(state, action) { return { ...state, ...action.payload, loading: false }; },
    showLoading(state) { return { ...state, loading: true }; },
    hideLoading(state) { return { ...state, loading: false }; },
    saveOrgId(state, action) { return { ...state, orgId: action.orgId }; },
    // updateFilterStatus(state, action) {
    //   return { ...state, filterStatus: action.filterStatus };
    // },
    // updateFilterDataRange(state, action) {
    //   return { ...state, filterDataRange: action.filterDataRange };
    // },
    // updateFilterOpterName(state, action) {
    //   return { ...state, filterOpterName: action.filterOpterName };
    // },
    // updateFilterBillNo(state, action) {
    //   return { ...state, filterBillNo: action.filterBillNo };
    // },
    // setOrgInfo(state, action) {
    //   return { ...state, hasDeliveryCenter: action.hasDeliveryCenter };
    // },
  },
  effects: { // Fire an action or action a function here.
    * getList({ payload }, { call, put, select }) { // 请求内容
      console.log('getList!');
      yield put({ type: 'showLoading' });
      // let storeId = yield select(state => state.priceListModule.storeId);
      const { orgId, filterStatus, filterDataRange, filterBillNo, listPagination } = yield select(state => state.priceListModule); // filterOpterName

      const orgInfoId = payload.distribId || orgId; // 没有机构id参数的话使用state的orgId
      const pageNo = payload.pageNo || listPagination.current;
      const pageSize = payload.pageSize || listPagination.pageSize;
      if (!orgInfoId) {
        yield false;
      }

      const reqParams = {
        orgInfoId,
        // storeId,
        page: pageNo, // 查看第几页内容 默认1
        rows: pageSize, // 一页展示条数 默认20
        // createUserName: filterOpterName, // 操作人
        billNo: filterBillNo, // 单据号
        // bussDate,//要货日期
        // remark,
        startDate: moment(filterDataRange[0]).format('YYYY-MM-DD'), // 开始时间
        endDate: moment(filterDataRange[1]).format('YYYY-MM-DD'), // 结束时间
        status: filterStatus, // 状态（962：已审核，961：待审核，960：已作废）
      };
      const listData = yield call(fetchList, parse(reqParams));
      console.log('listData ', listData);
      if (listData.data && listData.data.success) {
        yield put({
          type: 'mergeData',
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
        yield put({
          type: 'hideLoading',
        });
        // yield put({
        //   type: 'querySupplier',
        //   payload: {
        //     status: 1,
        //     rows: '1000',
        //   },
        // });
        // yield put({
        //   type: 'queryDepot',
        //   payload: {
        //     status: 1,
        //     rows: '1000',
        //     queryString: '',
        //     storeId,
        //     limit: '1000',
        //   },
        // });
        // yield put({
        //   type: 'queryType',
        //   payload: {
        //     t: 910,
        //   },
        // });
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
          },
        });
      } else {
        message.warning(`操作失败，请参考：${data.data.errorInfo}`);
        yield put({ type: 'hideLoading' });
      }
    },
    // * queryDepot({ payload }, { call, put }) { // 门店列表
    //   yield put({ type: 'showLoading' });
    //   const data = yield call(queryDepot, parse(payload));
    //   if (data.data && data.data.success) {
    //     yield put({
    //       type: 'mergeData',
    //       payload: {
    //         depotList: data.data.data.aclStoreList,
    //         weatherList: data.data.data.weatherList,
    //         eventList: data.data.data.holidaysList,
    //       },
    //     });
    //   } else {
    //     message.warning(`操作失败，请参考：${data.data.errorInfo}`);
    //     yield put({ type: 'hideLoading' });
    //   }
    // },
    * queryOrg({ payload }, { call, put }) {
      const data = yield call(queryOrg, parse(payload));
      if (data.data && data.data.success) {
        yield put({
          type: 'mergeData',
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
    * setOrgId({ payload }, { put }) {
      yield put({ type: 'saveOrgId', orgId: payload.distribId });
    },
    * createBill({ payload }, { put }) { // 新增售价单
      const path = payload.record ? `/official/price_list/${payload.opType}_item/${payload.record.id}/${payload.record.orgInfoId}`
        : `/official/price_list/${payload.opType}_item/`;
      yield put(routerRedux.push(path));
    },
    // 与queryDepot重复，去掉
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
    * deletePriceListItem({ payload }, { call, put }) { // 删除售价单
      const optData = yield call(deleteAnItem, {
        id: payload.record.id,
        billNo: payload.record.billNo,
      });
      if (optData.data.code === '200' && optData.data.success === true) { // 删除成功
        yield put({
          type: 'getList',
          payload: {},
        });
      }
    },
    * abolishPriceListItem({ payload }, { call, put }) { // 作废售价单
      const optData = yield call(abolishAnItem, {
        id: payload.record.id,
        billNo: payload.record.billNo,
      });
      if (optData.data.code === '200' && optData.data.success === true) { // 作废成功
        yield put({
          type: 'getList',
          payload: {},
        });
      }
    },
    * setFilterStatus({ payload }, { put }) { // 设置搜索状态
      yield put({ // updateFilterStatus
        type: 'mergeData',
        payload: { filterStatus: payload.filterStatus },
      });
    },
    * setFilterDataRange({ payload }, { put }) { // 设置搜索时间范围
      yield put({ // updateFilterDataRange
        type: 'mergeData',
        payload: { filterDataRange: payload.filterDataRange },
      });
    },
    * setFilterOpterName({ payload }, { put }) { // 设置操作人
      yield put({ // updateFilterOpterName
        type: 'mergeData',
        payload: { filterOpterName: payload.filterOpterName },
      });
    },
    * setFilterBillNo({ payload }, { put }) { // 设置订单状态
      console.log('setFilterBillNo payload', payload);
      yield put({ // updateFilterBillNo
        type: 'mergeData',
        payload: { filterBillNo: payload.filterBillNo },
      });
    },
    // * getPriceListByFilter({ payload }, { select, put }) { // 删除售价单  gose here 2017-9-18 19:27:20
    //   const { storeId, filterStatus, filterDataRange, filterOpterName, filterBillNo } = yield select(state => state.priceListModule);
    //   console.log("storeId, filterStatus, filterDataRange, filterOpterName, filterBillNo",storeId, filterStatus, filterDataRange, filterOpterName, filterBillNo);
    //   yield put({
    //     type: 'getList',
    //     payload: {
    //       storeId,
    //     },
    //   });
    // },
    * exportItem({ payload }, { select, call }) {
      const storeId = yield select(state => state.priceListModule.storeId);
      yield call(exportAnItem, { id: payload.id, storeId });
    },
    // * checkOrgInfo({ payload }, { call, put }) {
    //   const orgData = yield call(fetchOrgInfo, { storeId: payload.storeId });
    //   if (orgData.data.code === '200' && orgData.data.success === true) { // 删除成功
    //     const hasDeliveryCenter = orgData.data.data.flag;
    //     yield put({
    //       type: 'setOrgInfo', hasDeliveryCenter,
    //     });
    //   }
    // },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/official/price_list') {
          dispatch({
            type: 'queryOrg',
            payload: { ...location.query, rows: 10, orgType: 2 }, // orgType:1 门店 2:总部
          });
          // dispatch({
          //   type: 'queryDepot',
          //   payload: { ...location.query, rows: 10, orgType: 1 }, // orgType:1 门店 2:总部
          // });
          dispatch({
            type: 'querySupplier',
            payload: {
              status: 1,
              rows: '1000',
            },
          });
          // 与queryDepot重复，去掉
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
          dispatch({
            type: 'getList', // getOrderLibByFilter
            payload: {},
          });
        }
        if (location.pathname === '/official/price_list/details') {
          // console.log('location.pathname',location.pathname);
          // dispatch({
          //   type: 'editableMem',
          //   payload: { dataSource: [] },
          // });
          // dispatch({
          //   type: 'findTreeList',
          //   payload: { type: 0 },
          // });
        }
      });
    },
  },
};
