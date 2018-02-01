import { parse } from 'qs';
import { message } from 'antd';
import _ from 'lodash';
import moment from 'moment';
import pathToRegexp from 'path-to-regexp';
import { routerRedux } from 'dva/router';
import { getCurrUser, getDetailList, saveDetails, updateDetails, queryGoodsForPriceList,
  findTreeListForPriceList } from '../../services/inventory/priceListDetails';
import { priceListDetailsItemModel } from './_common';
import { queryOrg } from '../../services/inventory/common';

export default {
  namespace: 'priceListDetailsModule',
  state: {
    storeId: '',
    billNo: '',
    billId: '',
    billInfo: {},
    dataSourceIndex: [],
    opType: 'view', // create, edit, view
    user: {},
    loadingList: false,
    selectedReposes: [],
    selectedOrg: {},
    storeListOfOrg: [],
    delGoodsIdList: [],
    confilictionRows: [],
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
    bussDate: moment(new Date()).format('YYYY-MM-DD'),
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
    billStatus: {},
  },
  reducers: { // Update above state.
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
      return { ...state, pageDetail: action.pageDetail, pageStatus: action.pageStatus, loadingList: false };
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
    * intoModel({ payload }, { call, put, select }) { // 进入详情页
      const { opType } = yield select(state => state.priceListDetailsModule);
      if (opType !== 'edit') {
        const user = yield call(getCurrUser, parse(payload));
        if (user) {
          yield put({ type: 'gotUser', user: user.data });
        }
      }
      yield put({ type: 'mergeData', payload });
    },
    * getPopListData({ payload }, { select, call, put }) {
      const { popupListPagination, cateId, queryModalString } = yield select(state => state.priceListDetailsModule);
      const { orgId } = yield select(state => state.priceListModule);
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
          storeId: orgId,
          status: '1', // 后端要求
          page: pageNo, // 查看第几页内容 默认1
          rows: pageSize, // 一页展示条数 默认10
          queryString, // 查询条件
        };
      } else {
        reqParams = {
          storeId: orgId,
          status: '1', // 后端要求
          page: pageNo, // 查看第几页内容 默认1
          rows: pageSize, // 一页展示条数 默认10}
          queryString, // 查询条件
        };
      }
      const goodsData = yield call(queryGoodsForPriceList, parse(reqParams));
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
    * showDetailList({ payload }, { select, call, put }) { // 获取列表
      console.log('payload.record.opType', payload.opType);
      const { billStatus } = yield select(state => state.priceListModule);
      const detailInfo = yield call(getDetailList, { id: payload.id, opType: payload.opType === 'view' ? 1 : 2 });
      // yield put({ type: 'setBillId', billId: payload.record.id });
      if (payload.opType !== 'view') {
        // 编辑状态要重置已删除列表
        yield put({
          type: 'mergeData',
          payload: {
            // clonedList: [],
            delGoodsIdList: [],
          },
        });
      }
      yield put({ type: 'showLoading' });
      let newBillInfo = null;
      // console.log("detailInfo", detailInfo);
      if (detailInfo.data.code === '200') {
        newBillInfo = Object.assign({}, {
          id: detailInfo.data.data.id,
          billNo: detailInfo.data.data.billNo,
          storeIdList: detailInfo.data.data.alcStoreList,
          createTime: detailInfo.data.data.createTime,
          updateTime: detailInfo.data.data.updateTime,
          createUserName: detailInfo.data.data.createUserName,
          updateUserName: detailInfo.data.data.updateUserName,
        });

        const selectedReposes = detailInfo.data.data.alcStoreList && detailInfo.data.data.alcStoreList.map(item => ({ reposCode: item.code, reposName: item.name }));
        const newSourceItem = detailInfo.data.data.detailList;

        yield put({
          type: 'mergeData',
          payload: {
            selectedOrg: { id: detailInfo.data.data.orgInfoId, name: detailInfo.data.data.orgInfoName },
            billId: payload.id,
            billStatus,
            selectedReposes, // 已选择门店列表
            billInfo: newBillInfo,
            dataSourceIndex: _.cloneDeep(newSourceItem),
            pageDetail: newSourceItem,
            // clonedList: _.cloneDeep(newSourceItem),
            pageStatus: detailInfo.data.data.status,
            loadingList: false,
          },
        }); // 暂存当前选择的直运单信息

        yield put({
          type: 'editableMem',
          payload: { dataSource: detailInfo.data.data.detailList },
        });
      }
    },
    * startWithType({ payload }, { put, call, select }) { // 改为编辑状态
      yield put({ type: 'changeOpType', opType: payload.opType });
      const { opType } = yield select(state => state.priceListDetailsModule);
      const { orgId } = yield select(state => state.priceListModule);
      console.log('startWithType opType, orgId', opType, orgId);
      // console.log("startWithType storeOpType", storeOpType);
      if (opType === 'create') {
        const rowsObj = [];
        const emptyItem = _.cloneDeep(priceListDetailsItemModel);
        rowsObj.push(emptyItem);
        // console.log("rowsObj",rowsObj);
        yield put({ type: 'mergeData', payload: { pageDetail: rowsObj, loadingList: false, selectedReposes: [] } });
        yield put({
          type: 'editableMem',
          payload: { pageDetail: [] },
        });
      }

      if ((opType === 'edit' || opType === 'create') && orgId) { // 新建和编辑时需要获取当前机构下所有可用的门店
        yield put({ type: 'saveOrgId', orgId });
        const data = yield call(queryOrg, {
          distribId: orgId,
          orgType: 1, // orgType:1 门店 2:总部
        });
        if (data.data && data.data.success) {
          yield put({
            type: 'mergeData',
            payload: {
              storeListOfOrg: data.data.data.aclStoreList,
              weatherListOfOrg: data.data.data.weatherList,
              eventListOfOrg: data.data.data.holidaysList,
            },
          });
        }
      }
    },
    * setSelectedStoreList({ payload }, { put }) {
      yield put({ type: 'mergeData',
        payload: {
          selectedReposes: payload.storeList,
        },
      });
    },
    * setSelectedOrg({ payload }, { put, select }) {
      // 设置当前选择的机构，search.jsx 调用
      const orgList = yield select(state => state.priceListModule.orgList);
      const selectedOrg = _.find(orgList, item => item.id === payload.distribId);
      yield put({
        type: 'mergeData',
        payload: {
          selectedOrg,
        },
      });
    },
    * setSelectedStore({ payload }, { put }) {
      // 设置当前选择的门店
      const selectedStore = payload.storeList;
      yield put({
        type: 'mergeData',
        payload: {
          selectedStore,
        },
      });
    },


    // * resetData({ payload }, { put }) {
    //   yield put({ type: 'setNewEditableMem', editableMem: new Array(0) }); // 删掉原来的mem，每次重新计算
    //   yield put({ type: 'resetDetailList', pageDetail: new Array(0) }); // 删掉原来的列表数据以防止列表生成men表时计算错误
    // },
    * resyncListData({ payload }, { put, select }) { // 编辑列表后同步，以在列表中即时显示
      yield put({ type: 'showLoading' });
      const storeListData = yield select(state => state.priceListDetailsModule.pageDetail);
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
      const storeEditableMem = yield select(state => state.priceListDetailsModule.editableMem);
      const storeListData = yield select(state => state.priceListDetailsModule.pageDetail);
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
      const data = yield select(state => state.priceListDetailsModule.pageDetail);
      // const data = yield select(state => state.priceListDetailsModule.editableMem);
      // const data = _.cloneDeep([cannManageItemModel]);
      // console.log("我是editableMem测试数据data",data);
      const editableMemData = Array(data.length);
      for (let i = 0; i < data.length; i += 1) {
        // console.warn("i",i,"editableMemData[i]",editableMemData,"_.cloneDeep({})", _.cloneDeep({}));
        editableMemData[i] = _.cloneDeep({});
      }
      // console.log("我是初始化数据", editableMemData);
      yield put({ type: 'querySuccess', payload: { editableMem: editableMemData } });
    },
    * queryGoodsCoding({ payload }, { select, call, put }) { // 查询物资
      yield put({ type: 'showLoading' });
      const { orgId } = yield select(state => state.priceListModule);
      const data = yield call(queryGoodsForPriceList, {
        storeId: orgId,
        status: '1', // 后端要求
        page: 1, // 查看第几页内容 默认1
        rows: 20, // 一页展示条数 默认10
        queryString: payload.queryString, // 查询条件
      });
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
      const storeListData = yield select(state => state.priceListDetailsModule.pageDetail);
      const newPageData = _.cloneDeep(storeListData); // 使用新对象
      const selectedObjs = _.cloneDeep(payload.selectedObjs); // 使用新对象
      let newDelGoodsIdList = yield select(state => state.priceListDetailsModule.delGoodsIdList);
      // console.log('syncSeletedItemIntoList newDelGoodsIdList', newDelGoodsIdList);
      // console.log('selectedObjs=>', JSON.stringify(selectedObjs));
      // console.log('newPageData=>', JSON.stringify(newPageData));
      selectedObjs.map((item) => { item.goodsId = item.id; return null; });
      // console.log('syncSeletedItemIntoList selectedObjs', selectedObjs);
      // console.log('selectedObjs', ...selectedObjs);
      newPageData.splice(payload.index + 1, 0, ...selectedObjs); // Insert selectedObjs to newPageData at payload.index

      const removedItem = _.cloneDeep(_.pullAt(newPageData, payload.index)); // remove 1 item at index from an array javascript
      if (removedItem[0].createUser) { // 编辑的物资有createUser，替换掉本条时需要标记为删除
        newDelGoodsIdList = _.union(newDelGoodsIdList, removedItem);
      }
      // newPageData.splice(payload.index, 1); // Remove the old item at index

      _.pullAllBy(newDelGoodsIdList, selectedObjs, 'id'); // 再次添加物资的话需要把删除列表中的对应项目移除（标记为没删除）
      // console.log('pullAllBy newDelGoodsIdList', newDelGoodsIdList);
      // Object.assign(
      //   newPageData[payload.index],
      //   selectedObjs,
      //   {goodsId: selectedObj.id, id:''} // 更新goodsId，新增的也要去掉id
      // );
      // console.log('after newPageData=>', JSON.stringify(newPageData));
      yield put({ type: 'gotDetailList', pageDetail: newPageData });

      const storeEditableMem = yield select(state => state.priceListDetailsModule.editableMem);
      storeEditableMem[payload.index][payload.fieldName] = false;
      yield put({ type: 'setNewEditableMem', editableMem: storeEditableMem });
      yield put({ type: 'querySuccess',
        payload: {
          cateId: '',
          delGoodsIdList: newDelGoodsIdList,
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
    * toNextMemByCurr({ payload }, { select, put }) { // 自动换焦点
      // console.log('toNextMemByCurr！', JSON.stringify(payload))
      const storeEditableMem = yield select(state => state.priceListDetailsModule.editableMem);
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
      const storeEditableMem = yield select(state => state.priceListDetailsModule.editableMem);
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
      // const storeEditableMem = yield select(state => state.priceListDetailsModule.editableMem);
      yield null;
    },
    * insertNewListItemAfterIndex({ payload }, { select, put }) { // 点击添加行按钮在某一下标下添加一行
      yield put({ type: 'showLoading' });
      const storeListData = yield select(state => state.priceListDetailsModule.pageDetail);
      const newPageData = _.cloneDeep(storeListData); // 使用新对象
      const emptyItem = _.cloneDeep(priceListDetailsItemModel);
      emptyItem.id = moment().toISOString(); // 使用时间字符串作为对象，使用new date()对象的话有错
      newPageData.splice(payload.index + 1, 0, emptyItem); // Insert an emptyItem after index to an array
      yield put({ type: 'gotDetailList', pageDetail: newPageData });

      // 重新添加一行mem记录
      const storeEditableMem = yield select(state => state.priceListDetailsModule.editableMem);
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
      const storeListData = yield select(state => state.priceListDetailsModule.pageDetail);
      const editableMem = yield select(state => state.priceListDetailsModule.editableMem);
      const newPageData = _.cloneDeep(storeListData); // 使用新对象
      const newEditableMem = _.cloneDeep(editableMem); // 使用新对象
      const newDelGoodsIdList = yield select(state => state.priceListDetailsModule.delGoodsIdList);
      const removedItem = _.pullAt(newPageData, payload.index); // remove 1 item at index from an array javascript
      console.log('removeListItemAtIndex newDelGoodsIdList, removedItem', newDelGoodsIdList, removedItem);
      const unionDelGoodsIdList = removedItem[0].goodsId ? _.union(newDelGoodsIdList, removedItem) : newDelGoodsIdList;
      console.log('removeListItemAtIndex unionDelGoodsIdList', unionDelGoodsIdList);
      newEditableMem.splice(payload.index, 1); // remove 1 item at index from an array javascript
      // console.warn("newEditableMem", newEditableMem);
      yield put({ type: 'mergeData', payload: { pageDetail: newPageData, editableMem: newEditableMem, delGoodsIdList: unionDelGoodsIdList, loadingList: false } });
    },
    * deleteAGoodsItem({ payload }, { select, put }) { // 修改时间后标记为删除
      // console.log("deleteAGoodsItem!");
      const newDelGoodsIdList = yield select(state => state.priceListDetailsModule.delGoodsIdList);
      const removedItem = payload.item;
      // console.log("newDelGoodsIdList, removedItem", newDelGoodsIdList, removedItem);
      const itemIndex = _.findIndex(newDelGoodsIdList, item => item.goodsId === removedItem.goodsId);
      // console.log("itemIndex", itemIndex);
      if (itemIndex > -1) {
        yield false;
      }
      const unionDelGoodsIdList = removedItem.goodsId ? _.union(newDelGoodsIdList, [removedItem]) : newDelGoodsIdList;
      // console.log("unionDelGoodsIdList", unionDelGoodsIdList);
      // console.warn("newEditableMem", newEditableMem);
      yield put({ type: 'mergeData', payload: { delGoodsIdList: unionDelGoodsIdList } });
    },
    * setBussinessDate({ payload }, { select, put }) { // 设置要货日期
      const storeListData = yield select(state => state.priceListDetailsModule.pageDetail);
      const invalidateRowIndex = _.findIndex(storeListData, (item) => { // 验证请购日期和到货日期
        if (item.arrivalDate) {
          return moment(item.arrivalDate).isBefore(moment(payload.dateString));
        }
        return false;
      });
      if (invalidateRowIndex + 1) {
        message.error(`第${invalidateRowIndex + 1}行到货日期不允许超出您要设置的请购日期，请修改！`, 5);
      } else {
        yield put({ type: 'setBussDate', bussDate: payload.dateString });
      }
    },
    * savePriceListDetails({ payload }, { call, put, select }) { // 根据状态保存详细信息
      // const savingStatusMessage = message.loading('正在保存，请稍候……', 0);
      if (payload.displaySavingMessage !== false) {
        const { orgId } = yield select(state => state.priceListModule);
        const { opType, pageDetail, pageStatus, selectedReposes, storeListOfOrg, billInfo, delGoodsIdList } = yield select(state => state.priceListDetailsModule);

        const cloneListData = _.cloneDeep(pageDetail);
        if (selectedReposes.length === 0) {
          message.error('您还没有选择配送门店，请检查！', 5);
          return null;
        }
        const selectedResposObj = _.filter(storeListOfOrg, item => _.findIndex(selectedReposes, selItem => item.code === selItem.reposCode) > -1);
        const selectedResposIds = selectedResposObj.map(item => item.id);
        const deletedResposIds = _.difference(billInfo.storeIdList ? billInfo.storeIdList.map(item => item.id) : [], selectedResposIds);
        // 编辑列{ goodsCode: false, dualGoodsQty: false, checkQty: false, remarks: false }
        // const invalidiGoodsCode = _.findIndex(cloneListData, item => !item.goodsCode);
        // if (invalidiGoodsCode >= 0) {
        //   message.error(`第${invalidiGoodsCode + 1}行“物品编码”数据无效，请检查！`, 5);
        //   return null;
        // }
        const invalidiGoodsPrice = _.findIndex(cloneListData, item => !item.goodsPrice && !!item.goodsCode);
        if (invalidiGoodsPrice >= 0) {
          message.error(`第${invalidiGoodsPrice + 1}行“执行价格”数据无效，请检查！`, 5);
          return null;
        }
        const invalidiDateRange = _.findIndex(cloneListData, item => (!item.startDate || !item.endDate) && !!item.goodsCode);
        if (invalidiDateRange >= 0) {
          message.error(`第${invalidiDateRange + 1}行“执行时间段”数据无效，请检查！`, 5);
          return null;
        }

        let saveData = null;
        yield put({
          type: 'mergeData',
          payload: { savingStatus: true, loadingList: true },
        });
        if (opType === 'create') {
          const newListForCreate = cloneListData.filter(item => item.goodsId).map(item =>
            ({ goodsId: item.goodsId, goodsPrice: item.goodsPrice, startDate: item.startDate, endDate: item.endDate }));
          if (newListForCreate.length === 0) {
            message.error('您没有填写详细信息，请填写后保存！');
            yield put({
              type: 'mergeData',
              payload: { savingStatus: false, loadingList: false },
            });
            yield false;
          }
          const detailsDataForCreate = { orgInfoId: orgId, storeIdList: selectedResposIds, status: payload.status, detailList: _.cloneDeep(newListForCreate) };
          saveData = yield call(saveDetails, parse(detailsDataForCreate));
        } else { // 更新时包含ID
          const newListForEdit = cloneListData.filter(item => item.goodsId).map(item =>
            ({ goodsId: item.goodsId, goodsName: item.goodsName, goodsPrice: item.goodsPrice, startDate: item.startDate, endDate: item.endDate }));
          const delGoodsForEdit = delGoodsIdList
            ? delGoodsIdList.map(item => ({ goodsId: item.goodsId, goodsName: item.goodsName, goodsPrice: item.goodsPrice, startDate: item.startDate, endDate: item.endDate }))
            : [];
          const detailsDataForEdit = {
            id: billInfo.id,
            orgInfoId: orgId,
            storeIdList: selectedResposIds,
            delStoreIdList: deletedResposIds,
            status: payload.status,
            billNo: billInfo.billNo,
            detailList: _.cloneDeep(newListForEdit),
            delGoodsIdList: delGoodsForEdit,
          };
          saveData = yield call(updateDetails, Object.assign(parse(detailsDataForEdit)));
        }
        if (saveData.data.code === '200' && saveData.data.success === true) {
          message.success('操作成功！');
          const savedFields = {
            opType: 'view', // 操作成功后改成浏览模式
            pageStatus: payload.status,
            savingStatus: false,
            pageDetail: saveData.data.data.detailList,
            loadingList: false,
          };
          if (saveData.data.data.id) { // 暂存后需要保存请购单的ID，以备继续提交时使用本ID
            savedFields.billId = saveData.data.data.id;
            savedFields.pageStatus = 961; // 暂存后状态变为“待审核”
            savedFields.billInfo = { createUserName: saveData.data.data.createUserName };
          }
          if (pageStatus === 962) {
            savedFields.pageStatus = 961; // 已审核状态下继续保存成“待审核”
          }

          yield put({
            type: 'mergeData',
            payload: savedFields,
          });
          const path = '/official/price_list';
          yield put(routerRedux.push(path));
        } else {
          yield put({
            type: 'mergeData',
            payload: {
              savingStatus: false,
              loadingList: false,
            },
          });
          const errorInfo = saveData.data.errorInfo;
          if (errorInfo) {
            message.warning(`操作失败，请参考：${errorInfo}`, 5);
          } else if (saveData.data.data.length) {
            yield put({ type: 'mergeData', payload: { confilictionRows: saveData.data.data } });
          }
          yield put({ type: 'changeSavingStatus', savingStatus: false });
        }
      }
      return null;
    },
    * confirmConfilictionRows({ payload }, { put }) {
      yield put({ type: 'mergeData', payload: { confilictionRows: [] } });
    },
    * cancelDetailData({ payload }, { put }) {
      const path = '/official/price_list';
      yield put({
        type: 'mergeData',
        payload: {
          billInfo: {}, // search部分展示的内容
          pageDetail: [], // 列表内容
        },
      });
      yield put(routerRedux.push(path));
    },
    * switchSavingStatus({ payload }, { put }) {
      yield put({ type: 'changeSavingStatus', savingStatus: payload.savingStatus });
    },
    * changeEditingStatus({ payload }, { select, put }) {
      const storeEditableMem = yield select(state => state.priceListDetailsModule.editableMem);
      const { rowIndex, fieldName, status } = payload;
      storeEditableMem[rowIndex][fieldName] = status;
      yield put({ type: 'setNewEditableMem', editableMem: storeEditableMem });
    },
    * searchTreeList({ payload }, { select, call, put }) { // 查找物资类别
      // const depotId = yield select(state => state.allotManage.depotId);
      const { orgId } = yield select(state => state.priceListModule);
      const treeBy = {
        type: payload.type,
        orgInfoId: orgId,
      };
      const data = yield call(findTreeListForPriceList, parse(treeBy));
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
        if (location.pathname === '/official/price_list') {
          dispatch({
            type: 'savePriceListDetails',
            payload: { displaySavingMessage: false },
          });
        }

        const re = pathToRegexp('/official/price_list/:pagetype/:billId/:orgId');
        const match = re.exec(location.pathname);
        if (match) {
          const opType = match[1].replace(/_item/g, '');
          const billId = match[2];
          const orgId = match[3];
          console.log('opType, billId, orgId', opType, billId, orgId);
          // dispatch({
          //   type: 'editableMem',
          //   payload: { pageDetail: [] },
          // });
          dispatch({
            type: 'priceListDetailsModule/showDetailList',
            payload: {
              id: billId,
              opType,
              orgId,
            },
          });
          dispatch({
            type: 'priceListDetailsModule/intoModel',
            payload: {
              orgId,
            },
          });
          dispatch({
            type: 'priceListDetailsModule/startWithType',
            payload: {
              opType,
            },
          });
        }
      });
    },
  },
};
