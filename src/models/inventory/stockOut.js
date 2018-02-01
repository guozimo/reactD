import { parse } from 'qs';
import moment from 'moment';
import { routerRedux } from 'dva/router';
import { message } from 'antd';
import { queryWarehouse, zbOutReverse } from '../../services/inventory/common';
import { fetchList, fetchAngencyList, remove, zbExport } from '../../services/inventory/stockOut';
// , queryAddPurchase, queryGoodsID, queryfind, queryExport, findScmInGoods, findTreeList

const dateFormat = 'YYYY-MM-DD';
export default {
  namespace: 'stockOutModule',
  state: {
    storeId: '',
    angencyList: [],
    stockOutTypeList: [],
    stockOutHouseList: [],
    supplierList: [],
    filterStatus: '',
    filterDataRange: [moment().add(-15, 'day'), moment()],
    filterOpterName: '',
    filterBillNo: '',
    // filterRemarks: '',
    nowDate: 0,
    monthDate: 0,
    billType: '',
    depotId: '',
    // busiId: '',
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
    queryListSuccess(state, action) {
      return { ...state, ...action.payload, loadingList: false };
    },
    updateFilterStatus(state, action) {
      return { ...state, filterStatus: action.filterStatus };
    },
    updateFilterDataRange(state, action) {
      return { ...state, filterDataRange: action.filterDataRange };
    },
    updateFilterBillNo(state, action) {
      return { ...state, filterBillNo: action.filterBillNo };
    },
    // updateFilterRemarks(state, action) {
    //   return { ...state, filterRemarks: action.filterRemarks };
    // },
    showLoading(state) {
      return { ...state, loading: true };
    },
    hideLoading(state) {
      return { ...state, loading: false };
    },
    showListLoading(state) {
      return { ...state, loadingList: true };
    },
    hideListLoading(state) {
      return { ...state, loadingList: false };
    },
  },
  effects: { // Fire an action or action a function here.
    * getList({ payload }, { call, put, select }) { // 请求列表数据
      yield put({ type: 'showListLoading' });
      let storeId = yield select(state => state.stockOutModule.storeId);
      const { filterStatus, filterDataRange, filterOpterName, filterBillNo,
          listPagination, depotId, billType } = yield select(state => state.stockOutModule);
      storeId = payload.storeId || storeId; // 没有storeId参数的话使用state的
      if (!storeId) {
        yield false;
      }
      const pageNo = payload.pageNo || listPagination.current;
      const pageSize = payload.pageSize || listPagination.size;
      const startDataRange = filterDataRange[0].format(dateFormat);
      const endDataRange = filterDataRange[1].format(dateFormat);
      const reqParams = { // 请求列表数据 需要的参数
        storeId,
        page: pageNo,
        rows: pageSize,
        createUserName: filterOpterName,
        billType,
        billNo: filterBillNo,
        depotId,
        // busiId,
        startDate: startDataRange,
        endDate: endDataRange,
        status: filterStatus, // 状态（964：待处理，965：已提交，962：已完成）
        // remarks: filterRemarks,
      };
      const listData = yield call(fetchList, parse(reqParams));
      if (listData.data && listData.data.success) {
        yield put({
          type: 'queryListSuccess',
          payload: {
            dataSourceAll: listData.data.data.page.data,
            monthDate: listData.data.data.monthDate,
            nowDate: listData.data.data.now,
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
        message.error(listData.data.errorInfo);
        yield put({ type: 'hideListLoading' });
      }
    },
    * queryAgency({ payload }, { call, put, select }) { // 请求机构
      yield put({ type: 'showLoading' });
      let storeId = yield select(state => state.stockOutModule.storeId);
      storeId = payload.storeId || storeId; // 没有storeId参数的话使用state的
      const reqParams = {
        storeId,
        orgType: 2,
      };
      const data = yield call(fetchAngencyList, parse(reqParams));
      if (data.data && data.data.success) {
        const angencies = data.data.data.aclStoreList;
        let currStoreId = '';
        let initialValue;
        if (angencies.length === 1) {
          currStoreId = angencies[0].id;
          initialValue = angencies[0].name;
          yield put({
            type: 'querySuccess',
            payload: {
              storeId: currStoreId,
              initialOrgName: initialValue,
              angencyList: angencies,
            },
          });
          yield put({
            type: 'queryType',
            payload: {},
          });
          yield put({
            type: 'queryWarehouse',
            payload: {},
          });
          yield put({
            type: 'getList',
            payload: {
              storeId: currStoreId,
            },
          });
        }
        yield put({
          type: 'querySuccess',
          payload: {
            angencyList: angencies,
          },
        });
      } else {
        message.warning(`操作失败，请参考：${data.data.errorInfo}`);
        yield put({ type: 'hideLoading' });
      }
    },
    * queryType({ payload }, { put }) { // 请求单据类型
      yield put({ type: 'showLoading' });
      // const typeData = yield call(queryType, parse(payload));
      // if (typeData.data && typeData.data.success) {
      //   const dealingData = typeData.data.data;
      const newType = [{
        dictCode: '',
        dictName: '请选择',
      }, {
        dictCode: '919',
        dictName: '其它出库',
      }, {
        dictCode: '917',
        dictName: '报损出库',
      }, {
        dictCode: '916',
        dictName: '消耗出库',
      }, {
        dictCode: '922',
        dictName: '调拨出库',
      }, {
        dictCode: '915',
        dictName: '盘亏出库',
      }, {
        dictCode: '939',
        dictName: '配送出库',
      }];
      if (newType) {
        yield put({
          type: 'querySuccess',
          payload: {
            stockOutTypeList: newType,
          },
        });
      } else {
        message.error('返回数据出错');
        yield put({ type: 'hideLoading' });
      }
    },
    * queryWarehouse({ payload }, { call, put }) { // 请求仓库列表
      yield put({ type: 'showLoading' });
      const data = yield call(queryWarehouse, parse(payload));
      if (data.data && data.data.success) {
        const houseList = data.data.data.page.data;
        houseList.unshift({ id: '', depotName: '请选择' });
        yield put({
          type: 'querySuccess',
          payload: {
            stockOutHouseList: houseList,
          },
        });
      } else {
        message.error(`返回数据出错，原因：${data.data.errorInfo}`);
        yield put({ type: 'hideLoading' });
      }
    },
    * toItem({ payload }, { put }) { // 跳转到新增/编辑/查看页面
      let path = '';
      if (payload.type === 'add') {
        path = `/stock/stockOut/details/add/${payload.storeId}/0`;
      } else if (payload.type === 'view') {
        path = `/stock/stockOut/details/view/${payload.storeId}/${payload.id}`;
      } else if (payload.type === 'edit') {
        path = `/stock/stockOut/details/edit/${payload.storeId}/${payload.id}`;
      }
      yield put(routerRedux.push(path));
    },
    * reverse({ payload }, { call, put }) { // 反审核功能
      yield put({ type: 'showLoading' });
      const data = yield call(zbOutReverse, { id: payload.id, storeId: payload.storeId });
      if (data.data && data.data.success) {
        message.success('反审成功！');
        yield put({ type: 'reload' });
      } else {
        message.error(data.data.errorInfo);
        yield put({ type: 'hideLoading' });
      }
    },
    * export({ payload }, { call }) { // 导出功能
      yield call(zbExport, { id: payload.id, storeId: payload.storeId });
    },
    * delete({ payload }, { call, put }) { // 删除功能
      yield put({ type: 'showLoading' });
      const data = yield call(remove, { id: payload.id, storeId: payload.storeId });
      if (data.data && data.data.success) {
        yield put({ type: 'reload' });
        message.success('删除成功！');
      } else {
        message.error(data.data.errorInfo);
        yield put({ type: 'hideLoading' });
      }
    },
    * reload(action, { put }) { // 反审核/删除成功后 重新请求列表
      yield put(
        {
          type: 'getList',
          payload: {
            loading: false,
          },
        });
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
    * setFilterBillNo({ payload }, { put }) { // 设置订单状态
      yield put({
        type: 'updateFilterBillNo',
        filterBillNo: payload.filterBillNo,
      });
    },
    // * setFilterRemarks({ payload }, { put }) { // 设置订单状态
    //   yield put({
    //     type: 'updateFilterRemarks',
    //     filterRemarks: payload.filterRemarks,
    //   });
    // },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/stock/stockOut') {
          dispatch({
            type: 'getList',
            payload: {
              rows: 10,
            },
          });
          dispatch({
            type: 'queryAgency',
            payload: {
              status: 1,
              rows: '1000',
            },
          });
          dispatch({
            type: 'stockOutDetailsModule/querySuccess',
            payload: {
              pageStatus: 963,
            },
          });
        }
      });
    },
  },
};
