import { parse } from 'qs';
import { message } from 'antd';
import pathToRegexp from 'path-to-regexp';
import { routerRedux } from 'dva/router';
import _ from 'lodash';
import moment from 'moment';
import { dispatchOrdersDetailsItemModel } from './_common';
import { queryDetailList, updDispatchOrders } from '../../services/inventory/dispatchOrdersDetails';


const dateFormat = 'YYYY-MM-DD';

export default {
  namespace: 'dispatchOrdersDetailsModule',
  state: {
    loading: false,
    storeId: '', // 机构id
    billId: '', // 出库单id
    orderId: '', // 配送订单id
    pageType: '', // 页面类型，新增、编辑、查看
    goodsList: [],
    detailList: [],
    pageDetail: [],
    editableMem: [],
    currRemarks: '',
    user: {},
    savingStatus: false,
    pageStatus: 0,
    // 表单项
    id: '',
    billType: null,
    busiId: '',
    billInfo: {},
    busiName: '',
    depotId: '',
    monthDate: moment(new Date()).format(dateFormat),
    // 查看 展示项
    billNo: '', // 配送订单号
    distribName: '', // 配送机构
    storeName: '', // 收货机构
    bussDate: moment(new Date()).format(dateFormat), // 到货日期
    updateUserName: '', // 提交人
    updateTime: '', // 提交时间
    createUserName: '', // 拆单人
    createTime: '', // 拆单时间
    depotName: '', // 配送仓库
    status: '', // 订单状态
    remarks: '', // 备注
    queryModalString: '',
    dataSourceIndex: [], // 编辑返回几条数据
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => `共 ${total} 条`,
      current: 1,
      total: 0,
      pageSize: 10,
      pageSizeOptions: [10, 20, 50, 100],
    },
  },
  reducers: { // Update above state.
    showLoading(state) {
      return { ...state, loading: true };
    },
    hideLoading(state) {
      return { ...state, loading: false };
    },
    mergeData(state, action) {
      return { ...state, ...action.payload };
    },
    setBussDate(state, action) {
      return { ...state, bussDate: action.bussDate };
    },
    setBillId(state, action) {
      return { ...state, billId: action.billId };
    },
    setBillInfo(state, action) {
      return { ...state, billInfo: action.billInfo };
    },
    changePageType(state, action) {
      return { ...state, pageType: action.pageType };
    },
    changeSavingStatus(state, action) {
      return { ...state, savingStatus: action.savingStatus };
    },
    changePageStatus(state, action) {
      return { ...state, pageStatus: action.pageStatus };
    },
    resetDetailList(state, action) {
      return { ...state, pageDetail: action.pageDetail };
    },
    gotDetailList(state, action) {
      return { ...state, pageDetail: action.pageDetail, pageStatus: action.pageStatus, loading: false };
    },
    setNewEditableMem(state, action) {
      return { ...state, editableMem: action.editableMem };
    },
    saveRemarks(state, action) {
      return { ...state, currRemarks: action.payload.remarks || '' };
    },
    goodsListSuccess(state, action) {
      return { ...state, ...action.payload };
    },
    querySuccess(state, action) {
      return { ...state, ...action.payload, loading: false };
    },
  },
  effects: { // Fire an action or action a function here.
    * queryBillList({ payload }, { call, put, select }) { // 点击查看或调单 通过url传过来的id查询该单据物资列表
      message.destroy();
      yield put({ type: 'showLoading' });
      yield put({ type: 'setBillId', billId: payload.id });
      yield put({ type: 'setBillInfo', billInfo: payload.record }); // 暂存当前选择的出库单信息
      const orderId = yield select(state => state.dispatchOrdersDetailsModule.orderId);
      const data = yield call(queryDetailList, parse({ id: orderId }));
      const detailList = _.cloneDeep(data.data.data.scmDispatchDetails);
      if (data.data && data.data.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            pageDetail: data.data.data.scmDispatchDetails,
            dataSourceIndex: detailList,
            id: data.data.data.id,
            billNo: data.data.data.billNo, // 配送订单号
            distribName: data.data.data.distribName, // 配送机构
            storeName: data.data.data.storeName, // 收货机构
            bussDate: data.data.data.bussDate, // 到货日期
            updateUserName: data.data.data.updateUserName, // 提交人
            updateTime: data.data.data.updateTime, // 提交时间
            createUserName: data.data.data.createUserName, // 拆单人
            createTime: data.data.data.createTime, // 拆单时间
            depotName: data.data.data.depotName, // 配送仓库
            status: data.data.data.status, // 订单状态
            remarks: data.data.data.remarks, // 备注
            currRemarks: data.data.data.remarks,
          },
        });
        yield put({
          type: 'editableMem',
          payload: { dataSource: [] },
        });
      } else {
        message.warning(`操作失败，请参考：${data.data.errorInfo}`);
        yield put({ type: 'hideLoading' });
      }
    },
    * startWithType({ payload }, { put, select }) { // 改为编辑状态
      yield put({ type: 'changePageType', pageType: payload.pageType });
      const storePageType = yield select(state => state.dispatchOrdersDetailsModule.pageType);
      // console.log("startWithType storeOpType", storeOpType);
      if (storePageType === 'add') {
        const rowsObj = [];
        const emptyItem = _.cloneDeep(dispatchOrdersDetailsItemModel);
        rowsObj.push(emptyItem);
        yield put({ type: 'gotDetailList', pageDetail: rowsObj });
      }
    },
    * resyncListData({ payload }, { put, select }) { // 编辑列表后同步，以在列表中即时显示
      yield put({ type: 'showLoading' });
      const storeListData = yield select(state => state.dispatchOrdersDetailsModule.pageDetail);
      const newPageData = _.cloneDeep(storeListData); // 使用新对象
      // let newData = payload.listData;
      yield put({ type: 'gotDetailList', pageDetail: newPageData });
    },
    * getGoodsListByTyping({ payload }, { put }) { // 根据用户输入的内容查询物品列表
      yield put({ type: 'showLoading' });
      // console.log('获取列表goes here!')
      // 更新goodsList
    },
    * editableMem({ payload }, { put, select }) { // 初始化数据
      // const data = yield select(state => state.supplyOrder.dataSource);
      const data = yield select(state => state.dispatchOrdersDetailsModule.pageDetail);
      // console.log("我是测试数据",data);
      const editableMemData = Array(data.length);
      for (let i = 0; i < data.length; i += 1) {
        // console.warn("i",i,"editableMemData[i]",editableMemData,"_.cloneDeep({})", _.cloneDeep({}));
        editableMemData[i] = _.cloneDeep({});
      }
      // console.log("初始化数据", editableMemData);
      yield put({ type: 'querySuccess', payload: { editableMem: editableMemData } });
    },
    * toNextMemByCurr({ payload }, { select, put }) { // 自动换焦点
      // console.log('toNextMemByCurr！', JSON.stringify(payload))
      const storeEditableMem = yield select(state => state.dispatchOrdersDetailsModule.editableMem);
      // console.log('storeEditableMem: ', JSON.stringify(storeEditableMem))
      let hasBeenSet = false;
      let arrivedLastRowIndex = -1;
      console.log('arrivedLastRowIndex', arrivedLastRowIndex);
      // let lastRowIndex = -1;
      // console.log('storeEditableMem', JSON.stringify(storeEditableMem)); // [{"goodsCode":false,"purcUnitNum":true,"dualUnitNum":false,"arrivalDate":false}]
      storeEditableMem.map((item, currRowIndex) => {
        const itemKeys = Object.keys(item);
        const itemVales = Object.values(item);
        // itemKeys.map((value, colIndex, rowIndex) => {
        //   console.log('storeEditableMem.map', value, colIndex, rowIndex);
        //   return null;
        // });
        itemVales.map((value, colIndex) => {
          // console.log('storeEditableMem.map', value, colIndex, rowIndex);
          if (value !== true) {
            return null;
          }
          // console.log('hasBeenSet', hasBeenSet);
          // console.log("itemVales.map", colIndex , itemKeys.length - 1)
          if (hasBeenSet === false) {
            // console.log("设置为非选中：", itemKeys[colIndex]);
            item[itemKeys[colIndex]] = false;
            // console.log('colIndex', colIndex, 'itemKeys.length - 1', itemKeys.length - 1)
            const nextRowObj = storeEditableMem[payload.rowIndex + 1];
            if (colIndex === itemKeys.length - 1) {
              if (nextRowObj) {
                // console.log("找到下一行的第一个元素，选中", itemKeys[0]);
                nextRowObj[itemKeys[0]] = true;
                hasBeenSet = true;
              } else {
                arrivedLastRowIndex = currRowIndex;
              }
            } else {
              // console.log("找到下一个元素，选中？", itemKeys,"payload.rowIndex", payload.rowIndex,"rowIndex",rowIndex);
              let indexCol = colIndex + 1; // indexCol means 当前单元格 and itemKeys 指的是当前行 可编辑的单元格对应字段key 组成的数组
              if (payload.isShow && (indexCol === itemKeys.length - 1) && nextRowObj) { // 如果一行只有一列可编辑的话 跳到下一行
                nextRowObj[itemKeys[0]] = true;
              } else if (payload.isShow && (indexCol === itemKeys.length - 1) && !nextRowObj) {
                arrivedLastRowIndex = currRowIndex;
              } else if (payload.isShow && indexCol > itemKeys.length - 1) {
                indexCol += 1;
              }
              item[itemKeys[indexCol]] = true;
              hasBeenSet = true;
            }
          }
          return null;
        });
        return null;
      });
      // console.warn("判断是否符合条件",arrivedLastRowIndex);
      // if (arrivedLastRowIndex >= 0) { // 添加新行
      //   yield put({ type: 'insertNewListItemAfterIndex', payload: { index: arrivedLastRowIndex } });
      // }
      // console.log('storeEditableMem', JSON.stringify(storeEditableMem));
      yield put({ type: 'setNewEditableMem', editableMem: storeEditableMem });
      // if (arrivedLastRowIndex >= 0) { // 启用编辑项
      //   yield put({ type: 'toNextMemByCurr', payload: { rowIndex: arrivedLastRowIndex } });
      // }
    },
    * toggleMemStatus({ payload }, { select, put }) { // 指控其他所有的焦点状态
      // rowIndex, fieldName
      const storeEditableMem = yield select(state => state.dispatchOrdersDetailsModule.editableMem);
      // console.log('rowIndex, fieldName', JSON.stringify(payload));
      // console.log('toggleMemStatus', JSON.stringify(storeEditableMem));
      storeEditableMem.map((item, rowIndex) => {
        const itemKeys = Object.keys(item);
        const itemVales = Object.values(item);
        itemVales.map((value, colIndex) => { // 循环遍历每一行为正在编辑的状态修改为非编辑状态，当前正在编辑的项目除外
          if (value === true && rowIndex === payload.rowIndex && itemKeys[colIndex] === payload.fieldName) {
            // item[itemKeys[colIndex]] = true; // keep status
          } else {
            item[itemKeys[colIndex]] = false;
          }
          return null;
        });
        return null;
      });
      // console.log('storeEditableMem', JSON.stringify(storeEditableMem));
      yield put({ type: 'setNewEditableMem', editableMem: storeEditableMem });
    },
    * updateEditableMem() {
      // const storeEditableMem = yield select(state => state.requisitionDetailsModule.editableMem);
      yield null;
    },
    * saveOrdersDetails({ payload }, { call, put, select }) { // 根据状态保存详细信息
      // const savingStatusMessage = message.loading('正在保存，请稍候……', 0);
      if (payload.displaySavingMessage !== false) {
        const { currRemarks, pageDetail, pageType } = yield select(state => state.dispatchOrdersDetailsModule);
        const cloneListData = _.cloneDeep(pageDetail);
        const invalidUnitNum = _.findIndex(cloneListData, item => !item.unitNum || Number(item.unitNum) === 0);
        if (invalidUnitNum > 0) {
          message.error(`第${invalidUnitNum + 1}行“数量”数据不能为空或零，请检查！`, 5);
          return null;
        }
        const newData = cloneListData.map((item, index) => ({
          id: item.id,
          index,
          arrivalDate: item.arrivalDate,
          dualUnitNum: item.dualUnitNum,
          unitNum: item.unitNum,
          goodsAmt: item.goodsAmt,
          goodsAmtNotax: item.goodsAmtNotax,
          ordUnitNum: item.ordUnitNum,
        }));
        const { id } = yield select(state => state.dispatchOrdersDetailsModule);
        const storePageType = pageType;
        // const bussDate = yield select(state => state.dispatchOrdersDetailsModule.bussDate);
        const detailsData = {
          status: payload.status,
          remarks: currRemarks,
          scmDispatchDetails: _.cloneDeep(newData),
        };
        yield put({ type: 'changeSavingStatus', savingStatus: true });
        // const storeBillId = yield select(state => state.dispatchOrdersDetailsModule);
        const storeBillId = id;
        let saveData = null;
        if (storePageType === 'edit') { // 更新时包含ID
          saveData = yield call(updDispatchOrders, Object.assign(parse(detailsData), { id: storeBillId }));
        }
        // console.log("saveDetails data",saveData,saveData.data.code,saveData.data.success,saveData.data.code === 200 && saveData.data.success === true);
        if (saveData.data.code === '200' && saveData.data.success === true) {
          message.success('操作成功！');
          const path = '#/stock/dispatchOrders';
          window.location.href = path;

          yield put({ type: 'changePageStatus', pageStatus: payload.status });
          yield put({ type: 'changeSavingStatus', savingStatus: false });
          // yield put({ type: 'changePageType', pageType: 'view' }); // 操作成功后改成浏览模式
        } else {
          // message.error('操作失败！');
          message.warning(`操作失败，请参考：${saveData.data.errorInfo}`);
          yield put({ type: 'changeSavingStatus', savingStatus: false });
        }
      }
      return null;
    },
    * cancelDetailData({ payload }, { put }) { // 取消跳回列表搜索页
      const path = '/stock/dispatchOrders';
      yield put({
        type: 'mergeData',
        payload: {
          billNo: '', // 配送订单号
          distribName: '', // 配送机构
          storeName: '', // 收货机构
          updateUserName: '', // 提交人
          updateTime: '', // 提交时间
          createUserName: '', // 拆单人
          createTime: '', // 拆单时间
          depotName: '', // 配送仓库
          status: '', // 订单状态
          remarks: '', // 备注
          pageDetail: [], // 订单信息
        },
      });
      yield put(routerRedux.push(path));
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        const pathname = location.pathname;
        // if (location.pathname === '/stock/dispatchOrders') { // 点击取消 也请求一遍列表 解决编辑后取消 再点进去是之前编辑的数量(缓存问题)
          // dispatch({
          //   type: 'queryBillList',
          //   payload: {
          //   },
          // });
        // }
        if (location.pathname.lastIndexOf('/stock/dispatchOrders/details') !== -1) {
          dispatch({
            type: 'saveOrdersDetails',
            payload: { displaySavingMessage: false },
          });
        }
        const re = pathToRegexp('/stock/dispatchOrders/details/:pageType/:id');
        const match = re.exec(pathname);
        if (match) {
          const pageType = match[1];
          const orderId = match[2];
          dispatch({
            type: 'editableMem',
            payload: { pageDetail: [] },
          });
          dispatch({
            type: 'querySuccess',
            payload: {
              pageType,
              orderId,
            },
          });
          dispatch({
            type: 'queryBillList',
            payload: {
            },
          });
          dispatch({
            type: 'queryWarehouse',
            payload: {
              status: 1,
              rows: '1000',
              queryString: '',
              limit: '1000',
            },
          });
        }
      });
    },
  },
};
