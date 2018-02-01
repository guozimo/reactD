import { parse } from 'qs';
// import { routerRedux } from 'dva/router';
import { message } from 'antd';
import _ from 'lodash';
import moment from 'moment';
import pathToRegexp from 'path-to-regexp';
import { routerRedux } from 'dva/router';
import { getCurrUser, getDetailList, queryGoodsByString, saveDetails, updateDetails, toupdate } from '../../services/inventory/requisitionDetails';
import { requisitionDetailsItemModel } from './_common';
import { queryGoodsID, findTreeList } from '../../services/inventory/common';

export default {
  namespace: 'requisitionDetailsModule',
  state: {
    storeId: '',
    billNo: '',
    billId: '',
    billInfo: {},
    dataSourceIndex: [],
    opType: 'view', // create, edit, view 三种模式
    user: {},
    loadingList: false,
    pageDetail: [{
      id: 1,
      storeId: '',
      storeName: null,
      createUser: null,
      createUserName: null,
      createTime: '',
      updateUser: null,
      updateTime: null,
      deleteFlag: null,
      tenantId: null,
      tenName: null,
      queryString: null,
      isSystem: null,
      delIds: null,
      delIdsList: null,
      page: 0,
      rows: 0,
      orderProperty: null,
      orderDirection: null,
      storeIds: null,
      applyOrderId: '',
      goodsId: '',
      goodsCode: '',
      goodsName: '',
      goodsSpec: null,
      purcUnitId: '',
      purcUnitName: '',
      purcUnitNum: 0,
      unitId: '',
      unitName: '',
      unitNum: 0,
      remarks: '',
      sequence: 0,
      supplyId: null,
      supplyName: null,
      dualUnitId: null,
      dualUnitName: null,
      dualUnitNum: null,
      arrivalDate: null,
    }],
    editableMem: [],
    pageStatus: 0,
    goodsList: [],
    bussDate: null,
    savingStatus: false,
    queryModalString: '',
    foundTreeList: [],

    goodsPopListModel: {},
    cateId: '',
    popupListPagination: { // 物资弹窗组件用
      size: 'small',
      showTotal: total => `共 ${total} 条`,
      showSizeChanger: true,
      showQuickJumper: true,
      current: 1,
      total: 0,
      pageSize: 10,
      pageSizeOptions: [10, 20, 50, 100],
    },
    popupListLoading: false,
  },
  reducers: { // Update above state.
    initModule(state, action) { // 初始模块值
      return { ...state, ...action.payload };
    },
    mergeData(state, action) {
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
      return { ...state, pageDetail: action.pageDetail, loadingList: false };
    },
    resetDetailList(state, action) {
      return { ...state, pageDetail: action.pageDetail };
    },
    changeOpType(state, action) {
      return { ...state, opType: action.opType };
    },
    setNewEditableMem(state, action) {
      return { ...state, editableMem: action.editableMem };
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
    setBillId(state, action) {
      return { ...state, billId: action.billId };
    },
    gotGoodsData(state, action) { // 初始模块值
      return { ...state, goodsPopListModel: action.goodsPopListModel, popupListPagination: action.listPagination };
    },
    setBillInfo(state, action) {
      return { ...state, billInfo: action.billInfo };
    },
    gotTreeList(state, action) {
      return { ...state, foundTreeList: action.foundTreeList };
    },
    saveCateId(state, action) {
      // console.log("saveCateId action", action);
      return { ...state, cateId: action.payload.cateId || '' };
    },
  },
  effects: { // Fire an action or action a function here.
    * findBillNoInfo({ payload }, { put }) { // 进入详情页
      let path = '';
      if (payload.directionType === '1') {
        const timeId = moment().valueOf();
        path = `/stock/supplyOrder/supplyOrderFind/${timeId}`;
        yield put(routerRedux.push(path));
        const supplyOrderFind = {
          findId: payload.id,
          distribId: '',
        };
        window.sessionStorage.setItem(`supplyOrderFind_${timeId}`, JSON.stringify(supplyOrderFind));
      } else {
        path = `/stock/dispatchOrders/details/view/${payload.id}`;
      }
      yield put(routerRedux.push(path));
    },
    * intoModel({ payload }, { call, put, select }) { // 进入详情页
      const { opType } = yield select(state => state.requisitionDetailsModule);
      if (opType !== 'edit') {
        const user = yield call(getCurrUser, parse(payload));
        if (user) {
          yield put({ type: 'gotUser', user: user.data });
        }
      }
      yield put({ type: 'initModule', payload });
    },
    * getPopListData({ payload }, { select, call, put }) {
      const { popupListPagination, cateId, queryModalString } = yield select(state => state.requisitionDetailsModule);
      const { storeId } = yield select(state => state.requisitionModule);
      const pageNo = payload.pageNo || popupListPagination.current;
      const pageSize = payload.pageSize || popupListPagination.pageSize;
      const queryString = (payload.queryString || payload.queryString === '') ? payload.queryString : queryModalString;
      if (payload.queryString || payload.queryString === '') {
        yield put({ type: 'mergeData', payload: { queryModalString: payload.queryString, popupListLoading: true } });
      } else {
        yield put({ type: 'mergeData', payload: { popupListLoading: true } });
      }
      let reqParams = {};
      const thisCateId = payload.cateId || cateId;
      if (thisCateId) {
        reqParams = {
          cateId: thisCateId,
          storeId,
          status: '1', // 后端要求
          page: pageNo, // 查看第几页内容 默认1
          rows: pageSize, // 一页展示条数 默认10
          queryString, // 查询条件
        };
      } else {
        reqParams = {
          storeId,
          status: '1', // 后端要求
          page: pageNo, // 查看第几页内容 默认1
          rows: pageSize, // 一页展示条数 默认10}
          queryString, // 查询条件
        };
      }
      const goodsData = yield call(queryGoodsID, parse(reqParams));
      if (goodsData && goodsData.data) {
        yield put({ type: 'mergeData',
          payload: {
            popupListLoading: false,
            goodsPopListModel: goodsData.data,
            popupListPagination: {
              showSizeChanger: true,
              showQuickJumper: true,
              total: goodsData.data.data.totalCount,
              current: goodsData.data.data.page,
              showTotal: total => `共 ${total} 条`,
              pageSize: goodsData.data.data.limit,
              size: 'small',
              pageSizeOptions: [10, 20, 50, 100],
            },
          },
        });
      }
    },
    * showDetailList({ payload }, { call, put }) { // 获取列表
      yield put({ type: 'showLoading' });
      const detailInfo = yield call(getDetailList, parse(payload));
      // console.log(detailInfo);
      yield put({ type: 'setBillId', billId: payload.id });
      // console.log("detailInfo",detailInfo,detailInfo.data.data.results.detailList);
      // console.log(detailInfo.data.data.applyOrder);
      if (detailInfo.data.code === '200') {
        const newSourceItem = detailInfo.data.data.detailList;
        yield put({ type: 'setBillInfo', billInfo: detailInfo.data.data.applyOrder }); // 暂存当前选择的直运单信息
        yield put({ type: 'gotDetailList', pageDetail: newSourceItem, pageStatus: detailInfo.data.data.applyOrder.status });
        yield put({ type: 'querySuccess', payload: { dataSourceIndex: _.cloneDeep(newSourceItem) } });
        yield put({
          type: 'editableMem',
          payload: { dataSource: [] },
        });
      }
    },
    * toupdate({ payload }, { call, put }) { // 获取列表
      yield put({ type: 'showLoading' });
      const detailInfo = yield call(toupdate, parse(payload));
      // console.log(detailInfo);
      yield put({ type: 'setBillId', billId: payload.id });
      // console.log("detailInfo",detailInfo,detailInfo.data.data.results.detailList);
      if (detailInfo.data.code === '200') {
        const newSourceItem = detailInfo.data.data.results.detailList;
        yield put({ type: 'setBillInfo', billInfo: detailInfo.data.data.results }); // 暂存当前选择的直运单信息
        yield put({ type: 'gotDetailList', pageDetail: newSourceItem, pageStatus: detailInfo.data.data.results.status });
        yield put({ type: 'changePageStatus', pageStatus: detailInfo.data.data.results.status });
        yield put({ type: 'querySuccess', payload: { dataSourceIndex: _.cloneDeep(newSourceItem), bussDate: moment(detailInfo.data.data.results.bussDate) } });
        yield put({
          type: 'editableMem',
          payload: { dataSource: [] },
        });
      }
    },
    * startWithType({ payload }, { put, select }) { // 改为编辑状态
      yield put({ type: 'changeOpType', opType: payload.opType });
      const storeOpType = yield select(state => state.requisitionDetailsModule.opType);
      // console.log("startWithType storeOpType", storeOpType);
      if (storeOpType === 'create') {
        const rowsObj = [];
        const emptyItem = _.cloneDeep(requisitionDetailsItemModel);
        rowsObj.push(emptyItem);
        // console.log("rowsObj",rowsObj);
        yield put({ type: 'gotDetailList', pageDetail: rowsObj });
        yield put({
          type: 'editableMem',
          payload: { pageDetail: [] },
        });
      }
    },
    // * resetData({ payload }, { put }) {
    //   yield put({ type: 'setNewEditableMem', editableMem: new Array(0) }); // 删掉原来的mem，每次重新计算
    //   yield put({ type: 'resetDetailList', pageDetail: new Array(0) }); // 删掉原来的列表数据以防止列表生成men表时计算错误
    // },
    * resyncListData({ payload }, { put, select }) { // 编辑列表后同步，以在列表中即时显示
      yield put({ type: 'showLoading' });
      // console.log("0000000000000000000000000000000000000");
      const storeListData = yield select(state => state.requisitionDetailsModule.pageDetail);
      const newPageData = _.cloneDeep(storeListData); // 使用新对象
      // let newData = payload.listData;
      yield put({ type: 'gotDetailList', pageDetail: newPageData });
    },
    // * getGoodsListByTyping({ payload }, { put }) { // 根据用户输入的内容查询物品列表
    //   // yield put({ type: 'showLoading' });
    //   // console.log('获取列表goes here!')
    //   // 更新goodsList
    // },
    * syncMemFields({ payload }, { put, select }) { // 初始化可编辑列
      const storeEditableMem = yield select(state => state.requisitionDetailsModule.editableMem);
      const storeListData = yield select(state => state.requisitionDetailsModule.pageDetail);
      const fieldName = payload.fieldName;
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
      const data = yield select(state => state.requisitionDetailsModule.pageDetail);
      // const data = yield select(state => state.requisitionDetailsModule.editableMem);
      // const data = _.cloneDeep([cannManageItemModel]);
      // console.log("我是editableMem测试数据data",data);
      const editableMemData = Array(data.length);
      for (let i = 0; i < data.length; i += 1) {
        // console.warn("i",i,"editableMemData[i]",editableMemData,"_.cloneDeep({})", _.cloneDeep({}));
        editableMemData[i] = _.cloneDeep({});
      }
      // console.log("我是初始化数据", editableMemData);
      yield put({ type: 'mergeData', payload: { editableMem: editableMemData } });
    },
    * queryGoodsCoding({ payload }, { call, put }) { // 查询物资
      yield put({ type: 'showLoading' });
      const data = yield call(queryGoodsByString, parse(payload));
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
    * syncSeletedItemIntoList({ payload }, { select, put }) { // 将选择的物资对象合并到表格对象中
      yield put({ type: 'showLoading' });
      const storeListData = yield select(state => state.requisitionDetailsModule.pageDetail);
      const newPageData = _.cloneDeep(storeListData); // 使用新对象
      const selectedObjs = _.cloneDeep(payload.selectedObjs); // 使用新对象
      // console.log('payload.index', payload.index);
      // console.log('selectedObjs=>', JSON.stringify(selectedObjs));
      // console.log('newPageData=>', JSON.stringify(newPageData));
      selectedObjs.map((item) => { item.goodsId = item.id; return null; });
      // console.log('selectedObjs', ...selectedObjs);
      newPageData.splice(payload.index + 1, 0, ...selectedObjs); // Insert selectedObjs to newPageData at payload.index
      newPageData.splice(payload.index, 1); // Remove the old item at index
      // Object.assign(
      //   newPageData[payload.index],
      //   selectedObjs,
      //   {goodsId: selectedObj.id, id:''} // 更新goodsId，新增的也要去掉id
      // );
      // console.log('after newPageData=>', JSON.stringify(newPageData));
      yield put({ type: 'gotDetailList', pageDetail: newPageData });

      const storeEditableMem = yield select(state => state.requisitionDetailsModule.editableMem);
      storeEditableMem[payload.index][payload.fieldName] = false;
      yield put({ type: 'setNewEditableMem', editableMem: storeEditableMem });
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
      if (payload.isModal) {
        yield put({
          type: 'editableMem',
          payload: { dataSource: [] },
        });
      }
      // yield put({
      //   type: 'toNextMemByCurr',
      //   payload: { rowIndex: payload.index, fieldName: payload.fieldName },
      // });
    },
    * toNextMemByCurr({ payload }, { select, put }) { // 自动换焦点 pass
      // console.log('toNextMemByCurr！', JSON.stringify(payload))
      const storeEditableMem = yield select(state => state.requisitionDetailsModule.editableMem);
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
              // console.log("找到下一个元素，选中？colIndex", colIndex);
              // console.log("payload.isShow",payload.isShow);
              // if (payload.rowIndex!=rowIndex-1) {
              let indexCol = colIndex + 1;
              if (payload.isShow) {
                // console.warn('00000000000000000');
                indexCol += 1;
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
      const storeNewEditableMem = yield select(state => state.requisitionDetailsModule.editableMem);
      // console.log("payload",payload,storeEditableMem);
      // if (payload.fieldName !== 'arrivalDate') {
      //   storeEditableMem.filter(item => item.arrivalDate).map(item => ({}))
      // } else {
      //
      // }
      // console.log('rowIndex, fieldName', JSON.stringify(payload));
      // console.log('toggleMemStatus', JSON.stringify(storeEditableMem));
      const storeEditableMem = _.cloneDeep(storeNewEditableMem);
      storeEditableMem.map((item, rowIndex) => {
        const itemKeys = Object.keys(item);
        const itemVales = Object.values(item);
        itemVales.map((value, colIndex) => { // 循环遍历每一行为正在编辑的状态修改为非编辑状态，当前正在编辑的项目除外
          // console.log("hhhhhhhhhh",value);
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
    * insertNewListItemAfterIndex({ payload }, { select, put }) { // 点击添加行按钮在某一下标下添加一行
      yield put({ type: 'showLoading' });
      const storeListData = yield select(state => state.requisitionDetailsModule.pageDetail);
      const newPageData = _.cloneDeep(storeListData); // 使用新对象
      const emptyItem = _.cloneDeep(requisitionDetailsItemModel);
      emptyItem.id = moment().toISOString(); // 使用时间字符串作为对象，使用new date()对象的话有错
      newPageData.splice(payload.index + 1, 0, emptyItem); // Insert an emptyItem after index to an array
      yield put({ type: 'gotDetailList', pageDetail: newPageData });

      // 重新添加一行mem记录
      const storeEditableMem = yield select(state => state.requisitionDetailsModule.editableMem);
      const tempRow = _.cloneDeep(storeEditableMem[0]);
      const tempRowKeys = Object.keys(tempRow);
      tempRowKeys.map((key, index) => {
        if (index === 0) {
          tempRow[key] = true;
        } else {
          tempRow[key] = false;
        }
        return false;
      });
      // console.log('tempRow', tempRow);

      storeEditableMem.splice(payload.index + 1, 0, tempRow); // Insert an emptyItem after index to an array
      yield put({ type: 'setNewEditableMem', editableMem: storeEditableMem });
      yield put({ type: 'toggleMemStatus', payload: { rowIndex: payload.index + 1, fieldName: tempRowKeys[0] } });
    },
    * removeListItemAtIndex({ payload }, { select, put }) { // 点击删除行按钮在某一下标下添加一行
      yield put({ type: 'showLoading' });
      const storeListData = yield select(state => state.requisitionDetailsModule.pageDetail);
      const editableMem = yield select(state => state.requisitionDetailsModule.editableMem);
      const newPageData = _.cloneDeep(storeListData); // 使用新对象
      const newEditableMem = _.cloneDeep(editableMem); // 使用新对象
      newPageData.splice(payload.index, 1); // remove 1 item at index from an array javascript
      newEditableMem.splice(payload.index, 1); // remove 1 item at index from an array javascript
      // console.warn("newEditableMem", newEditableMem);
      yield put({ type: 'querySuccess', payload: { pageDetail: newPageData, editableMem: newEditableMem } });
    },
    * setBussinessDate({ payload }, { select, put }) { // 设置要货日期
      const storeListData = yield select(state => state.requisitionDetailsModule.pageDetail);
      const invalidateRowIndex = _.findIndex(storeListData, (item) => { // 验证请购日期和到货日期
        if (item.arrivalDate) {
          return moment(item.arrivalDate).isBefore(moment(payload.dateString));
        }
        return false;
      });
      if (invalidateRowIndex + 1) {
        message.error(`第${invalidateRowIndex + 1}行到货日期不允许超出您要设置的请购日期，请修改！`, 3);
      } else {
        yield put({ type: 'setBussDate', bussDate: moment(payload.dateString) });
      }
    },
    * saveRequisitionDetails({ payload }, { call, put, select }) { // 根据状态保存详细信息
      // const savingStatusMessage = message.loading('正在保存，请稍候……', 0);
      if (payload.displaySavingMessage !== false) {
        const { storeId, depotList } = yield select(state => state.requisitionModule);
        const { bussDate, billId, opType, pageDetail, pageStatus } = yield select(state => state.requisitionDetailsModule);
        // 框变红的校验
        const renderErrorCloneListData = _.cloneDeep(pageDetail);
        for (let i = 0; i < renderErrorCloneListData.length; i += 1) {
          renderErrorCloneListData[i].renderErrorRules = null;
        }
        yield put({ type: 'gotDetailList', pageDetail: renderErrorCloneListData });

        const newPageDetail = pageDetail.filter(item => item.goodsCode);
        // console.log("newPageDetail", newPageDetail);
        const cloneListData = _.cloneDeep(newPageDetail);
        if (!cloneListData.length) {
          message.error('第一行物资编码不能为空');
          return false;
        }
        cloneListData.map((item) => {
          // if (opType === 'create') { // 只有创建的时候不传ID，编辑时需要ID
          delete item.id;
          // }
          delete item.createTime; // 不需要手动保存创建时间
          delete item.updateTime;
          delete item.updateUser;
          delete item.deleteFlag;
          return null;
        });


        // 编辑列{ goodsCode: false, dualGoodsQty: false, checkQty: false, remarks: false }
        const invalidiGoodsCode = _.findIndex(cloneListData, item => !item.goodsCode);
        if (invalidiGoodsCode >= 0) {
          message.error(`第${invalidiGoodsCode + 1}行“物品编码”数据无效，请检查！`, 3);
          return null;
        }
        const invalidiPurcUnitNum = _.findIndex(cloneListData, item => !item.purcUnitNum);
        if (invalidiPurcUnitNum >= 0) {
          message.error(`第${invalidiPurcUnitNum + 1}行“订货数量”数据无效，请检查！`, 3);
          return null;
        }
        const invalidiDualUnitNum = _.findIndex(cloneListData, item => !item.dualUnitNum && item.dualUnitFlag === 1);
        if (invalidiDualUnitNum >= 0) {
          message.error(`第${invalidiDualUnitNum + 1}行为双单位物品，“辅助数量”数据无效，请检查！`, 3);
          return null;
        }
        const invalidiArrivalDate = _.findIndex(cloneListData, item => !item.arrivalDate);
        if (invalidiArrivalDate >= 0) {
          message.error(`第${invalidiArrivalDate + 1}行“到货日期”数据无效，请检查！`, 3);
          return null;
        }

        const store = _.find(depotList, item => item.id === storeId);
        const storeName = store ? store.name : '';
        const detailsData = {
          status: payload.status,
          storeId,
          storeName,
          remark: '',
          bussDate,
          detailList: _.cloneDeep(cloneListData),
        };
        let saveData = null;
        yield put({
          type: 'mergeData',
          payload: {
            savingStatus: true,
            loadingList: true,
          },
        });
        if (opType === 'create') {
          saveData = yield call(saveDetails, parse(detailsData));
        } else { // 更新时包含ID
          saveData = yield call(updateDetails, Object.assign(parse(detailsData), { id: billId }));
        }
        // console.log("saveDetails data",saveData);
        if (saveData.data.code === '200' && saveData.data.success === true) {
          // setTimeout(savingStatusMessage, 100);
          message.success('操作成功！');
          // yield put({ type: 'changeOpType', opType: 'view' }); // 操作成功后改成浏览模式
          // yield put({ type: 'changePageStatus', pageStatus: payload.status });
          // yield put({ type: 'changeSavingStatus', savingStatus: false });
          // yield put({
          //   type: 'querySuccess',
          //   payload: {
          //     dataSourceIndex: [],
          //   },
          // });
          const savedFields = {
          //  opType: 'view', // 操作成功后改成浏览模式
            pageStatus: payload.status,
            savingStatus: false,
            pageDetail: saveData.data.data.detailList,
            loadingList: false,
          };
          if (saveData.data.data.id) { // 暂存后需要保存请购单的ID，以备继续提交时使用本ID
            savedFields.billId = saveData.data.data.id;
            savedFields.pageStatus = 964; // 暂存后状态变为“待处理”
            savedFields.billInfo = { createUserName: saveData.data.data.createUserName };
          }
          if (pageStatus === 964) {
            savedFields.pageStatus = 965; // 待处理状态下继续保存成“已提交”
          }


          yield put({
            type: 'mergeData',
            payload: savedFields,
          });
          const path = '#/stock/requisition';
          window.location.href = path;
        } else {
          message.warning(`操作失败，请参考：${saveData.data.errorInfo}`, 5);
          // setTimeout(savingStatusMessage, 100);
          yield put({ type: 'changeSavingStatus', savingStatus: false });
        }
      }
      return null;
    },
    * cancelDetailData({ payload }, { put }) {
      const path = '/stock/requisition';
      yield put(routerRedux.push(path));
      // 如果点击请购，请购接口一直未调用，一直在loading状态时，按钮处于灰置状态,此时用户点击返回，再点击新增,按钮状态仍未改变问题。
      yield put({ type: 'changeSavingStatus', savingStatus: false });
    },
    * switchSavingStatus({ payload }, { put }) {
      yield put({ type: 'changeSavingStatus', savingStatus: payload.savingStatus });
    },
    * changeEditingStatus({ payload }, { select, put }) {
      const storeEditableMem = yield select(state => state.requisitionDetailsModule.editableMem);
      const { rowIndex, fieldName, status } = payload;
      storeEditableMem[rowIndex][fieldName] = status;
      yield put({ type: 'setNewEditableMem', editableMem: storeEditableMem });
    },
    * searchTreeList({ payload }, { call, put }) { // 查找物资类别
      // const depotId = yield select(state => state.allotManage.depotId);
      // const storeId = yield select(state => state.allotManage.storeId);
      const data = yield call(findTreeList, parse(payload));
      if (data.data && data.data.success) {
        yield put({
          type: 'gotTreeList',
          foundTreeList: data.data.data,
        });
      } else {
        message.warning(`操作失败，请参考：${data.data.errorInfo}`);
      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/stock/requisition') {
          dispatch({
            type: 'editableMem',
            payload: { dataSource: [] },
          });
          dispatch({
            type: 'saveRequisitionDetails',
            payload: { displaySavingMessage: false },
          });
          // dispatch({
          //   type: 'resetData',
          // });
        }
        const re = pathToRegexp('/stock/requisition/details/:type/:idKye/:storeId');
        const match = re.exec(location.pathname);
        if (match) {
          dispatch({
            type: 'changeSavingStatus',
            savingStatus: false,
          });
          dispatch({
            type: 'editableMem',
            payload: { dataSource: [] },
          });
          // console.log("match",match);
          dispatch({
            type: 'startWithType',
            payload: {
              opType: match[1],
            },
          });
          dispatch({
            type: 'intoModel',
            payload: {
              storeId: match[3],
            },
          });
          if (match[1] === 'create') {
            dispatch({
              type: 'querySuccess',
              payload: {
                bussDate: moment(new Date()),
              },
            });
          }
          if (match[1] === 'view') {
            dispatch({
              type: 'showDetailList',
              payload: {
                id: match[2],
                storeId: match[3],
              },
            });
          } else if (match[1] === 'edit') {
            dispatch({
              type: 'toupdate',
              payload: {
                id: match[2],
                storeId: match[3],
              },
            });
          }
          // dispatch({
          //   type: 'requisitionDetailsModule/showDetailList',
          //   payload: {
          //     opType: match[1],
          //   },
          // });
        }
      });
    },
  },
};
