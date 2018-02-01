import { parse } from 'qs';
import { message } from 'antd';
import { routerRedux } from 'dva/router';
import _ from 'lodash';
import pathToRegexp from 'path-to-regexp';
import moment from 'moment';
import { queryGoodsID, findTreeList, querySupplier, queryOrg } from '../../services/inventory/common';
import { querySupplyList, update, findAclStoreForPage, closeScmDirect, updateScmDirectManual, queryExport, addScmDirectManual } from '../../services/inventory/supplyOrder';

export default {
  namespace: 'supplyOrder',
  state: {
    aclStoreListAll: [], // 全部机构
    storeList: [], // 仓库列表
    newValueStore: [], // 仓库搜索需要增加的列表
    storeId: '', // 机构id
    storeListId: '',
    distribId: '', // 机构id
    filterDataRange: [moment().subtract(15, 'days'), moment()], // 采购日期
    arrivalDate: moment(new Date()).format('YYYY-MM-DD'),
    loading: false,
    typeList: [{ // 类型
      key: '1',
      name: 'John Brown',
      age: 32,
    }],
    status: '', // 类型
    listStatus: '',
    supplyListPage: { page: 1, rows: 10 }, // 首页的选择的页数和
    dataQuerySupplyList: [], // 返回全部数据
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => `共 ${total} 条`,
      current: 1,
      total: 0,
      pageSize: 10,
      size: 'default',
      pageSizeOptions: [10, 20, 50, 100],
    },
    paginationGoods: { // 物资分类分页
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => `共 ${total} 条`,
      current: 1,
      total: 0,
      size: 'small',
      pageSizeOptions: [10, 20, 50, 100],
    },
    editableMem: [], // 新增编辑页数组
    goodsList: [],
    newData: {
      key: 2,
      id: '',
      storeId: '',
      goodsId: '',
      goodsCode: '',
      goodsName: '',
      goodsSpec: '',
      unitId: '',
      unitName: '',
      unitNum: '',
      ordUnitId: '',
      ordUnitName: '',
      ordUnitNum: '',
      ordAdjustNum: '',
      dualUnitId: '',
      dualUnitName: '',
      dualUnitNum: '',
      ordPrice: '',
      ordPriceNotax: '',
      taxRatio: '',
      goodsAmt: '',
      goodsAmtNotax: '',
      purcUnitId: '',
      purcUnitName: '',
      purcUnitRates: '',
      ordUnitRates: '',
      remarks: '',
    },
    dataSourceNew: [{
      key: 1,
      id: '',
      storeId: '',
      goodsId: '',
      goodsCode: '',
      goodsName: '',
      goodsSpec: '',
      unitId: '',
      unitName: '',
      unitNum: '',
      ordUnitId: '',
      ordUnitName: '',
      ordUnitNum: '',
      ordAdjustNum: '',
      dualUnitId: '',
      dualUnitName: '',
      dualUnitNum: '',
      ordPrice: '',
      ordPriceNotax: '',
      taxRatio: '',
      goodsAmt: '',
      goodsAmtNotax: '',
      purcUnitId: '',
      purcUnitName: '',
      purcUnitRates: '',
      ordUnitRates: '',
      remarks: '',
    }],
    dataSource: [{
      key: 1,
      id: '',
      storeId: '',
      goodsId: '',
      goodsCode: '',
      goodsName: '',
      goodsSpec: '',
      unitId: '',
      unitName: '',
      unitNum: '',
      ordUnitId: '',
      ordUnitName: '',
      ordUnitNum: '',
      ordAdjustNum: '',
      dualUnitId: '',
      dualUnitName: '',
      dualUnitNum: '',
      ordPrice: '',
      ordPriceNotax: '',
      taxRatio: '',
      goodsAmt: '',
      goodsAmtNotax: '',
      purcUnitId: '',
      purcUnitName: '',
      purcUnitRates: '',
      ordUnitRates: '',
      remarks: '',
    }],
    bussDate: moment(new Date()).format('YYYY-MM-DD'), // 订单日期
    storeAddId: '', // 收货机构id
    busiId: '', // 供应商id
    remarks: '', // 备注
    busiList: [{
      id: '6b97c0bb-1975-4933-a929-18cca9efbe36',
      name: '测试供应商',
      code: '0001',
    }], // 备注
    findList: [], // 查看数据
    closeUpdate: false, // 关闭订单
    goodsVisible: false, // 打开弹窗
    modalRowIndex: '', // 编辑框当前条数
    cateId: '', // 编辑弹框搜索id
    findTreeList: [], // 编辑弹框物资类别
    scmInGoodsList: [], // 编辑弹框物资全部
    selectedRowKeysModal: [], // 物资弹窗选中
    exportModalList: [], // 物资弹窗要插入的数据
    dataAll: { id: '' }, // 编辑时返回全部
    update: false, // 新增还是编辑
    billListNo: '', // 首页编码
    billNo: '', // 采购订单
    searchAll: {}, // 采购订单
    supplierList: [], // 供应商数组
    busiListId: '', // 供应商数组
    newValueShop: [], // 供应商数组
    fetching: false,
    dataSourceIndex: [], // 判断编辑的时候有几条数据
    addDepotIdList: [], // 门店仓库
    newDisableSource: [], // 禁用
    delIdsList: [], // 删除数据
    modalSelectValue: '', // 数据量
  },
  reducers: {
    showLoading(state) {
      return { ...state, loading: true };
    },
    hideLoading(state) {
      return { ...state, loading: false };
    },
    updateFilterDataRange(state, action) {
      return { ...state, filterDataRange: action.filterDataRange };
    },
    deleteTable(state, action) { return { ...state, ...action.payload }; },
    dataSourceSuccess(state, action) { return { ...state, dataSource: action.dataSource }; },
    querySuccess(state, action) { return { ...state, ...action.payload, loading: false }; } },
  effects: {
    * findScmInGoods({ payload }, { call, put }) { // 查找全部物资
      // console.log("我是全部物资");
      yield put({ type: 'showLoading' });
      const data = yield call(queryGoodsID, parse(payload));
      if (data.data && data.data.success) {
        // console.log("我是全部物资",data.data);
        yield put({
          type: 'querySuccess',
          payload: {
            scmInGoodsList: data.data.data.data,
            paginationGoods: {
              showSizeChanger: true,
              showQuickJumper: true,
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
    * queryExport({ payload }, { call }) {
      yield call(queryExport, payload);
    },
    * querySupplier({ payload }, { call, put, select }) {
      yield put({ type: 'showLoading' });
      const data = yield call(querySupplier, parse(payload));
      const busiIdAll = yield select(state => state.supplyOrder.newValueShop);
      // const valueShop = yield select(state => state.supplyRelation.valueShop);
      if (data.data && data.data.success) {
        let newShopList = data.data.data.page.data;
        // console.log("busiIdAll",busiIdAll);
        // console.log("newShopList",newShopList);
        if (!payload.isUpdate && busiIdAll.length) {
          newShopList = newShopList.concat(busiIdAll);
        }
        // console.log("newShopListnewShopListnewShopList",newShopList);
        // newShopList = newShopList.concat(busiIdAll);
        // newShopList = _.uniqBy(newShopList, 'id');
        yield put({
          type: 'querySuccess',
          payload: {
            fetching: false,
            supplierList: newShopList,
          },
        });
      } else {
        message.warning(`操作失败，请参考：${data.data.errorInfo}`);
        yield put({ type: 'hideLoading' });
      }
    },
    * querySupplyList({ payload }, { select, call, put }) {
      // console.warn("我试试进来了吗")
      yield put({ type: 'showLoading' });
      const data = yield call(querySupplyList, parse(payload));
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
              pageSizeOptions: [10, 20, 50, 100],
            },
          },
        });
        yield put({ type: 'hideLoading' });
      } else {
        const distribId = yield select(state => state.supplyOrder.distribId);
        if (distribId) {
          message.warning(`操作失败，请参考：${data.data.errorInfo}`);
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
    * queryOrgList({ payload }, { call, put, select }) { // 请求仓库
      // console.warn("我试试进来了吗")
      yield put({ type: 'showLoading' });
      const newValueStoreList = yield select(state => state.supplyOrder.newValueStore);
      const data = yield call(queryOrg, parse(payload));
      if (data.data && data.data.success) {
        let newShopList = data.data.data.aclStoreList;
        // console.log("busiIdAll",busiIdAll);
        // console.log("newShopList",newShopList);
        if (!payload.updateDistribId && newValueStoreList.length) {
          newShopList = newShopList.concat(newValueStoreList);
        }
        yield put({
          type: 'querySuccess',
          payload: {
            fetchingStore: false,
            storeList: newShopList,
          },
        });
      } else {
        message.warning(`操作失败，请参考：${data.data.errorInfo}`);
        yield put({ type: 'hideLoading' });
      }
    },
    * querySupplyListUpdate({ payload }, { put, select }) {
      // console.warn("我试试进来了吗")
      // const storeId = yield select(state => state.supplyOrder.storeId);
      const { distribId, billListNo, pagination, busiListId, storeListId, listStatus, filterDataRange } = yield select(state => state.supplyOrder);
      const pageNo = payload.pageNo || pagination.current;
      const pageSize = payload.pageSize || pagination.pageSize;
      // const bussDate = yield select(state => state.supplyOrder.bussDate);
      yield put({
        type: 'querySupplyList',
        payload: {
          // storeId
          distribId,
          billNo: billListNo,
          busiId: busiListId,
          storeId: storeListId,
          status: listStatus,
          startDate: filterDataRange[0].format('YYYY-MM-DD'),
          endDate: filterDataRange[1].format('YYYY-MM-DD'),
          page: pageNo,
          rows: pageSize,
          // page: pagination.current,
        },
      });
    },
    * setFilterDataRange({ payload }, { put }) { // 设置搜索时间范围
      yield put({
        type: 'updateFilterDataRange',
        filterDataRange: payload.filterDataRange,
      });
    },
    * update({ payload }, { call, put }) {
      const data = yield call(update, parse(payload));
      // const path = '/stock/supplyOrder/supplyOrderAddNew';
      // yield put(routerRedux.push(path));
      yield put({ type: 'showLoading' });
      // const storeId = yield select(state => state.supplyOrder.storeId);
      if (data.data && data.data.success) {
        if (data.data.data.scmDirectDetailList.length !== 0) {
          const scmList = _.cloneDeep(data.data.data.scmDirectDetailList);
          const updateDataSource = [];
          scmList.map((rowItem, index) => {
            // console.warn("rowItem",rowItem);
            // ordAdjustNum 调整数量 公式：调整数量 = 采购数量
            // const ordAdjustNum = rowItem.ordUnitNum ? rowItem.ordUnitNum : rowItem.ordAdjustNum;
            // unitNum 标准数量 公式：标准数量 = 采购数量(ordUnitNum)/采购转换率(ordUnitRates)
            // const unitNum = (rowItem.ordUnitNum ? (rowItem.ordUnitNum / (rowItem.ordUnitRates || 1)).toFixed(2) : 0);
            // 判断采购单价(ordPrice)初始化取值
            // const ordPrice = rowItem.ordPrice ? rowItem.ordPrice : (rowItem.lastPrice ? rowItem.lastPrice : rowItem.goodsPrice);
            let ordPrice = '';
            if (rowItem.ordPrice) {
              ordPrice = rowItem.ordPrice;
            } else if (rowItem.lastPrice) {
              ordPrice = rowItem.lastPrice;
            } else {
              ordPrice = rowItem.goodsPrice;
            }
            // goodsAmt 采购金额 公式：采购金额 = 采购数量(ordUnitNum)*采购单价(ordPrice)
            // const goodsAmt = rowItem.ordUnitNum ? rowItem.ordUnitNum * (rowItem.ordUnitRates || 1) : 0;
              // ordPriceNotax 不含税单价 公式：不含税单价 = 采购单价(ordPrice)/(1+税率(taxRatio))
            // const ordPriceNotax = ordPrice ? (ordPrice / (1 + Number(rowItem.taxRatio))).toFixed(2) : 0;
            // const ordPriceNotax = (ordPrice ? (ordPrice / (1 + Number(rowItem.taxRatio))) : 0);
            // goodsAmtNotax 不含税金额 公式：不含税金额 = 不含税单价(ordPriceNotax)*采购数量(ordUnitNum)
            // const goodsAmtNotax = (rowItem.ordUnitNum ? (rowItem.ordUnitNum * ordPriceNotax).toFixed(2) : 0);
          //   console.log(
          //     " ordUnitNum 采购数量 ", rowItem.ordUnitNum,
          //     " ordAdjustNum 调整数量 ordUnitNum",ordAdjustNum,
          //     " rowItem.ordUnitRates 采购转换率",rowItem.ordUnitRates, rowItem.ordUnitRates || 1,
          //     " unitNum 标准数量 ",unitNum,
          //     " 判断采购单价(ordPrice)初始化取值",ordPrice,
          //     " goodsAmt 采购金额 ",goodsAmt,
          //     " ordPriceNotax 不含税单价 ",ordAdjustNum,
          //     " goodsAmtNotax 不含税金额 ",goodsAmtNotax,
          // )
            const newSourceItem = Object.assign({}, rowItem, { ordPrice, key: index + 1 });
            updateDataSource.push(newSourceItem);
            return updateDataSource;
          });
          // console.warn("-----------data.data.data.arrivalDate",data.data.data.arrivalDate, moment(data.data.data.arrivalDate));
          yield put({
            type: 'querySuccess',
            payload: {
              dataSource: updateDataSource,
              dataAll: data.data.data,
              bussDate: data.data.data.bussDate,
              storeAddId: data.data.data.storeId,
              busiId: data.data.data.busiId,
              remarks: data.data.data.remarks,
              billNo: data.data.data.billNo,
              arrivalDate: data.data.data.arrivalDate || moment(new Date()).format('YYYY-MM-DD'),
              dataSourceIndex: _.cloneDeep(updateDataSource),
            },
          });
          yield put({
            type: 'editableMem',
            payload: { dataSource: [] },
          });
          // dispatch({
          //   type: 'findAclStoreForPage',
          //   payload: { orgType: 2, rows: 10 },
          // });
          // yield put({
          //   type: 'addDepotId',
          //   payload: { orgType: 1, rows: 10, distribId: storeId },
          // });
        } else {
          message.error('数据返回数组为空，请检查！');
        }
      } else {
        message.warning(`操作失败，请参考：${data.data.errorInfo}`);
        yield put({ type: 'hideLoading' });
      }
    },
    * closeScmDirect({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      const data = yield call(closeScmDirect, parse(payload));
      if (data.data && data.data.success) {
        yield put({
          type: 'querySuccess',
          payload: { closeUpdate: false },
        });
        const path = '/stock/supplyOrder';
        yield put(routerRedux.push(path));
        // yield put({
        //   type: 'querySuccess',
        //   payload: {
        //     dataSource: data.data.data.scmDirectDetailList,
        //   },
        // });
      } else {
        message.warning(`操作失败，请参考：${data.data.errorInfo}`);
        yield put({ type: 'hideLoading' });
      }
    },
    * queryfind({ payload }, { put }) {
      const timeId = moment().valueOf();
      const path = `/stock/supplyOrder/supplyOrderFind/${timeId}`;
      yield put(routerRedux.push(path));
      const supplyOrderFind = {
        findId: payload.id,
        distribId: payload.distribId,
      };
      window.sessionStorage.setItem(`supplyOrderFind_${timeId}`, JSON.stringify(supplyOrderFind));
    },
    * queryfindUpdate({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      const data = yield call(update, parse(payload));
      if (data.data && data.data.success) {
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
    * addScmDirectManual({ payload }, { call, put, select }) {
      yield put({ type: 'showLoading' });
      const dataSourceNew = yield select(state => state.supplyOrder.dataSourceNew);
      const newUpdate = yield select(state => state.supplyOrder.update);
      // yield put({
      //   type: 'dataSourceSuccess',
      //   payload: {
      //     dataSource: [],
      //   },
      // })
      const data = yield call(newUpdate ? updateScmDirectManual : addScmDirectManual, parse(payload));
      if (data.data && data.data.success) {
        message.info('操作成功!');
        const path = '/stock/supplyOrder';
        yield put(routerRedux.push(path));
        yield put({
          type: 'querySuccess',
          payload: {
            dataSource: _.cloneDeep(dataSourceNew),
            bussDate: moment(new Date()).format('YYYY-MM-DD'),
            arrivalDate: moment(new Date()).format('YYYY-MM-DD'),
            storeAddId: '',
            busiId: '',
            remarks: '',
            billNo: '',
          },
        });
      } else {
        message.warning(`操作失败，请参考：${data.data.errorInfo}`);
        yield put({ type: 'hideLoading' });
      }
    },
    * addNewList({ payload }, { put }) { // 新增采购订单跳转
      // console.log("payload",payload);
      const timeId = moment().valueOf();
      const path = `/stock/supplyOrder/supplyOrderAddNew/${timeId}`;
      const supplyOrderAll = {
        distribId: payload.distribId,
        update: payload.update,
        supplyId: payload.supplyId,
      };
      window.sessionStorage.setItem(`supplyOrder_${timeId}`, JSON.stringify(supplyOrderAll));
      yield put(routerRedux.push(path));
    },
    * findAclStoreForPage({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      const data = yield call(findAclStoreForPage, parse(payload));
      if (data.data && data.data.success) {
        // console.log("data.data.data.aclStoreList",data.data.data);
        yield put({
          type: 'querySuccess',
          payload: {
            aclStoreListAll: data.data.data.aclStoreList,
          },
        });
      } else {
        message.warning(`操作失败，请参考：${data.data.errorInfo}`);
        yield put({ type: 'hideLoading' });
      }
    },
    * addDepotId({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      const data = yield call(findAclStoreForPage, parse(payload));
      if (data.data && data.data.success) {
        // console.log("data.data.data.aclStoreList",data.data.data);
        yield put({
          type: 'querySuccess',
          payload: {
            addDepotIdList: data.data.data.aclStoreList,
          },
        });
      } else {
        message.warning(`操作失败，请参考：${data.data.errorInfo}`);
        yield put({ type: 'hideLoading' });
      }
    },
    * editableMem({ payload }, { put, select }) { // 初始化数据
      const data = yield select(state => state.supplyOrder.dataSource);
      // console.log("1111111111111111我是测试数据",data,"Array(data.length)",Array(data.length));
      const editableMemData = Array(data.length);
      for (let i = 0; i < data.length; i += 1) {
        // console.warn("11111111111111111i",i,"editableMemData[i]",JSON.stringify(editableMemData[i]),"_.cloneDeep({})", _.cloneDeep({}));
        editableMemData[i] = _.cloneDeep({});
      }
      // console.log("1111111111111111111我是初始化数据", JSON.stringify(editableMemData));
      yield put({ type: 'querySuccess', payload: { editableMem: editableMemData } });
    },
    * updateEditableMem({ payload }, { put, select }) { // 回车跳转新的边框
      const stateMem = yield select(state => state.supplyOrder.editableMem);
      const dataSource = yield select(state => state.supplyOrder.dataSource);
      const fieldMem = payload.targetField;
      const rowIndex = payload.index;
      if (rowIndex + 1 > dataSource.length) {
        yield put({ // 新增一行
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
      // console.log("stateMem",stateMem[0]);
      yield put({ type: 'editableMemSuccess', payload: { editableMem: stateMem } });
    },
    * queryGoodsCoding({ payload }, { call, put }) { // 查找编码数据
      yield put({ type: 'showLoading' });
      const data = yield call(queryGoodsID, parse(payload));
      if (data.data && data.data.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            goodsList: data.data.data.data,
          },
        });
      } else {
        message.warning(`操作失败，请参考：${data.data.errorInfo}`);
        yield put({ type: 'hideLoading' });
      }
    },
    * addTable({ payload }, { put, select }) { // 新增一行
      let newData = yield select(state => state.supplyOrder.newData);
      const dataSource = yield select(state => state.supplyOrder.dataSource);
      newData = Object.assign({}, newData, { key: dataSource.length + 1 });
      yield put({
        type: 'querySuccess',
        payload: { dataSource: [...dataSource, newData] },
      });
    },
    * cancelAll({ payload }, { put }) { // 返回首页
      const path = '/stock/supplyOrder';
      yield put({
        type: 'deleteTable',
        payload: {
          findList: [], // 查看数据
        },
      });
      yield put(routerRedux.push(path));
      yield put({
        type: 'querySuccess',
        payload: { closeUpdate: false },
      });
      // yield put({
      //   type: 'querySupplyList',
      //   payload: {
      //     ...searchAll,
      //     status,
      //
      //    },
      // });
    },
    * findTreeList({ payload }, { call, put }) { // 查找物资类别
      // const depotId = yield select(state => state.supplyOrder.depotId);
      // const storeId = yield select(state => state.supplyOrder.storeId);
      yield put({ type: 'showLoading' });
      const data = yield call(findTreeList, parse(payload));
      if (data.data && data.data.success) {
        // console.log("哈哈哈哈");
        yield put({
          type: 'querySuccess',
          payload: {
            findTreeList: data.data.data,
          },
        });
      } else {
        message.warning(`操作失败，请参考：${data.data.errorInfo}`);
        yield put({ type: 'hideLoading' });
      }
    },
    * exportModalListAll({ payload }, { put, select }) { // 选择全部数据
      const newArrayAll = yield select(state => state.supplyOrder.dataSource);
      const newValue = yield select(state => state.supplyOrder.exportModalList);
      const modalRowIndex = yield select(state => state.supplyOrder.modalRowIndex);
      newArrayAll.splice(Number(modalRowIndex) - 1, 1, ...newValue);
      // console.log("000000000000000newArrayAll",newArrayAll);
      newArrayAll.map((item, i) => {
        Object.assign(item, { key: i + 1 });
        return item;
      });
      // console.warn("newArrayAll", newArrayAll);
      const scmList = _.cloneDeep(newArrayAll);
      const updateDataSource = [];
      scmList.map((rowItem, index) => {
        // console.warn("rowItem",rowItem);
        // ordAdjustNum 调整数量 公式：调整数量 = 采购数量
        // const ordAdjustNum = rowItem.ordUnitNum ? rowItem.ordUnitNum : rowItem.ordAdjustNum;
        // unitNum 标准数量 公式：标准数量 = 采购数量(ordUnitNum)/采购转换率(ordUnitRates)
        const unitNum = (rowItem.ordUnitNum ? (rowItem.ordUnitNum / (rowItem.ordUnitRates || 1)) : 0);
        // 判断采购单价(ordPrice)初始化取值
        // const ordPrice = rowItem.ordPrice ? rowItem.ordPrice : (rowItem.lastPrice ? rowItem.lastPrice : rowItem.goodsPrice);
        let ordPrice = '';
        if (rowItem.ordPrice) {
          ordPrice = rowItem.ordPrice;
        } else if (rowItem.lastPrice) {
          ordPrice = rowItem.lastPrice;
        } else {
          ordPrice = rowItem.goodsPrice;
        }
        // goodsAmt 采购金额 公式：采购金额 = 采购数量(ordUnitNum)*采购单价(ordPrice)
        const goodsAmt = rowItem.ordUnitNum ? rowItem.ordUnitNum * (rowItem.ordUnitRates || 1) : 0;
          // ordPriceNotax 不含税单价 公式：不含税单价 = 采购单价(ordPrice)/(1+税率(taxRatio))
        const ordPriceNotax = ordPrice ? (ordPrice / (1 + Number(rowItem.taxRatio))) : 0;
        // const ordPriceNotax = (ordPrice ? (ordPrice / (1 + Number(rowItem.taxRatio))) : 0);
        // goodsAmtNotax 不含税金额 公式：不含税金额 = 不含税单价(ordPriceNotax)*采购数量(ordUnitNum)
        const goodsAmtNotax = (rowItem.ordUnitNum ? (rowItem.ordUnitNum * ordPriceNotax) : 0);
      //   console.log(
      //     " ordUnitNum 采购数量 ", rowItem.ordUnitNum,
      //     " ordAdjustNum 调整数量 ordUnitNum",ordAdjustNum,
      //     " rowItem.ordUnitRates 采购转换率",rowItem.ordUnitRates, rowItem.ordUnitRates || 1,
      //     " unitNum 标准数量 ",unitNum,
      //     " 判断采购单价(ordPrice)初始化取值",ordPrice,
      //     " goodsAmt 采购金额 ",goodsAmt,
      //     " ordPriceNotax 不含税单价 ",ordAdjustNum,
      //     " goodsAmtNotax 不含税金额 ",goodsAmtNotax,
      // )
        const newSourceItem = Object.assign({}, rowItem, { unitNum, ordPrice, goodsAmt, ordPriceNotax, goodsAmtNotax, key: index + 1 });
        updateDataSource.push(newSourceItem);
        return updateDataSource;
      });
      yield put({
        type: 'supplyOrder/querySuccess',
        payload: {
          dataSource: updateDataSource,
          exportModalList: [],
          cateId: '',
          modalSelectValue: '',
        },
      });
      yield put({
        type: 'supplyOrder/editableMem',
        payload: { dataSource: [] },
      });
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
            // console.log("我是测试------------location",location)
        if (location.pathname === '/stock/supplyOrder') {
          // console.log("...location.query",location)
          // console.log("我看看，我进入了吗")
          dispatch({
            type: 'findAclStoreForPage',
            payload: { orgType: 2, rows: 10 },
          });
          dispatch({
            type: 'querySupplyListUpdate',
            payload: {},
          });
          // dispatch({
          //   type: 'editableMem',
          //   payload: { dataSource: [] },
          // });
        }
        const pathname = location.pathname;
        const reFind = pathToRegexp('/stock/supplyOrder/supplyOrderFind/:storeIdFindKey');
        const matchFind = reFind.exec(pathname);
        // console.warn("matchFind",matchFind);
        if (matchFind) {
          const storeIdFindKey = matchFind[1];
          // console.warn("storeIdFindKey",storeIdFindKey, `supplyOrderFind_${storeIdFindKey}`, window.sessionStorage.getItem(`supplyOrderFind_${storeIdFindKey}`));
          setTimeout(() => {
            let supplyOrderFindAll = window.sessionStorage.getItem(`supplyOrderFind_${storeIdFindKey}`);
            // console.warn("请求的全部的值", JSON.parse(supplyOrderFindAll));
            supplyOrderFindAll = JSON.parse(supplyOrderFindAll);
            if (supplyOrderFindAll) {
              dispatch({
                type: 'queryfindUpdate',
                payload: {
                  id: supplyOrderFindAll.findId,
                },
              });
              dispatch({
                type: 'querySuccess',
                payload: {
                  distribId: supplyOrderFindAll.distribId,
                },
              });
            }
          });
        }
        const re = pathToRegexp('/stock/supplyOrder/supplyOrderAddNew/:storeIdKey');
        const match = re.exec(pathname);
        if (match) {
          const storeIdKey = match[1];
          let supplyOrderAll = window.sessionStorage.getItem(`supplyOrder_${storeIdKey}`);
          // console.warn("请求的全部的值", JSON.parse(supplyOrderAll));
          supplyOrderAll = JSON.parse(supplyOrderAll);
          dispatch({ // 初始化编辑框
            type: 'editableMem',
            payload: { dataSource: [] },
          });
          if (supplyOrderAll) {
            if (supplyOrderAll.update) { // 编辑的时候
              dispatch({
                type: 'update',
                payload: {
                  id: supplyOrderAll.supplyId,
                },
              });
            }
            dispatch({
              type: 'querySuccess',
              payload: {
                update: supplyOrderAll.update,
                distribId: supplyOrderAll.distribId,
              },
            });
            dispatch({ // 获取供应商
              type: 'querySupplier',
              payload: {
                status: 1,
                rows: '1000',
              },
            });
            dispatch({ // 获取收货机构
              type: 'addDepotId',
              payload: { orgType: 1, rows: 10, distribId: supplyOrderAll.distribId },
            });
          }
        }
        // if (location.pathname === '/stock/supplyOrder/supplyOrderAddNew') {
          // console.log("我是测试看看进来了吗",location);
          // dispatch({
          //   type: 'findAclStoreForPage',
          //   payload: { orgType: 2, rows: 10 },
          // });
          // dispatch({
          //   type: 'findScmInGoods',
          //   payload: {
          //     limit: '20',
          //     status: '1',
          //     queryString: '',
          //   },
          // });
          // dispatch({ // 获取供应商
          //   type: 'querySupplier',
          //   payload: {
          //     status: 1,
          //     rows: '1000',
          //   },
          // });
          // dispatch({ // 初始化编辑框
          //   type: 'editableMem',
          //   payload: { dataSource: [] },
          // });
          // dispatch({ // 查找物资类别
          //   type: 'findTreeList',
          //   payload: { type: 0 },
          // });
        // }
      });
    },
  },
};
