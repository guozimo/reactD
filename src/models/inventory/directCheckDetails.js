import { parse } from 'qs';
// import { routerRedux } from 'dva/router';
import { message } from 'antd';
import _ from 'lodash';
import moment from 'moment';
import pathToRegexp from 'path-to-regexp';
import { routerRedux } from 'dva/router';
import { queryWarehouse } from '../../services/inventory/common';
import { getCurrUser, getDetailList, sawDetailList, queryGoodsByString, saveDetails } from '../../services/inventory/directCheckDetails';
import { directCheckDetailsItemModel } from './_common';

export default {
  namespace: 'directCheckDetailsModule',
  state: {
    storeId: '',
    billInfo: {},
    opType: 'view', // create, edit, view
    // 查看页展示信息
    billNo: '', // 请购单号
    storeName: '', // 请购机构名称
    busiName: '', // 供应商名称
    status: '', // 状态
    createUserName: '', // 创建人
    createTime: '', // 创建时间
    auditName: '', // 提交人
    auditDate: '', // 提交时间
    depotName: '', // 入库仓库名称
    remarks: '', // 备注
    arrivalDate: '', // 到货时间

    depotId: '', // 入库仓库id
    depotList: '', // 入库仓库列表
    initialDepotName: '', // 入库仓库初始值

    user: {},
    loadingList: false,
    pageDetail: [{
      id: 1,
      goodsCode: '',
      goodsName: '',
      auditNum: '',
      goodsSpec: '',
      purcUnitNum: '',
      purcUnitName: '',
      unitName: '',
      dualUnitNum: '',
      dualUnitName: '',
      arrivalDate: '',
      ordPrice: '',
      goodsAmt: '',
      taxRatio: '',
      goodsAmtNotax: '',
      remarks: '',
      ordUnitNum: '',
      unitNum: '',
    }],
    editableMem: [],
    pageStatus: 0,
    goodsList: [],
    bussDate: moment(new Date()).format('YYYY-MM-DD'),
    savingStatus: false,
  },
  reducers: { // Update above state.
    initModule(state, action) { // 初始模块值
      return { ...state, ...action.payload };
    },

    gotUser(state, action) { // 初始模块值
      return { ...state, user: action.user };
    },

    querySuccess(state, action) {
      return { ...state, ...action.payload, loadingList: false };
    },

    showLoading(state) {
      return { ...state, loadingList: true };
    },

    gotDetailList(state, action) {
      return { ...state, pageDetail: action.pageDetail, pageStatus: action.pageStatus, loadingList: false };
    },

    changeOpType(state, action) {
      return { ...state, opType: action.opType };
    },

    setNewEditableMem(state, action) {
      return { ...state, editableMem: action.editableMem };
    },

    goodsListSuccess(state, action) {
      return { ...state, ...action.payload };
    },

    setBussDate(state, action) {
      return { ...state, bussDate: action.bussDate };
    },

    changePageStatus(state, action) {
      return { ...state, pageStatus: action.pageStatus };
    },

    changeSavingStatus(state, action) {
      return { ...state, savingStatus: action.savingStatus };
    },

    setBillInfo(state, action) {
      return { ...state, billInfo: action.billInfo };
    },

  },
  effects: { // Fire an action or action a function here.
    * intoModel({ payload }, { call, put }) { // 进入详情页
      const user = yield call(getCurrUser, parse(payload));
      if (user) {
        yield put({ type: 'gotUser', user: user.data });
      }
      yield put({ type: 'initModule', payload });
    },
    // 修改入库仓库
    * changeDepot({ payload }, { put }) {
      yield put({
        type: 'initModule',
        payload: {
          depotId: payload.depotId,
        },
      });
    },
    * queryDepot({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      const depotData = yield call(queryWarehouse, parse(payload));
      const depotLists = depotData.data.data.page.data;
      // 判断入库仓库列表是否只有一个，若是默认显示
      // const depotLists = depotLists1.slice(0, 1);
      let currDepotId = '';
      let initialValue = '请选择入库仓库';
      if (depotLists.length === 1) {
        currDepotId = depotLists[0].id; // 入库仓库id
        initialValue = depotLists[0].depotName;
      }
      if (depotData.data && depotData.data.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            depotList: depotLists,
            depotId: currDepotId,
            initialDepotName: initialValue,
          },
        });
      } else {
        message.warning(`操作失败，请参考：${depotData.data.errorInfo}`);
        yield put({ type: 'hideLoading' });
      }
    },
    * showDetailList({ payload }, { call, put, select }) { // 获取列表
      yield put({ type: 'showLoading' });
      let opType = yield select(state => state.directCheckDetailsModule.opType);
      opType = payload.opType || opType;
      if (opType === 'view') {
        const showInfo = yield call(sawDetailList, parse(payload));
        if (showInfo.data.code === '200' && showInfo.data.success) {
          yield put({ type: 'setBillInfo', billInfo: showInfo.data.data.scmDirect }); // 暂存当前选择的直运单信息
          yield put({ type: 'gotDetailList', pageDetail: showInfo.data.data.detailList, pageStatus: showInfo.data.data.status });
          yield put({ type: 'initModule',
            payload: {
              billNo: showInfo.data.data.scmDirect.billNo, // 采购单号
              storeName: showInfo.data.data.scmDirect.storeName, // 请购机构
              busiName: showInfo.data.data.scmDirect.busiName, // 供应商
              status: showInfo.data.data.scmDirect.status, // 状态
              createUserName: showInfo.data.data.scmDirect.createUserName, // 创建人
              createTime: showInfo.data.data.scmDirect.createTime, // 创建时间
              auditName: showInfo.data.data.scmDirect.auditName, // 验收人
              auditDate: showInfo.data.data.scmDirect.auditDate, // 验收时间
              depotName: showInfo.data.data.scmDirect.depotName, // 入库仓库
              remarks: showInfo.data.data.scmDirect.remarks, // 备注
              arrivalDate: showInfo.data.data.scmDirect.arrivalDate, // 到货时间
            },
          });
        }
      } else {
        const detailInfo = yield call(getDetailList, parse(payload));
        if (detailInfo.data.code === '200' && detailInfo.data.success) {
          yield put({ type: 'setBillInfo', billInfo: detailInfo.data.data.scmDirect }); // 暂存当前选择的直运单信息
          yield put({ type: 'gotDetailList', pageDetail: detailInfo.data.data.detailList, pageStatus: detailInfo.data.data.status });
          yield put({ type: 'initModule',
            payload: {
              billNo: detailInfo.data.data.scmDirect.billNo, // 采购单号
              storeName: detailInfo.data.data.scmDirect.storeName, // 请购机构
              busiName: detailInfo.data.data.scmDirect.busiName, // 供应商
              status: detailInfo.data.data.scmDirect.status, // 状态
              createUserName: detailInfo.data.data.scmDirect.createUserName, // 创建人
              createTime: detailInfo.data.data.scmDirect.createTime, // 创建时间
              depotName: detailInfo.data.data.scmDirect.depotName, // 入库仓库
              remarks: detailInfo.data.data.scmDirect.remarks, // 备注
              arrivalDate: detailInfo.data.data.scmDirect.arrivalDate, // 到货时间
            },
          });
        }
      }
      yield put({
        type: 'editableMem',
        payload: { dataSource: [] },
      });
    },
    * startWithType({ payload }, { put, select }) { // 改为编辑状态
      // console.log('startWithType!');
      yield put({ type: 'changeOpType', opType: payload.opType });
      const storeOpType = yield select(state => state.directCheckDetailsModule.opType);
      // console.log("startWithType storeOpType", storeOpType);
      if (storeOpType === 'create') {
        const rowsObj = [];
        const emptyItem = _.cloneDeep(directCheckDetailsItemModel);
        rowsObj.push(emptyItem);
        yield put({ type: 'gotDetailList', pageDetail: rowsObj });
      }
    },
    * resyncListData({ payload }, { put, select }) { // 编辑列表后同步，以在列表中即时显示
      yield put({ type: 'showLoading' });
      const storeListData = yield select(state => state.directCheckDetailsModule.pageDetail);
      const newPageData = _.cloneDeep(storeListData); // 使用新对象
      // let newData = payload.listData;
      yield put({ type: 'gotDetailList', pageDetail: newPageData });
    },
    * getGoodsListByTyping({ payload }, { put }) { // 根据用户输入的内容查询物品列表
      yield put({ type: 'showLoading' });
      // console.log('获取列表goes here!')
      // 更新goodsList
    },
    * syncMemFields({ payload }, { put, select }) { // 初始化可编辑列
      // console.log("syncMemFields",payload);
      const storeEditableMem = yield select(state => state.directCheckDetailsModule.editableMem);
      const storeListData = yield select(state => state.directCheckDetailsModule.pageDetail);
      const fieldName = payload.fieldName;
      // console.log("storeListData",storeListData);
      storeListData.map((item, index) => {
        // let memRow = storeEditableMem[index];
        const memRowColumns = storeEditableMem[index] && Object.keys(storeEditableMem[index]);
        // console.log("storeEditableMem[index]", storeEditableMem[index]);
        if (!storeEditableMem[index]) { // 不存在当前行
          storeEditableMem[index] = {};
          storeEditableMem[index][fieldName] = false;
        } else if (memRowColumns && memRowColumns.length > 0 && !memRowColumns.includes(fieldName)) { // 存在当前行但没有当前列
          storeEditableMem[index][fieldName] = false;
        }
        return false;
      });
      // console.log("storeEditableMem", storeEditableMem);
      yield put({ type: 'setNewEditableMem', editableMem: storeEditableMem });
    },
    * editableMem({ payload }, { put, select }) { // 初始化数据
      // const data = yield select(state => state.supplyOrder.dataSource);
      const data = yield select(state => state.directCheckDetailsModule.pageDetail);
      // const data = yield select(state => state.requisitionDetailsModule.editableMem);
      // const data = _.cloneDeep([cannManageItemModel]);
      // console.log("我是测试数据",data);
      const editableMemData = Array(data.length);
      for (let i = 0; i < data.length; i += 1) {
        // console.warn("i",i,"editableMemData[i]",editableMemData,"_.cloneDeep({})", _.cloneDeep({}));
        editableMemData[i] = _.cloneDeep({});
      }
      // console.log("我是初始化数据", editableMemData);
      yield put({ type: 'querySuccess', payload: { editableMem: editableMemData } });
    },
    * queryGoodsCoding({ payload }, { call, put }) { // 查询物资
      yield put({ type: 'showLoading' });
      const data = yield call(queryGoodsByString, parse(payload));
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
    * syncSeletedItemIntoList({ payload }, { select, put }) { // 将选择的物资对象合并到表格对象中
      yield put({ type: 'showLoading' });
      const storeListData = yield select(state => state.directCheckDetailsModule.pageDetail);
      const newPageData = _.cloneDeep(storeListData); // 使用新对象
      const selectedObjs = _.cloneDeep(payload.selectedObjs); // 使用新对象
      // console.log('payload.index', payload.index);
      // console.log('selectedObjs', JSON.stringify(selectedObjs));
      // console.log('newPageData', JSON.stringify(newPageData));
      selectedObjs.map((item) => { item.goodsId = item.id; return null; });
      // console.log('selectedObjs', ...selectedObjs);
      newPageData.splice(payload.index + 1, 0, ...selectedObjs); // Insert selectedObjs to newPageData at payload.index
      newPageData.splice(payload.index, 1); // Remove the old item at index
      // Object.assign(
      //   newPageData[payload.index],
      //   selectedObjs,
      //   {goodsId: selectedObj.id, id:''} // 更新goodsId，新增的也要去掉id
      // );
      // console.log('newPageData=>', JSON.stringify(newPageData));
      yield put({ type: 'gotDetailList', pageDetail: newPageData });
      yield put({ type: 'querySuccess',
        payload: {
          cateId: '',
          queryModalString: '',
          popupListPagination: {
            current: 1,
            pageSize: 10,
          },
        },
      });
      yield put({
        type: 'editableMem',
        payload: { dataSource: [] },
      });
    },
    * toNextMemByCurr({ payload }, { select, put }) { // 自动换焦点
      // console.log('toNextMemByCurr！', JSON.stringify(payload))
      const storeEditableMem = yield select(state => state.directCheckDetailsModule.editableMem);
      // console.log('storeEditableMem: ', JSON.stringify(storeEditableMem))
      let hasBeenSet = false;
      let arrivedLastRowIndex = -1;
      // let lastRowIndex = -1;
      // console.log('storeEditableMem', JSON.stringify(storeEditableMem)); // [{"goodsCode":false,"purcUnitNum":true,"dualUnitNum":false,"arrivalDate":false}]
      storeEditableMem.map((item, currRowIndex) => {
        const itemKeys = Object.keys(item);
        const itemVales = Object.values(item);
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
            if (colIndex === itemKeys.length - 1) {
              const nextRowObj = storeEditableMem[payload.rowIndex + 1];
              // console.log("nextRowObj", nextRowObj)
              if (nextRowObj) {
                // console.log("找到下一行的第一个元素，选中", itemKeys[0]);
                nextRowObj[itemKeys[0]] = true;
                hasBeenSet = true;
              } else {
                arrivedLastRowIndex = currRowIndex;
              }
            } else {
              // console.log("找到下一个元素，选中？", itemKeys[colIndex + 1],payload.rowIndex,rowIndex);
              // if (payload.rowIndex!=rowIndex-1) {
              let indexCol = colIndex + 1;
              // console.warn('00000000000000000payload.isShow', payload.isShow);
              if (payload.isShow) {
                // console.warn('00000000000000000');
                indexCol += 1;
                // item[itemKeys[colIndex + 1]] = true;
              }
              item[itemKeys[indexCol]] = true;
              hasBeenSet = true;
              // }
            }
          }
          return null;
        });
        return null;
      });
      if (arrivedLastRowIndex >= 0) { // 添加新行
        yield put({ type: 'insertNewListItemAfterIndex', payload: { index: arrivedLastRowIndex } });
      }
      // console.log('storeEditableMem', JSON.stringify(storeEditableMem));
      yield put({ type: 'setNewEditableMem', editableMem: storeEditableMem });
      // if (arrivedLastRowIndex >= 0) { // 启用编辑项
      //   yield put({ type: 'toNextMemByCurr', payload: { rowIndex: arrivedLastRowIndex } });
      // }
    },
    * toggleMemStatus({ payload }, { select, put }) { // 指控其他所有的焦点状态
      // rowIndex, fieldName
      const storeEditableMem = yield select(state => state.directCheckDetailsModule.editableMem);
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
    * insertNewListItemAfterIndex({ payload }, { select, put }) { // 点击添加行按钮在某一下标下添加一行
      yield put({ type: 'showLoading' });
      const storeListData = yield select(state => state.directCheckDetailsModule.pageDetail);
      const newPageData = _.cloneDeep(storeListData); // 使用新对象
      const emptyItem = _.cloneDeep(directCheckDetailsItemModel);
      emptyItem.id = new Date();
      newPageData.splice(payload.index + 1, 0, emptyItem); // Insert an emptyItem after index to an array
      yield put({ type: 'gotDetailList', pageDetail: newPageData });
    },
    * removeListItemAtIndex({ payload }, { select, put }) { // 点击添加行按钮在某一下标下添加一行
      yield put({ type: 'showLoading' });
      const storeListData = yield select(state => state.directCheckDetailsModule.pageDetail);
      const newPageData = _.cloneDeep(storeListData); // 使用新对象
      newPageData.splice(payload.index, 1); // remove 1 item at index from an array javascript
      yield put({ type: 'gotDetailList', pageDetail: newPageData });
    },
    * setBussinessDate({ payload }, { put }) { // 设置要货日期
      yield put({ type: 'setBussDate', bussDate: payload.dateString });
    },
    * saveDirectCheckDetails({ payload }, { call, put, select }) { // 根据状态保存详细信息
      // const savingStatusMessage = message.loading('正在保存，请稍候……', 0);
      if (payload.displaySavingMessage === false) {
        // setTimeout(savingStatusMessage, 300); // Not working?
        yield false;
      }
      let storeListData = yield select(state => state.directCheckDetailsModule.pageDetail);
      const billInfo = yield select(state => state.directCheckDetailsModule.billInfo);
      storeListData = _.cloneDeep(storeListData);
      // 验证是否选择入库仓库
      const depotListId = yield select(state => state.directCheckDetailsModule.depotId);
      const depotList = yield select(state => state.directCheckDetailsModule.depotList);
      if (!depotListId) {
        message.error('请选择入库仓库！');
        return null;
      }
      const depotListCurrData = _.find(depotList, item => item.id === depotListId);
      const depotListName = depotListCurrData.depotName;
      storeListData.map((item) => {
        item.auditNum = Math.round(item.unitNum * item.purcUnitRates * 10000) / 10000;
        return null;
      });
      const storeLists = _.cloneDeep(storeListData);
      const detailList = storeLists.map(item => ({
        id: item.id,
        // auditNum: item.auditNum || item.purcUnitNum || 0,
        auditNum: item.auditNum || 0,
        unitNum: item.unitNum,
        ordUnitNum: item.ordUnitNum,
        goodsAmt: item.goodsAmt,
        dualUnitNum: item.dualUnitNum,
        goodsAmtNotax: item.goodsAmtNotax }));
      // detailList = Object.assign({}, )
      const invalidIndex = _.findIndex(detailList, item => !item.auditNum);
      if (invalidIndex >= 0) {
        message.error(`第${invalidIndex + 1}行验收数量有误，需大于0，请检查！`);
        return null;
      }
      const detailsData = {
        id: billInfo.id,
        depotId: depotListId, // 仓库ID
        depotName: depotListName,
        status: payload.status,
        scmDirectDetailList: _.cloneDeep(detailList),
      };
      yield put({ type: 'changeSavingStatus', savingStatus: true });
      const saveData = yield call(saveDetails, parse(detailsData));
      // console.log("saveDetails data",saveData,saveData.data.code,saveData.data.success,saveData.data.code === 200 && saveData.data.success === true);
      if (saveData.data.code === '200' && saveData.data.success === true) {
        // setTimeout(savingStatusMessage, 100);
        message.success('操作成功！');
        // yield put({ type: 'changeOpType', opType: 'view' }); // 操作成功后改成浏览模式
        const path = '#/stock/directCheck';
        window.location.href = path;

        yield put({ type: 'changePageStatus', pageStatus: payload.status });
        yield put({ type: 'changeSavingStatus', savingStatus: false });
      } else {
        message.warning(`操作失败，请参考：${saveData.data.errorInfo}`, 5);
        // setTimeout(savingStatusMessage, 100);
        yield put({ type: 'changeSavingStatus', savingStatus: false });
      }
      return null;
    },
    * cancelDetailData({ payload }, { put }) {
      const path = '/stock/directCheck';
      yield put({
        type: 'initModule',
        payload: {
          billNo: '', // 请购单号
          storeName: '', // 请购机构名称
          busiName: '', // 供应商名称
          status: '', // 状态
          createUserName: '', // 创建人
          createTime: '', // 创建时间
          auditName: '', // 提交人
          auditDate: '', // 提交时间
          depotName: '', // 入库仓库名称
          remarks: '', // 备注
          pageDetail: [], // 单据信息
        },
      });
      yield put(routerRedux.push(path));
    },
    * switchSavingStatus({ payload }, { put }) {
      yield put({ type: 'changeSavingStatus', savingStatus: payload.savingStatus });
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        const re = pathToRegexp('/stock/directCheck/details/:type/:idKye/:storeId');
        const match = re.exec(location.pathname);
        if (match) {
          const pageType = match[1];
          const storeIds = match[3];
          dispatch({
            type: 'editableMem',
            payload: { pageDetail: [] },
          });
          dispatch({
            type: 'directCheckDetailsModule/showDetailList',
            payload: {
              opType: match[1],
              id: match[2],
              storeId: match[3],
            },
          });
          dispatch({
            type: 'directCheckDetailsModule/startWithType',
            payload: {
              opType: match[1],
            },
          });
          dispatch({
            type: 'saveDirectCheckDetails',
            payload: { displaySavingMessage: false },
          });
          if (pageType !== 'view') {
            dispatch({ // 请求仓库
              type: 'queryDepot',
              payload: {
                storeId: storeIds,
                rows: 10,
              },
            });
          }
        }
        // if (location.pathname !== '/stock/directCheck/details/:type/:idKye/:storeId') {

        // }
      });
    },
  },
};
