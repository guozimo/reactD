import { parse } from 'qs';
import { message } from 'antd';
import { routerRedux } from 'dva/router';
import _ from 'lodash';
import moment from 'moment';
import { queryGoodsID, findTreeList, queryDepot } from '../../services/inventory/common';
import { query, findAclStoreForPage, addForm, updateForm, addScmTransfer, updScmTransfer, delScmTransfer } from '../../services/inventory/allotManage';
// import { query, findAclStoreForPage, addForm, addScmTransfer, updateForm, updScmTransfer, delScmTransfer } from '../../services/inventory/allotManage';

export default {
  namespace: 'allotManage',
  state: {
    aclStoreListAll: [], // 全部机构
    storeId: '', // 机构id
    loading: false,
    typeList: [{ // 类型
      key: '1',
      name: 'John Brown',
      age: 32,
    }],
    dataList: [],
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => `共 ${total} 条`,
      current: 1,
      total: 0,
      size: 'default',
      pageSizeOptions: [10, 20, 50, 100],
    },
    editableMem: [], // 新增编辑页数组
    goodsList: [],
    newData: {
      key: 2,
      id: '',
      goodsId: '',
      taxRatio: '',
      unitPriceNotax: '',
      wareQty: '',
      goodsQty: '',
      goodsAmtNotax: '',
      goodsCode: '',
      goodsName: '',
      goodsSpec: '',
      unitId: '',
      unitName: '',
      unitNum: '',
      unitPrice: '',
      goodsAmt: '',
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
      remarks: '',
    }],
    dataSource: [
      {
        key: '1',
        id: '',
        goodsId: '',
        taxRatio: '',
        unitPriceNotax: '',
        wareQty: '',
        goodsQty: '',
        goodsAmtNotax: '',
        goodsCode: '',
        goodsName: '',
        goodsSpec: '',
        unitId: '',
        unitName: '',
        unitNum: '',
        unitPrice: '',
        goodsAmt: '',
        remarks: '',
      },
    ],
    outDepotId: '', // 调出仓库ID
    inDepotId: '', // 调入仓库ID
    outNewDepotId: '', // 调出仓库ID
    inNewDepotId: '', // 调入仓库ID
    bussDate: moment(new Date()).format('YYYY-MM-DD'), // 业务日期
    remarks: '', // 备注
    status: '1', // 类型
    findTreeList: [], // 编辑弹框物资类别
    scmInGoodsList: [], // 编辑弹框物资全部
    cateId: '', // 编辑弹框搜索id
    depotList: [], // 出入库
    paginationGoods: { // 物资分类分页
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => `共 ${total} 条`,
      current: 1,
      total: 0,
      size: 'default',
      pageSizeOptions: [10, 20, 50, 100],
    },
    allotTime: '', // 调拨时间
    goodsVisible: false,
    dataAll: [],
    dataSourceIndex: 1,
  },
  reducers: {
    showLoading(state) {
      return { ...state, loading: true };
    },
    hideLoading(state) {
      return { ...state, loading: false };
    },
    deleteTable(state, action) { return { ...state, ...action.payload }; },
    querySuccess(state, action) { return { ...state, ...action.payload, loading: false }; } },
  effects: {
    * addScmDirectManual({ payload }, { call, put, select }) { // 新增保存数据
      yield put({ type: 'showLoading' });
      const dataSourceNew = yield select(state => state.allotManage.dataSourceNew);
      const storeId = yield select(state => state.allotManage.storeId);
      const newUpdate = yield select(state => state.allotManage.update);
      // yield put({
      //   type: 'dataSourceSuccess',
      //   payload: {
      //     dataSource: [],
      //   },addScmTransfer, updateForm, updScmTransfer
      // })
      const data = yield call(newUpdate ? updScmTransfer : addScmTransfer, parse(payload));
      if (data.data && data.data.success) {
        message.info('操作成功!');
        const path = '/stock/allotManage';
        yield put(routerRedux.push(path));
        yield put({
          type: 'query',
          payload: {
            storeId,
            rows: '10',
          },
        });
        yield put({
          type: 'querySuccess',
          payload: {
            dataSource: _.cloneDeep(dataSourceNew),
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
    * cancelAll({ payload }, { put }) { // 返回首页
      const path = '/stock/allotManage';
      yield put(routerRedux.push(path));
    },
    * query({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      const data = yield call(query, parse(payload));
      if (data.data && data.data.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            dataList: data.data.data.page.data,
            pagination: {
              showSizeChanger: true,
              showQuickJumper: true,
              total: data.data.data.page.totalCount,
              current: data.data.data.page.page,
              showTotal: total => `共 ${total} 条`,
              pageSizeOptions: [10, 20, 50, 100],
            },
          },
        });
      } else {
        message.warning(`操作失败，请参考：${data.data.errorInfo}`);
        yield put({ type: 'hideLoading' });
      }
    },
    * queryDepot({ payload }, { call, put }) {
      // console.warn("");
      yield put({ type: 'showLoading' });
      const data = yield call(queryDepot, parse(payload));
      if (data.data && data.data.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            depotList: data.data.data.page.data,
            // weatherList: data.data.data.aclStoreList,
            // eventList: data.data.data.holidaysList,
          },
        });
      } else {
        message.warning(`操作失败，请参考：${data.data.errorInfo}`);
        yield put({ type: 'hideLoading' });
      }
    },
    * onDelete({ payload }, { call, put, select }) {
      yield put({ type: 'showLoading' });
      const data = yield call(delScmTransfer, parse(payload));
      const storeId = yield select(state => state.allotManage.storeId);
      if (data.data && data.data.success) {
        message.success('删除成功');
        // yield put({
        //   type: 'querySuccess',
        //   payload: {
        //     depotList: data.data.data.page.data,
        //     // weatherList: data.data.data.aclStoreList,
        //     // eventList: data.data.data.holidaysList,
        //   },
        // });
        yield put({
          type: 'query',
          payload: {
            rows: 10,
            storeId,
          },
        });
      } else {
        message.warning(`操作失败，请参考：${data.data.errorInfo}`);
        yield put({ type: 'hideLoading' });
      }
    },
    * update({ payload }, { call, put, select }) {
      const data = yield call(updateForm, parse(payload));
      const path = '/stock/allotManage/allotManageAddNew';
      yield put(routerRedux.push(path));
      yield put({ type: 'showLoading' });
      const storeId = yield select(state => state.allotManage.storeId);
      if (data.data && data.data.success) {
        if (data.data.data.detailList.length !== 0) {
          const scmList = _.cloneDeep(data.data.data.detailList);
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
            const ordPriceNotax = (ordPrice ? (ordPrice / (1 + Number(rowItem.taxRatio))) : 0);
            // goodsAmtNotax 不含税金额 公式：不含税金额 = 不含税单价(ordPriceNotax)*采购数量(ordUnitNum)
            const goodsAmtNotax = (rowItem.ordUnitNum ? (rowItem.ordUnitNum * ordPriceNotax).toFixed(2) : 0);
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
            const newSourceItem = Object.assign({}, rowItem, { ordPriceNotax, goodsAmtNotax, ordPrice, key: index + 1 });
            updateDataSource.push(newSourceItem);
            return updateDataSource;
          });
          // console.warn("-----------updateDataSource",updateDataSource);
          yield put({
            type: 'querySuccess',
            payload: {
              dataSourceIndex: updateDataSource.length,
              dataSource: updateDataSource,
              outDepotId: data.data.data.outDepotId, // 调出仓库ID
              inDepotId: data.data.data.inDepotId, // 调入仓库ID
              bussDate: data.data.data.bussDate, // 业务日期
              remarks: data.data.data.remarks, // 备注
              dataAll: data.data.data,
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
          yield put({
            type: 'addDepotId',
            payload: { orgType: 1, rows: 10, distribId: storeId },
          });
        } else {
          message.error('数据返回数组为空，请检查！');
        }
      } else {
        message.warning(`操作失败，请参考：${data.data.errorInfo}`);
        yield put({ type: 'hideLoading' });
      }
    },
    * onAddSelect({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      const data = yield call(addForm, parse(payload));
      if (data.data && data.data.success) {
        // console.log("---------data.data.",data.data)
        yield put({
          type: 'querySuccess',
          payload: {
            allotTime: data.data.data.page.data,
            // weatherList: data.data.data.aclStoreList,
            // eventList: data.data.data.holidaysList,
          },
        });
      } else {
        message.warning(`操作失败，请参考：${data.data.errorInfo}`);
        yield put({ type: 'hideLoading' });
      }
    },
    * addNewList({ payload }, { put }) { // 新增采购订单跳转
      const path = '/stock/allotManage/allotManageAddNew';
      yield put(routerRedux.push(path));
    },
    * findAclStoreForPage({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      const data = yield call(findAclStoreForPage, parse(payload));
      if (data.data && data.data.success) {
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
    * editableMem({ payload }, { put, select }) { // 初始化数据
      const data = yield select(state => state.allotManage.dataSource);
      const editableMemData = Array(data.length);
      for (let i = 0; i < data.length; i += 1) {
        editableMemData[i] = _.cloneDeep({});
      }

      yield put({ type: 'querySuccess', payload: { editableMem: editableMemData } });
    },
    * updateEditableMem({ payload }, { put, select }) { // 回车跳转新的边框
      const stateMem = yield select(state => state.allotManage.editableMem);
      const dataSource = yield select(state => state.allotManage.dataSource);
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
    * findTreeList({ payload }, { call, put }) { // 查找物资类别
      // const depotId = yield select(state => state.allotManage.depotId);
      // const storeId = yield select(state => state.allotManage.storeId);
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
    * addTable({ payload }, { put, select }) { // 新增一行
      let newData = yield select(state => state.allotManage.newData);
      const dataSource = yield select(state => state.allotManage.dataSource);
      newData = Object.assign({}, newData, { key: dataSource.length + 1 });
      yield put({
        type: 'querySuccess',
        payload: { dataSource: [...dataSource, newData] },
      });
    },
    * exportModalListAll({ payload }, { put, select }) { // 选择全部数据
      const newArrayAll = yield select(state => state.allotManage.dataSource);
      const newValue = payload.newValue;
      const modalRowIndex = yield select(state => state.allotManage.modalRowIndex);
      newArrayAll.splice(Number(modalRowIndex) - 1, 1, ...newValue);
      // console.log("000000000000000newArrayAll",newArrayAll);
      newArrayAll.map((item, i) => {
        Object.assign(item, { key: i + 1 });
        return item;
      });
      yield put({
        type: 'allotManage/querySuccess',
        payload: {
          dataSource: newArrayAll,
        },
      });
      yield put({
        type: 'allotManage/editableMem',
        payload: { dataSource: [] },
      });
    },
  },
  subscriptions: {
    // setup({ dispatch, history }) {
    //   history.listen((location) => {
    //         // console.log("我是测试------------location",location)
    //     if (location.pathname === '/stock/allotManage') {
    //       // console.log("...location.query",location)
          // dispatch({
          //   type: 'findAclStoreForPage',
          //   payload: { orgType: 2, rows: 10 },
          // });
          // dispatch({
          //   type: 'editableMem',
          //   payload: { dataSource: [] },
          // });
          // dispatch({
          //   type: 'query',
          //   payload: { row: 10 },
          // });
        // }
        // if (location.pathname === '/stock/allotManage/allotManageAddNew') {
        //   // console.log("我是测试看看进来了吗",location)
          // dispatch({
          //   type: 'findAclStoreForPage',
          //   payload: { orgType: 2, rows: 10 },
          // });
          // dispatch({
          //   type: 'editableMem',
          //   payload: { dataSource: [] },
          // });
    //     }
    //   });
    // },
  },
};
