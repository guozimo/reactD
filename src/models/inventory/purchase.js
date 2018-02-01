import { parse } from 'qs';
import { routerRedux } from 'dva/router';
import { message } from 'antd';
import _ from 'lodash';
import moment from 'moment';
import { queryOrg, querySupplier, queryGoodsID, queryWarehouse, queryType, findTreeList } from '../../services/inventory/common';
import { query, queryAddPurchase, queryfind, queryExport } from '../../services/inventory/purchase';

export default {
  namespace: 'purchase',
  state: {
    depotId: '',
    bussDate: moment(new Date()).format('YYYY-MM-DD'),
    remarks: '',
    goodsId: '',
    billNo: '',
    status: '',
    billType: '',
    busiId: '',
    startDate: moment(new Date()).format('YYYY-MM-DD'),
    endDate: moment(new Date()).format('YYYY-MM-DD'),
    depotList: [],
    supplierList: [],
    findList: [],
    warehouseList: [],
    exportModalList: [],
    typeList: [],
    findTreeList: [],
    scmInGoodsList: [],
    selectedRowKeysModal: [],
    cateId: '',
    modalRowIndex: '',
    goodsList: [],
    storeId: '',
    editableMem: [],
    filterDataRange: [moment(), moment()],
    searchAll: {}, // 全部数据
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => `共 ${total} 条`,
      current: 1,
      total: 0,
      size: 'default',
      pageSizeOptions: [10, 20, 50, 100],
    },
    paginationGoods: {
      showTotal: total => `共 ${total} 条`,
      current: 1,
      total: 0,
      size: 'default',
    },
    newData: {
      key: 2,
      id: '',
      goodsId: '',
      goodsCode: '',
      goodsName: '',
      goodsVisible: false,
      goodsSpec: '',
      ordUnitName: '',
      ordUnitId: '',
      ordUnitRates: '',
      tranRates: '',
      ordUnitQty: '',
      unitName: '',
      unitId: '',
      goodsQty: '',
      unitPriceNotax: '',
      goodsAmtNotax: '',
      taxRatio: '',
      goodsTaxAmt: '',
      unitPrice: '',
      goodsAmt: '',
      remarks: '',
      dualUnitId: '',
      dualUnitName: '',
      dualGoodsQty: 0,
    },
    dataSource: [
      {
        key: '1',
        id: '',
        goodsId: '',
        goodsCode: '',
        goodsName: '',
        goodsSpec: '',
        ordUnitName: '',
        ordUnitId: '',
        ordUnitRates: '',
        tranRates: '',
        ordUnitQty: '',
        unitName: '',
        unitId: '',
        goodsQty: '',
        unitPriceNotax: '',
        goodsAmtNotax: '',
        taxRatio: '',
        goodsTaxAmt: '',
        unitPrice: '',
        goodsAmt: '',
        remarks: '',
        dualUnitId: '',
        dualUnitName: '',
        dualGoodsQty: 0,
      },
    ] },
  reducers: {
    showLoading(state) {
      return { ...state, loading: true };
    },
    hideLoading(state) {
      return { ...state, loading: false };
    },
    addCount(state, action) {
      return { ...state, count: action.count };
    },
    addTableSuccess(state, action) { return { ...state, ...action.payload }; },
    updateSelect(state, action) { return { ...state, ...action.payload }; },
    goodsListSuccess(state, action) { return { ...state, ...action.payload }; },
    deleteTable(state, action) { return { ...state, ...action.payload }; },
    editableMemSuccess(state, action) { return { ...state, ...action.payload }; },
    querySuccess(state, action) { return { ...state, ...action.payload, loading: false }; },
    warehouseSuccess(state, action) { return { ...state, ...action.payload, loading: false }; },
    queryTypeSuccess(state, action) { return { ...state, ...action.payload, loading: false }; },
    supplierSuccess(state, action) { return { ...state, ...action.payload, loading: false }; },
  },
  effects: {
    * query({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      // const storeId = payload.storeId;
      const data = yield call(query, parse(payload));
      if (data.data && data.data.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            dataSourceAll: data.data.data.page.data,
            pagination: {
              showSizeChanger: true,
              showQuickJumper: true,
              total: data.data.data.page.totalCount,
              current: data.data.data.page.page,
              showTotal: total => `共 ${total} 条`,
              size: data.data.data.page.limit,
              pageSizeOptions: [10, 20, 50, 100],
            },
          },
        });
      } else {
        message.warning(`操作失败，请参考：${data.data.errorInfo}`);
        yield put({
          type: 'querySuccess',
          payload: {
            dataSourceAll: [],
            pagination: {
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: '共 0 条',
              current: 1,
              total: 0,
              size: '10',
              pageSizeOptions: [10, 20, 50, 100],
            },
          },
        });
      }
    },
    * queryDepot({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      const data = yield call(queryOrg, parse(payload));
      if (data.data && data.data.success) {
        // console.log("queryDepot",data.data.data);
        yield put({
          type: 'querySuccess',
          payload: {
            depotList: data.data.data.aclStoreList,
            weatherList: data.data.data.weatherList,
            eventList: data.data.data.holidaysList,
          },
        });
      } else {
        message.warning(`操作失败，请参考：${data.data.errorInfo}`);
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
    * queryfind({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      const data = yield call(queryfind, parse(payload));
      if (data.data && data.data.success) {
        const path = '/stock/purchase/purchaseFind';
        yield put(routerRedux.push(path));
        yield put({
          type: 'querySuccess',
          payload: {
            findList: data.data.data,
          },
        });
      } else {
        message.warning(`操作失败，请参考：${data.data.errorInfo}`);
        yield put({ type: 'hideLoading' });
      }
    },
    * queryGoodsCoding({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      const data = yield call(queryGoodsID, parse(payload));
      if (data.data && data.data.success) {
        yield put({
          type: 'goodsListSuccess',
          payload: {
            goodsList: data.data.data.data,
          },
        });
      } else {
        message.warning(`操作失败，请参考：${data.data.errorInfo}`);
        yield put({ type: 'hideLoading' });
      }
    },
    * queryExport({ payload }, { call }) {
      yield call(queryExport, payload);
    },
    * exportModalListAll({ payload }, { put, select }) {
      const newArrayAll = yield select(state => state.purchase.dataSource);
      const newValue = yield select(state => state.purchase.exportModalList);
      const modalRowIndex = yield select(state => state.purchase.modalRowIndex);
      newArrayAll.splice(Number(modalRowIndex) - 1, 1, ...newValue);
      // console.log("000000000000000newArrayAll",newArrayAll);
      newArrayAll.map((item, i) => {
        Object.assign(item, { key: i + 1 });
        return item;
      });
      yield put({
        type: 'purchase/querySuccess',
        payload: {
          dataSource: newArrayAll,
        },
      });
      yield put({
        type: 'purchase/editableMem',
        payload: { dataSource: [] },
      });
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
    * findScmInGoods({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      const data = yield call(queryGoodsID, parse(payload));
      if (data.data && data.data.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            scmInGoodsList: data.data.data.data,
            paginationGoods: {
              total: data.data.data.totalCount,
              current: data.data.data.page,
              showTotal: total => `共 ${total} 条`,
            },
          },
        });
      } else {
        message.warning(`操作失败，请参考：${data.data.errorInfo}`);
        yield put({ type: 'hideLoading' });
      }
    },
    * findTreeList({ payload }, { call, put, select }) {
      const depotId = yield select(state => state.purchase.depotId);
      const storeId = yield select(state => state.purchase.storeId);
      yield put({ type: 'showLoading' });
      const data = yield call(findTreeList, parse(payload));
      if (data.data && data.data.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            findTreeList: data.data.data,
          },
        });
        yield put({
          type: 'findScmInGoods',
          payload: {
            depotId,
            storeId,
            limit: '20',
            status: '1',
            queryString: '',
          },
        });
      } else {
        message.warning(`操作失败，请参考：${data.data.errorInfo}`);
        yield put({ type: 'hideLoading' });
      }
    },
    * updateEditableMem({ payload }, { put, select }) {
      const stateMem = yield select(state => state.purchase.editableMem);
      const dataSource = yield select(state => state.purchase.dataSource);
      const fieldMem = payload.targetField;
      const rowIndex = payload.index;
      if (rowIndex + 1 > dataSource.length) {
        yield put({
          type: 'addTable',
          payload: {
            rowindex: rowIndex,
          },
        });
        yield put({
          type: 'editableMem',
          payload: { dataSource: [] },
        });
      }
      stateMem.map((item, index) => {
        if (rowIndex === index) {
          const memKeys = Object.keys(item);
          const newItem = item;
          memKeys.map((keyItem) => {
            if (keyItem === fieldMem) {
              newItem[keyItem] = true;
            } else {
              newItem[keyItem] = false;
            }
            return newItem;
          });
        }
        return stateMem;
      });
      yield put({ type: 'editableMemSuccess', payload: { editableMem: stateMem } });
    },
    * editableMem({ payload }, { put, select }) {
      const data = yield select(state => state.purchase.dataSource);
      const editableMemData = Array(data.length);
      for (let i = 0; i < data.length; i += 1) {
        editableMemData[i] = _.cloneDeep({});
      }
      yield put({ type: 'editableMemSuccess', payload: { editableMem: editableMemData } });
    },
    * addTable({ payload }, { put, select }) {
      let newData = yield select(state => state.purchase.newData);
      const dataSource = yield select(state => state.purchase.dataSource);
      newData = Object.assign({}, newData, { key: dataSource.length + 1 });
      yield put({
        type: 'addTableSuccess',
        payload: { dataSource: [...dataSource, newData] },
      });
    },
    * addNewList({ payload }, { put }) {
      // let newData = yield select(state => state.purchase.newData);
      // // console.log("----------newData",[newData])
      // // yield put({
      // //   type: 'queryTypeSuccess',
      // //   payload: {
      // //     dataSource:[newData]
      // //   },
      // // });
      const path = '/stock/purchase/purchaseAddNew';
      yield put(routerRedux.push(path));
    },
    * cancelAll({ payload }, { put }) {
      const path = '/stock/purchase';
      yield put(routerRedux.push(path));
    },
    * addNewsave({ payload }, { put, call, select }) {
      const data = yield call(queryAddPurchase, payload);
      const storeId = yield select(state => state.purchase.storeId);
      if (data.data && data.data.success) {
        message.success('新增成功');
        const path = '/stock/purchase';
        yield put(routerRedux.push(path));
        yield put({
          type: 'query',
          payload: {
            storeId,
          },
        });
      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/stock/purchase') {
          dispatch({
            type: 'queryDepot',
            payload: { orgType: 1, rows: 10 },
          });
          dispatch({
            type: 'editableMem',
            payload: { dataSource: [] },
          });
        }
        if (location.pathname === '/stock/purchase/purchaseAddNew') {
          dispatch({
            type: 'editableMem',
            payload: { dataSource: [] },
          });
          dispatch({
            type: 'findTreeList',
            payload: { type: 0 },
          });
        }
      });
    },
  },
};
