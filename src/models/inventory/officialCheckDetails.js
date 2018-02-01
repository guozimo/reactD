import { parse } from 'qs';
import { message } from 'antd';
import _ from 'lodash';
import moment from 'moment';
import { routerRedux } from 'dva/router';
import { getDetailList, getDetailListByCheckType, queryGoodsByString, saveDetails, updateDetails } from '../../services/inventory/officialCheckDetails';
import { officialCheckDetailsItemModel } from './_common';
import { queryGoodsID, findTreeList } from '../../services/inventory/common';

export default {
  namespace: 'officialCheckDetailsModule',
  state: {
    storeId: '',
    orgId: '',
    billNo: '',
    billId: '',
    billInfo: {},
    checkTypes: '943',
    currRemarks: '',
    reposId: '',
    opType: 'view', // create, edit, view
    user: {},
    loadingList: false,
    pageDetail: [{
      id: 1,
      storeId: '',
      storeName: null,
      createUser: null,
      createUserName: null,
      createTime: null,
      updateUser: null,
      updateTime: null,
      deleteFlag: 1,
      tenantId: null,
      tenName: null,
      queryString: null,
      isSystem: 1,
      orgType: null,
      delIds: null,
      delIdsList: null,
      page: 0,
      rows: 0,
      orderProperty: null,
      orderDirection: null,
      storeIds: null,
      depotCode: '',
      depotName: '',
      maxInoutDate: null,
      maxCheckDate: null,
      status: 1,
      remarks: null,
      defaultDepot: 0,
      distribId: null,
      dualGoodsQty: '',
      checkQty: '',
      accQty: '',
      dualAccQty: '',
      wareQty: '',
      unitName: '',
      goodsPrice: '',
      checkUnitName: '',
      profitPrice: '',
    }],
    pageNewDetail: [{
      id: 1,
      storeId: '',
      storeName: null,
      createUser: null,
      createUserName: null,
      createTime: null,
      updateUser: null,
      updateTime: null,
      deleteFlag: 1,
      tenantId: null,
      tenName: null,
      queryString: null,
      isSystem: 1,
      orgType: null,
      delIds: null,
      delIdsList: null,
      page: 0,
      rows: 0,
      orderProperty: null,
      orderDirection: null,
      storeIds: null,
      depotCode: '',
      depotName: '',
      maxInoutDate: null,
      maxCheckDate: null,
      status: 1,
      remarks: null,
      defaultDepot: 0,
      distribId: null,
      dualGoodsQty: '',
      checkQty: '',
      accQty: '',
      dualAccQty: '',
      wareQty: '',
      unitName: '',
      goodsPrice: '',
      checkUnitName: '',
      profitPrice: '',
    }],
    editableMem: [],
    pageStatus: 0,
    goodsList: [],
    bussDate: moment(new Date()).format('YYYY-MM-DD'),
    savingStatus: false,
    queryModalString: '',
    foundTreeList: [],
    dataSourceIndex: [],
    delIdsList: [], // 编辑时删除一条，需要给后台传递的字段

    goodsPopListModel: {},
    cateId: '',
    depotId: '',
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
    hideLoading(state) {
      return { ...state, loadingList: false };
    },
    showLoading(state) {
      return { ...state, loadingList: true };
    },
    // gotDetailList(state, action) {
    //   return { ...state, pageDetail: action.pageDetail, pageStatus: action.pageStatus, checkTypes: action.checkTypes, loadingList: false };
    // },
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
      if (action.billId) {
        return { ...state, billId: action.billId };
      }
      return { ...state };
    },
    gotGoodsData(state, action) { // 初始模块值
      return { ...state, goodsPopListModel: action.goodsPopListModel, popupListPagination: action.listPagination };
    },
    setBillInfo(state, action) {
      if (action.billInfo) {
        return { ...state, billInfo: action.billInfo };
      }
      return { ...state };
    },
    gotTreeList(state, action) {
      return { ...state, foundTreeList: action.foundTreeList };
    },
    saveCateId(state, action) {
      // console.log("saveCateId action", action);
      return { ...state, cateId: action.payload.cateId || '' };
    },
    saveTypes(state, action) {
      // console.log("saveTypes action", action.payload.checkTypes, action.payload.checkTypes || '', 'end');
      return { ...state, checkTypes: action.payload.checkTypes || '' };
    },
    saveRemarks(state, action) {
      return { ...state, currRemarks: action.payload.remarks || '' };
    },
    setReposId(state, action) {
      return { ...state, reposId: action.reposId };
    },
    setOrgId(state, action) {
      return { ...state, orgId: action.orgId };
    },
    setReposList(state, action) {
      return { ...state, reposList: action.reposList };
    },
  },
  effects: { // Fire an action or action a function here.
    // * intoModel({ payload }, { call, put }) { // 进入详情页
    //   const user = yield call(getCurrUser, parse(payload));
    //   if (user) {
    //     yield put({ type: 'gotUser', user: user.data });
    //   }
    //   yield put({ type: 'initModule', payload });
    // },
    * getPopListData({ payload }, { select, call, put }) {
      const { popupListPagination, cateId, queryModalString, reposId } = yield select(state => state.officialCheckDetailsModule);
      const { orgId } = yield select(state => state.officialCheckModule);
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
          depotId: reposId,
          cateId: thisCateId,
          storeId: orgId,
          status: '1', // 后端要求
          page: pageNo, // 查看第几页内容 默认1
          rows: pageSize, // 一页展示条数 默认10
          queryString, // 查询条件
        };
      } else {
        reqParams = {
          depotId: reposId,
          storeId: orgId,
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
      yield put({ type: 'searchTreeList', payload: { type: 0 } });
    },
    * showDetailList({ payload }, { select, call, put }) { // 获取列表
      // 查看、编辑时有点击行的id和整行数据，记录
      yield put({ type: 'setBillId', billId: payload.id });
      yield put({ type: 'setBillInfo', billInfo: payload.record }); // 暂存当前选择的盘点单信息

      yield put({ type: 'showLoading' });
      const billInfo = yield select(state => state.officialCheckDetailsModule.billInfo);
      const detailInfo = yield call(getDetailList, { id: billInfo.id });
      // const reposList = yield select(state => state.officialCheckModule.reposList);
      // console.log('showDetailList detailInfo', detailInfo);
      const rowItem = payload.editableRowObj;
      if (detailInfo.data.code === '200') {
        const tableData = detailInfo.data.data.detailList;

        // 重要算法：根据传递过来的编辑参考列，先生成“编辑参照表”，后设置表格数据；规避在没有参考表时，设置了数据自动生成“编辑参照表”的性能问题！
        if (rowItem) {
          const newMems = tableData.map(() => {
            const item = _.cloneDeep(rowItem);
            // if (row.dualUnitFlag === 1) { // 1：双单位：0：普通单位。
            //   // 双单位行，不允许编辑双单位的“辅助实盘数”
            //   delete item.dualGoodsQty;
            // }
            return item;
          });
          // 重新保存成“编辑参照表”
          // console.log('showDetailList newMems', JSON.stringify(newMems));
          yield put({ type: 'setNewEditableMem', editableMem: newMems });
        }

        yield put({
          type: 'mergeData',
          payload: {
            pageDetail: tableData,
            dataSourceIndex: _.cloneDeep(tableData),
            pageStatus: detailInfo.data.data.status,
            checkTypes: detailInfo.data.data.checkMode,
            currRemarks: detailInfo.data.data.remarks,
            orgId: detailInfo.data.data.storeId,
            reposId: detailInfo.data.data.depotId,
            loadingList: false,
          },
        });
        yield put({
          type: 'editableMem',
          payload: { dataSource: [] },
        });
      }
    },
    * showDetailListByType({ payload }, { select, call, put }) { // 获取列表
      yield put({ type: 'showLoading' });
      const { checkTypes, opType, reposId } = yield select(state => state.officialCheckDetailsModule);
      const { orgId } = yield select(state => state.officialCheckModule);
      const obj = {
        checkMode: checkTypes, // 接口要求月盘时此参数传递空字符串或不传
        depotId: reposId,
        storeId: orgId,
        loadDataType: 'auto',
      };

      // if (!checkTypes) {
      //   yield put({ type: 'saveTypes', payload: { checkTypes: '943' } }); // 不选择盘点类型时默认月盘
      //   message.info('正在为您显示默认月盘类型数据');
      //   yield null;
      // }
      const detailInfo = yield call(getDetailListByCheckType, obj);
      const rowItem = payload.editableRowObj;
      if (detailInfo.data.code === '200') {
        yield put({ // 先清空表格数据，否则会引起编辑其他盘点类型的数据时，刚才编辑盘点类型的数据覆盖当前数据的情况
          type: 'mergeData',
          payload: { pageDetail: [] },
        });
        const tableData = _.cloneDeep(detailInfo.data.data.page.data);

        // 重要算法：根据传递过来的编辑参考列，先生成“编辑参照表”，后设置表格数据；规避在没有参考表时，设置了数据自动生成“编辑参照表”的性能问题！
        if (rowItem) {
          const newMems = tableData.map(() => {
            const item = _.cloneDeep(rowItem);
            // if (row.dualUnitFlag === 1) { // 1：双单位：0：普通单位。
            //   // 双单位行，不允许编辑双单位的“辅助实盘数”
            //   delete item.dualGoodsQty;
            // }
            return item;
          });
          // 重新保存成“编辑参照表”
          // console.log('showDetailListByType newMems', JSON.stringify(newMems));
          yield put({ type: 'setNewEditableMem', editableMem: newMems });
        }
        // console.log("000000000000000000000000000tableData",tableData);
        if (opType === 'create') {
          tableData.map((item) => {
            item.dualAccQty = item.dualWareQty;
            if (parseInt(item.dualUnitFlag, 10) === 1) { // 双单位物资不用显示辅助实盘数
              item.dualGoodsQty = item.dualWareQty;
            }
            // item.dualUnitName =item.dualUnitName
            // item.dualGoodsQty = item.dualWareQty;
            item.checkQty = item.wareQty;
            item.accQty = item.wareQty;
            item.checkUnitName = item.unitName;
            item.profitPrice = item.goodsPrice;
            return item;
          });
        }
        yield put({
          type: 'mergeData',
          payload: { pageDetail: tableData, loadingList: false },
        });
      }
    },
    * startWithType({ payload }, { put, select }) { // 改为编辑状态
      yield put({ type: 'changeOpType', opType: payload.opType });
      const storeOpType = yield select(state => state.officialCheckDetailsModule.opType);
      // console.log("startWithType storeOpType", storeOpType);
      if (storeOpType === 'create') {
        const rowsObj = [];
        const emptyItem = _.cloneDeep(officialCheckDetailsItemModel);
        rowsObj.push(emptyItem);
        yield put({ type: 'mergeData', payload: { pageDetail: rowsObj } });
      }
    },
    * resetData({ payload }, { put }) {
      // console.log('resetData newMems', JSON.stringify(new Array(0)));
      yield put({ type: 'setNewEditableMem', editableMem: new Array(0) }); // 删掉原来的mem，每次重新计算
      yield put({ type: 'resetDetailList', pageDetail: new Array(0) }); // 删掉原来的列表数据以防止列表生成men表时计算错误
    },
    * resyncListData({ payload }, { put, select }) { // 编辑列表后同步，以在列表中即时显示
      const storeListData = yield select(state => state.officialCheckDetailsModule.pageDetail);
      const newPageData = _.cloneDeep(storeListData); // 使用新对象
      // let newData = payload.listData;
      yield put({ type: 'mergeData', payload: { pageDetail: newPageData } });
    },
    * getGoodsListByTyping({ payload }, { put }) { // 根据用户输入的内容查询物品列表
      yield put({ type: 'showLoading' });
      // console.log('获取列表goes here!')
      // 更新goodsList
    },
    * syncMemFields({ payload }, { put, select }) { // 初始化可编辑列
      const storeEditableMem = _.cloneDeep(yield select(state => state.officialCheckDetailsModule.editableMem));
      const storeListData = yield select(state => state.officialCheckDetailsModule.pageDetail);
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
      // if (payload.opName === 'remove') { // 维护双单位物资的不允许编辑字段
      //   delete storeEditableMem[payload.index][fieldName];
      // }
      // console.log('storeEditableMem', storeEditableMem);
      // console.log('syncMemFields newMems', JSON.stringify(storeEditableMem));
      yield put({ type: 'setNewEditableMem', editableMem: storeEditableMem });
    },
    * editableMem({ payload }, { put, select }) { // 初始化数据
      // const data = yield select(state => state.supplyOrder.dataSource);
      const data = yield select(state => state.officialCheckDetailsModule.pageDetail);
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
    * queryGoodsCoding({ payload }, { call, put, select }) { // 查询物资
      yield put({ type: 'showLoading' });
      const data = yield call(queryGoodsByString, parse(payload));
      const { reposId } = yield select(state => state.officialCheckDetailsModule);
      const { orgId } = yield select(state => state.officialCheckModule);
      const storeId = orgId || payload.orgId;
      const depotId = reposId || payload.reposId;
      if (data.data && data.data.success) {
        yield put({
          type: 'mergeData',
          payload: {
            storeId,
            depotId,
            goodsList: data.data.data.data,
            loadingList: false,
          },
        });
      } else {
        message.warning(`操作失败，请参考：${data.data.errorInfo}`);
        yield put({ type: 'hideLoading' });
      }
    },
    * syncSeletedItemIntoList({ payload }, { select, put }) { // 将选择的物资对象合并到表格对象中
      yield put({ type: 'showLoading' });
      const storeListData = yield select(state => state.officialCheckDetailsModule.pageDetail);
      const newPageData = _.cloneDeep(storeListData); // 使用新对象
      const selectedObjs = _.cloneDeep(payload.selectedObjs); // 使用新对象
      // console.log('22222222222payload.selectedObjs', payload.selectedObjs);
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
      // console.log('333333333333333after newPageData=>', newPageData);
      yield put({ type: 'mergeData', payload: { pageDetail: newPageData, loadingList: false } });

      const storeEditableMem = yield select(state => state.officialCheckDetailsModule.editableMem);
      storeEditableMem[payload.index][payload.fieldName] = false;
      // console.log('syncSeletedItemIntoList newMems', JSON.stringify(storeEditableMem));
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
      // console.warn("333333333333333333333333333isModal",payload.isModal);
      if (payload.isModal) {
        yield put({
          type: 'editableMem',
          payload: { dataSource: [] },
        });
      }
    },
    * toNextMemByCurr({ payload }, { select, put }) { // 自动换焦点
      // console.log('toNextMemByCurr！', JSON.stringify(payload))
      const storeEditableMem = yield select(state => state.officialCheckDetailsModule.editableMem);
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
            const targetIndex = colIndex + payload.crossOverColsCount;
            if (colIndex === itemKeys.length - 1 || targetIndex >= itemKeys.length) {
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
      // console.log('toNextMemByCurr newMems', JSON.stringify(storeEditableMem));
      yield put({ type: 'setNewEditableMem', editableMem: storeEditableMem });
      // if (arrivedLastRowIndex >= 0) { // 启用编辑项
      //   yield put({ type: 'toNextMemByCurr', payload: { rowIndex: arrivedLastRowIndex } });
      // }
    },
    * toggleMemStatus({ payload }, { select, put }) { // 指控其他所有的焦点状态
      // rowIndex, fieldName
      const storeEditableMem = yield select(state => state.officialCheckDetailsModule.editableMem);
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
      // console.log('toggleMemStatus newMems', JSON.stringify(storeEditableMem));
      yield put({ type: 'setNewEditableMem', editableMem: storeEditableMem });
    },
    * updateEditableMem() {
      // const storeEditableMem = yield select(state => state.officialCheckDetailsModule.editableMem);
      yield null;
    },
    * insertNewListItemAfterIndex({ payload }, { select, put }) { // 点击添加行按钮在某一下标下添加一行
      const { reposId, pageDetail, editableMem } = yield select(state => state.officialCheckDetailsModule);
      if (!reposId) {
        message.error('请选择盘点仓库！');
        yield false;
      }
      yield put({ type: 'showLoading' });
      const newPageData = _.cloneDeep(pageDetail); // 使用新对象
      const emptyItem = _.cloneDeep(officialCheckDetailsItemModel);
      emptyItem.id = moment().toISOString(); // 使用时间字符串作为对象，使用new date()对象的话有错
      newPageData.splice(payload.index + 1, 0, emptyItem); // Insert an emptyItem after index to an array
      yield put({ type: 'mergeData', payload: { pageDetail: newPageData, loadingList: false } });

      // 重新添加一行mem记录
      const tempRow = _.cloneDeep(editableMem[0]);
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

      editableMem.splice(payload.index + 1, 0, tempRow); // Insert an emptyItem after index to an array
      // console.log('insertNewListItemAfterIndex newMems', JSON.stringify(editableMem));
      yield put({ type: 'setNewEditableMem', editableMem });
      yield put({ type: 'toggleMemStatus', payload: { rowIndex: payload.index + 1, fieldName: tempRowKeys[0] } });
    },
    * removeListItemAtIndex({ payload }, { select, put }) { // 点击添加行按钮在某一下标下添加一行
      yield put({ type: 'showLoading' });
      const { pageDetail, dataSourceIndex, opType, delIdsList } = yield select(state => state.officialCheckDetailsModule);
      // console.log("22222222222222222payload",payload.deltId);
      if (opType === 'edit') {
        const isRemove = _.find(dataSourceIndex, newDate => newDate.id === pageDetail[payload.index].id);
        if (isRemove) {
          delIdsList.push(isRemove.id);
          yield put({ type: 'querySuccess', payload: { delIdsList } });
        }
      }
      const newPageData = _.cloneDeep(pageDetail); // 使用新对象
      newPageData.splice(payload.index, 1); // remove 1 item at index from an array javascript
      yield put({ type: 'mergeData', payload: { pageDetail: newPageData, loadingList: false } });
    },
    * setBussinessDate({ payload }, { select, put }) { // 设置要货日期
      const storeListData = yield select(state => state.officialCheckDetailsModule.pageDetail);
      // console.log('storeListData', storeListData);
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
    * saveOfficialCheckDetails({ payload }, { call, put, select }) { // 根据状态保存详细信息
      // const savingStatusMessage = message.loading('正在保存，请稍候……', 0);
      if (payload.displaySavingMessage !== false) {
        const { orgId } = yield select(state => state.officialCheckModule);
        const { currRemarks, billId, dataSourceIndex, delIdsList, opType, pageDetail, reposId, reposList, checkTypes } = yield select(state => state.officialCheckDetailsModule);
        if (!reposId) {
          message.error('请选择盘点仓库！');
          return null;
        }

        const newPageDetail = pageDetail.filter(item => item.goodsCode);
        // console.log("newPageDetail", newPageDetail);
        const cloneListData = _.cloneDeep(newPageDetail);
        if (!cloneListData.length) {
          message.error('第一行物资编码不能为空');
          return false;
        }
        // console.warn(cloneListData);
        cloneListData.map((item) => {
          if (opType !== 'edit') {
            item.goodsId = item.id; // 只有在创建时候必须加工 goodsId 是 id
            // console.log(item.id, )
          }
          // 当在编辑时，新加一条数据，移除id
          if (opType === 'edit') {
            const isRemove = _.find(dataSourceIndex, newDate => newDate.id === item.id);
            if (!isRemove) {
              delete item.id;
            }
          }
          delete item.createTime; // 不需要手动保存创建时间
          delete item.updateTime;
          delete item.updateUser;
          delete item.deleteFlag;

          if (opType === 'create') {
            delete item.id;
            item.checkUnitName = item.unitName; // 只有在创建时候必须加工 checkUnitName 是 unitName
          }
          return null;
        });
        // console.warn('cloneListData', JSON.stringify(cloneListData));
        // 编辑列{ goodsCode: false, dualGoodsQty: false, checkQty: false, remarks: false }
        const invalidiGoodsCode = _.findIndex(cloneListData, item => !item.goodsCode);
        if (invalidiGoodsCode >= 0) {
          message.error(`第${invalidiGoodsCode + 1}行“物品编码”数据无效，请检查！`, 5);
          return null;
        }
        const invalidiCheckQty = _.findIndex(cloneListData, item => (!(item.checkQty === 0) && !item.checkQty));
        if (invalidiCheckQty >= 0) {
          message.error(`第${invalidiCheckQty + 1}行“标准实盘”数据无效，请检查！`, 5);
          return null;
        }
        const invalidiDualGoodsQty = _.findIndex(cloneListData, item => !(item.dualGoodsQty === 0) && !item.dualGoodsQty && item.dualUnitFlag === 1);
        if (invalidiDualGoodsQty >= 0) {
          message.error(`第${invalidiDualGoodsQty + 1}行为双单位物品，“辅助实盘”数据无效，请检查！`, 5);
          return null;
        }

        const currRepos = _.find(reposList, item => item.id === reposId);
        const reposName = currRepos && currRepos.depotName;
        // const store = _.find(depotList, item => item.id === storeId);
        // const storeName = store ? store.name : '';
        const detailsData = {
          bussDate: moment().format('YYYY-MM-DD'),
          depotId: reposId,
          depotName: reposName || '',
          checkMode: checkTypes || '943',
          remarks: currRemarks,
          status: payload.status,
          storeId: orgId,
          delIdsList,
          detailList: _.cloneDeep(cloneListData),
        };
        // console.log("11111111111111111111111111cloneListData",cloneListData,"detailsData",detailsData);
        yield put({ type: 'changeSavingStatus', savingStatus: true });
        let saveData = null;
        if (opType === 'create') {
          saveData = yield call(saveDetails, parse(detailsData));
        } else { // 更新时包含ID
          saveData = yield call(updateDetails, Object.assign(parse(detailsData), { id: billId }));
        }
        // console.log("saveDetails data",saveData,saveData.data.code,saveData.data.success,saveData.data.code === 200 && saveData.data.success === true);
        if (saveData.data.code === '200' && saveData.data.success === true) {
          message.success('操作成功！');
          // yield put({ type: 'changeOpType', opType: 'view' }); // 操作成功后改成浏览模式
          const pageNewDetail = yield select(state => state.officialCheckDetailsModule.pageNewDetail);
          const path = '/stock/officialCheck';
          yield put({
            type: 'mergeData',
            payload: {
              pageDetail: _.cloneDeep(pageNewDetail),
              currRemarks: '',
            },
          });
          yield put(routerRedux.push(path));
          yield put({
            type: 'officialCheckModule/getList', // getOrderLibByFilter
            payload: {},
          });
          yield put({
            type: 'mergeData',
            payload: {
              checkTypes: '943',
              reposId: '',
              remarks: '',
              bussDate: moment(new Date()).format('YYYY-MM-DD'),
            },
          }); // 操作成功后改成浏览模式
          yield put({ type: 'changePageStatus', pageStatus: payload.status });
          yield put({ type: 'changeSavingStatus', savingStatus: false });
        } else {
          message.warning(`操作失败，请参考：${saveData.data.errorInfo}`, 5);
          // setTimeout(savingStatusMessage, 100);
          yield put({ type: 'changeSavingStatus', savingStatus: false });
        }
      }
      return null;
    },
    * cancelDetailData({ payload }, { put, select }) {
      const pageNewDetail = yield select(state => state.officialCheckDetailsModule.pageNewDetail);
      const path = '/stock/officialCheck';
      yield put({
        type: 'mergeData',
        payload: {
          pageDetail: _.cloneDeep(pageNewDetail),
          currRemarks: '',
        },
      });
      yield put(routerRedux.push(path));
    },
    * switchSavingStatus({ payload }, { put }) {
      yield put({ type: 'changeSavingStatus', savingStatus: payload.savingStatus });
    },
    * changeEditingStatus({ payload }, { select, put }) {
      const storeEditableMem = yield select(state => state.officialCheckDetailsModule.editableMem);
      const { rowIndex, fieldName, status } = payload;
      storeEditableMem[rowIndex][fieldName] = status;
      // console.log('changeEditingStatus newMems', JSON.stringify(storeEditableMem));
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
    * saveReposId({ payload }, { put }) {
      yield put({
        type: 'setReposId',
        reposId: payload.reposId,
      });
    },
    * saveOrgId({ payload }, { put }) {
      yield put({
        type: 'setOrgId',
        orgId: payload.orgId,
      });
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/stock/officialCheck') {
          dispatch({
            type: 'saveOfficialCheckDetails',
            payload: { displaySavingMessage: false },
          });
          // dispatch({
          //   type: 'resetData',
          // });
        }
        if (location.pathname === '/stock/officialCheck/details') {
          // console.log('location.pathname',location.pathname);
          dispatch({
            type: 'editableMem',
            payload: { dataSource: [] },
          });
          // dispatch({
          //   type: 'findTreeList',
          //   payload: { type: 0 },
          // });
        }
      });
    },
  },
};
