import { parse } from 'qs';
import { message } from 'antd';
import { routerRedux } from 'dva/router';
import moment from 'moment';
import { queryOrg, queryDepot } from '../../services/inventory/common';
import { queryOutDistribution, queryExport } from '../../services/inventory/stockOutDistribution';


export default {
  namespace: 'stockOutDistribution',
  state: {
    testId: 0, // 测试用
    storeId: '', // 机构id
    storeList: [], // 机构列表
    searchList: { // 筛选列表内的数据存储
      warehouseId: '', // 仓库id
      warehouseList: [], // 仓库List
      orderStateId: '',  // 订单状态id
      orderStateList: [],
    // 订单List
      supplierId: '',
      // supplierList: [], // Test
      sendFilterDataRange: [moment().subtract(15, 'days'), moment()], // 提交日期
      outilterDataRange: [], // 出库日期
      inOrg: '', // 收货机构
      inOrgList: [], // 收货机构
      distributionOrderId: '',  // 配送订单号
    },
    // 筛选列的全部信息
    dataQuerySupplyList: [], // 返回全部数据
    pagination: { // 页码数据
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => `共 ${total} 条`,
      current: 1,
      total: 0,
      defaultPageSize: 10,
      pageSize: 10,
      size: 'default',
      pageSizeOptions: [10, 20, 50, 100],
    },

  },
  reducers: {
    showLoading(state) {
      return { ...state, loading: true };
    },
    hideLoading(state) {
      return { ...state, loading: false };
    },
    queryUpdate(state, action) {
      const payloadArray = action.payload;
      const allPayloadArray = state.searchList;
      allPayloadArray[action.updateType] = payloadArray;
      return { ...state, searchList: allPayloadArray, loading: false };
    },
    querySuccess(state, action) { return { ...state, ...action.payload, loading: false }; },
    updateData(state, action) { return { ...state, ...action.payload }; } },
  effects: {
    * queryOrg({ payload }, { call, put }) { // 请求总机构
      yield put({ type: 'showLoading' });
      const data = yield call(queryOrg, parse(payload));
      if (data.data && data.data.success) {
        // console.log("data=",data);
        const aclStoreList = data.data.data.aclStoreList;
        const storeIdConst = aclStoreList[0].id;
        yield put({
          type: 'querySuccess',
          payload: {
            storeList: data.data.data.aclStoreList,
          },
        });
        // 如果List长度为1，直接搜索出列表
        if (aclStoreList.length === 1) {
          yield put({
            type: 'querySuccess',
            payload: {
              storeId: storeIdConst,
            },
          });
          yield put({
            type: 'querySelectArea',
            // 仓库请求
            depotPayload: {
              rows: 10,
              storeId: storeIdConst,
            },
            // 供应商请求
            supplierPayload: {
              rows: 1000,
            },
            // 收货机构请求
            storeNamePayload: {
              orgType: 1,
              distribId: storeIdConst,
            },
          });
          yield put({
            type: 'queryList', // getRequisitionByFilter
            payload: {
              storeId: '',
            },
          });
        }
      } else {
        message.warning(`操作失败，请参考：${data.data.errorInfo}`);
        yield put({ type: 'hideLoading' });
      }
    },
    // 导出出库单
    * queryExport({ payload }, { call }) {
      yield call(queryExport, payload);
    },
    // 一次获取全部的 搜索框信息
    * querySelectArea({ depotPayload, supplierPayload, storeNamePayload }, { call, put }) {
      yield put({ type: 'showLoading' });
      const depotData = yield call(queryDepot, parse(depotPayload));
      // const supplierData = yield call(querySupplier, parse(supplierPayload));
      const storeData = yield call(queryOrg, parse(storeNamePayload));
      // console.log(storeData);
      if (depotData.data && depotData.data.success) {
        let warehouse;
        if (depotData.data.data.page.data.length === 1) {
          warehouse = depotData.data.data.page.data[0].id;
        }
        yield put({
          type: 'querySuccess',
          payload: {
            searchList: {
              orderStateList: [{
                id: 968,
                statsName: '待出库',
              }, {
                id: 969,
                statsName: '部分出库',
              }, {
                id: 962,
                statsName: '已出库',
              },
              ],
              warehouseList: depotData.data.data.page.data,
              // supplierList: supplierData.data.data.page.data,
              warehouseId: warehouse, // 仓库id
              orderStateId: '',  // 订单状态id
            // 订单List
              supplierId: '',
              sendFilterDataRange: [moment().subtract(15, 'days'), moment()], // 提交日期
              outilterDataRange: [], // 出库日期
              inOrg: '', // 收货机构
              inOrgList: storeData.data.data.aclStoreList,
              distributionOrderId: '',  // 配送订单号
            },
          },
        });
      } else {
        message.warning(`操作失败，请参考：${depotData.data.errorInfo}`);
        yield put({ type: 'hideLoading' });
      }
    },
     // ********************************
    // list 页面
    // ********************************
    * addNewList({ payload }, { put }) { // 新增采购订单跳转
      const path = `/stock/stockOutDistribution/details/edit/${payload.storeId}/${payload.id}/${payload.status}`;
      yield put(routerRedux.push(path));
    },
    * queryList({ payload }, { select, call, put }) {
      yield put({ type: 'showLoading' });
      const searchListArray = yield select(state => state.stockOutDistribution.searchList);
      console.log(searchListArray.inOrg);
      const storeId = yield select(state => state.stockOutDistribution.storeId);
      // 进行填充
      payload.status = searchListArray.orderStateId;
      payload.distribId = storeId;
      payload.depotId = searchListArray.warehouseId;
      payload.billNo = searchListArray.distributionOrderId;
      payload.submitStartDate = searchListArray.sendFilterDataRange[0];
      payload.submitEndDate = searchListArray.sendFilterDataRange[1];
      payload.outStartDate = searchListArray.outilterDataRange[0];
      payload.outEndDate = searchListArray.outilterDataRange[1];
      if (payload.storeId == null) {
        payload.storeId = searchListArray.inOrg;
      } else {
        payload.storeId = null;
      }
      if (!storeId) {
        yield false;
      }
      // payload.rows = 10; // 获取10条数据
       // console.log(payload);
      const data = yield call(queryOutDistribution, parse(payload));
      // console.log(data.data.data.page);
      //   console.log("得到的数据",data);
      if (data.data && data.data.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            dataQuerySupplyList: data.data.data.page.data,
            pagination: {
              showSizeChanger: true,
              showQuickJumper: true,
              total: data.data.data.page.totalCount,
              current: data.data.data.page.page,
              pageSize: data.data.data.page.limit,
              showTotal: total => `共 ${total} 条`,
            },
          },
        });
      } else {
        const distribId = yield select(state => state.stockOutDistribution.storeId);
        if (distribId) {
          message.warning(`操作失败，请参考：${data.data.errorInfo}`);
          // 填充空的数据 ，否则会导致出错
          yield put({
            type: 'querySuccess',
            payload: {
              dataQuerySupplyList: [],
              pagination: {
                showSizeChanger: true,
                showQuickJumper: true,
                current: 1,
                total: 0,
                pageSize: '10',
                showTotal: '共 0 条',
                pageSizeOptions: [10, 20, 50, 100],
              },
            },
          });
        }
        yield put({ type: 'hideLoading' });
      }
    },
    // ********************************
   // find 页面
   // ********************************
    * queryfind({ payload }, { put }) {
      const path = `/stock/stockOutDistribution/details/view/${payload.storeId}/${payload.id}/${payload.status}`;
      yield put(routerRedux.push(path));
    },
    /**
     * 获取仓库 即时搜索
     */
    * queryStore({ payload }, { call, put, select }) {
      const { storeId } = yield select(state => state.stockOutDistribution);
      const data = yield call(queryOrg, parse(Object.assign(payload, { storeId })));
      // const busiIdAll = yield select(state => state.stockOutDistribution.newCannList);
      // console.log(data);
      if (data.data && data.data.success) {
        const newShopList = data.data.data.aclStoreList;
        const serachArray = [];
        for (let i = 0; i < newShopList.length; i += 1) {
          if (newShopList[i].name.indexOf(payload.queryString) !== -1) {
            serachArray.push(newShopList[i]);
          }
        }
        // console.log(serachArray);
        // newShopList = newShopList.concat(busiIdAll);
        yield put({
          type: 'queryUpdate',
          payload: serachArray,
          updateType: 'inOrgList',
        });
        yield put({
          type: 'querySuccess',
          payload: {
            fetching: false,
          },
        });
      } else {
        message.warning(`操作失败，请参考：${data.data.errorInfo}`);
      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        // 初始化加载操作
        if (location.pathname === '/stock/stockOutDistribution') {
          dispatch({
            type: 'queryOrg',
            payload: { orgType: 2, rows: 10 },
          });
          dispatch({
            type: 'queryList',
            payload: {},
          });
        }
      });
    },
  },
};
