import { parse } from 'qs';
import { message } from 'antd';
import moment from 'moment';
import { queryOrg, querySupplier, queryType, findTreeList, queryDepot } from '../../services/inventory/common';
import { query, exportAnItem } from '../../services/inventory/stockGlobalInOutDetail';

export default {
  namespace: 'stockGlobalInOutDetail',
  state: {
    storeId: '',
    depotList: [],  // 门店列表
    depotCannList: [], // 出入库
    supplierList: [],  // 供应商
    typeList: [], // 业务类型
    newData: {
      key: 2,
      id: '',
    },
    filterOpterName: '',
    goodsName: '', // 物资名称
    depotId: '', // 首页调出仓库ID
    inNewDepotId: '', // 首页调入仓库ID
    searchTree: [], // 类别
    typeName: '',
    supplierName: '',
    cateId: '',
    filterDataRange: [moment(), moment()],
    listPagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => `共 ${total} 条`,
      current: 1,
      total: 0,
      pageSize: 10,
      pageSizeOptions: [10, 20, 50, 100],
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
    updateFilterDataRange(state, action) {
      return { ...state, filterDataRange: action.filterDataRange };
    },
    updateFilterBillNo(state, action) {
      return { ...state, goodsName: action.goodsName };
    },
  },
  effects: {
    * queryOrg({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      const data = yield call(queryOrg, parse(payload));
      if (data.data && data.data.success) {
         // console.log("data=",data);
        const aclStoreList = data.data.data.aclStoreList;
        const storeIdConst = aclStoreList[0].id;
        yield put({
          type: 'querySuccess',
          payload: {
            depotList: aclStoreList,
            weatherList: data.data.data.weatherList,
            eventList: data.data.data.holidaysList,
          },
        });
        // 如果List长度为1
        if (aclStoreList.length === 1) {
          yield put({
            type: 'getList',
            payload: {
              storeId: storeIdConst,
              pageNo: 1,
            },
          });
          yield put({
            type: 'queryDepot',
            payload: {
              rows: 10,
              storeId: storeIdConst,
            },
          });
          yield put({
            type: 'querySupplier',
            payload: {
              rows: 1000,
            },
          });
          yield put({
            type: 'queryType',
            payload: {
              t: 910,
            },
          });
          yield put({
            type: 'findTreeList',
            payload: {
              type: '0',
            },
          });
          yield put({
            type: 'querySuccess',
            payload: {
              storeId: storeIdConst,
              depotId: '',
              inNewDepotId: '',
              searchTree: [],
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
      let storeId = yield select(state => state.stockGlobalInOutDetail.storeId);
      const {
        goodsName,
        depotId,
        cateId,
        filterDataRange,
        listPagination,
        supplierName,
        typeName,
        typeList,
        } = yield select(state => state.stockGlobalInOutDetail);
      let typeId = '';
      if (typeList) {
        for (let i = 0, index = typeList.length; i < index; i += 1) {
          if (typeList[i].id === typeName)typeId = typeList[i].dictCode;
        }
      }
    //      console.log(typeList);
    //    console.log(typeId);
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
          busiId: supplierName,
          billType: typeId,
          startDate: filterDataRange[0].format('YYYY-MM-DD'), // 开始时间
          endDate: filterDataRange[1].format('YYYY-MM-DD'), // 结束时间
        };
      }
    //    console.log("发送的数据",reqParams);
      const listData = yield call(query, parse(reqParams));
    //    console.log("得到的数据",listData);
      if (listData.data && listData.data.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            dataSourceAll: listData.data.data.data,
            listPagination: {
              showSizeChanger: true,
              showQuickJumper: true,
              total: listData.data.data.totalCount,
              current: listData.data.data.page,
              showTotal: total => `共 ${total} 条`,
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
  // ↓ 业务类型
    * queryType({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      const data = yield call(queryType, parse(payload));
      if (data.data && data.data.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            typeList: data.data.data,
          },
        });
      } else {
        message.warning(`操作失败，请参考：${data.data.errorInfo}`);
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
    * setFilterBillNo({ payload }, { put }) { // 设置订单状态
      yield put({
        type: 'updateFilterBillNo',
        goodsName: payload.goodsName,
      });
    },
// ↓ 仓库
    * queryDepot({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      const data = yield call(queryDepot, parse(payload));

      if (data.data && data.data.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            depotCannList: data.data.data.page.data,
            // weatherList: data.data.data.aclStoreList,
            // eventList: data.data.data.holidaysList,
          },
        });
      } else {
        message.warning(`操作失败，请参考：${data.data.errorInfo}`);
        yield put({ type: 'hideLoading' });
      }
    },
    * setFilterDataRange({ payload }, { put }) { // 设置搜索时间范围
      yield put({
        type: 'updateFilterDataRange',
        filterDataRange: payload.filterDataRange,
      });
    },
    * findTreeList({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      const data = yield call(findTreeList, parse(payload));
      if (data) {
        yield put({
          type: 'querySuccess',
          payload: {
            searchTree: data.data.data,
          },
        });
      }
    },
    * exportItem({ payload }, { select, call }) {
      const { storeId, depotId, typeName, goodsName, supplierName, cateId, typeList, filterDataRange } = yield select(state => state.stockGlobalInOutDetail);
      let reqParams = {};
      let typeId = '';
      if (typeList) {
        for (let i = 0, index = typeList.length; i < index; i += 1) {
          if (typeList[i].id === typeName)typeId = typeList[i].dictCode;
        }
      }
      if (filterDataRange.length !== 0) {
        reqParams = {
          storeId,
          depotId,
          goodsName,
          cateId,
          busiId: supplierName,
          billType: typeId,
          startDate: filterDataRange[0].format('YYYY-MM-DD'), // 开始时间
          endDate: filterDataRange[1].format('YYYY-MM-DD'), // 结束时间
        };
      }
      yield call(exportAnItem, parse(reqParams));
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        // console.warn("location.pathname", location.pathname);
        if (location.pathname === '/stock/stockGlobalInOutDetail') {
          dispatch({
            type: 'queryOrg',
            payload: { ...location.query, rows: 10, orgType: 2 }, // orgType:1 门店 2:总部
          });
        }
      });
    },
  },
};
