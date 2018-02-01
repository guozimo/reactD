import { parse } from 'qs';
import { message } from 'antd';
import pathToRegexp from 'path-to-regexp';
import { routerRedux } from 'dva/router';
import _ from 'lodash';
import moment from 'moment';
import { stockOutDetailsItemModel } from './_common';
import { queryWarehouse, queryGoodsID, findTreeList } from '../../services/inventory/common';
import { queryDetailList, queryGoodsByString, addStockOut, updStockOut } from '../../services/inventory/stockOutDetails';


const dateFormat = 'YYYY-MM-DD';

export default {
  namespace: 'stockOutDetailsModule',
  state: {
    loading: false,
    storeId: '', // 机构id
    billId: '', // 出库单id
    pageType: '', // 页面类型，新增、编辑、查看
    goodsList: [],
    detailList: [],
    pageDetail: [{
      id: 1,
      goodsId: null,
      unitId: null,
      dualUnitId: null,
      ordUnitId: null,
      dualUnitFlag: null,
      dualWareQty: null,
      // 显示字段
      goodsCode: null,
      goodsName: null,
      goodsSpec: null,
      dualUnitName: null,
      dualGoodsQty: 0.00,
      unitName: null,
      goodsQty: 0.00,
      unitPrice: 0.00,
      goodsAmt: 0.00,
      remarks: null,
    }],
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
    bussDate: moment(new Date()).format(dateFormat),
    depotId: '',
    depotName: '',
    status: '',
    remarks: '',
    monthDate: moment(new Date()).format(dateFormat), // 月结日期
    baseInfo: { // 基础信息，一些搜索下拉选项之类的
      billTypeAddOrEdit: [
        {
          code: '',
          name: '请选择',
        },
        {
          code: '917',
          name: '报损出库',
        },
        {
          code: '919',
          name: '其他出库',
        },
      ],
      billTypeView: [
        {
          code: '',
          name: '请选择',
        },
        {
          code: '917',
          name: '报损出库',
        },
        {
          code: '919',
          name: '其他出库',
        },
        {
          code: '922',
          name: '调拨出库',
        },
        {
          code: '916',
          name: '消耗出库',
        },
        {
          code: '915',
          name: '盘亏出库',
        },
        {
          code: '939',
          name: '配送出库',
        },
      ],
      warehouse: [],
      // supplier: [],
    },
    goodsPopListModel: {},
    queryModalString: '',
    cateId: '',
    foundTreeList: [],
    dataSourceIndex: [], // 编辑返回几条数据
    delIdsList: [], // 删除数据
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
    gotGoodsData(state, action) { // 初始模块值
      return { ...state, goodsPopListModel: action.goodsPopListModel, popupListPagination: action.popupListPagination };
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
    gotTreeList(state, action) {
      return { ...state, foundTreeList: action.foundTreeList };
    },
    saveCateId(state, action) {
      // console.log("saveCateId action", action);
      return { ...state, cateId: action.payload.cateId || '' };
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
    * showDetailList({ payload }, { call, put }) { // 根据url传过来的id，storeId获取列表
      const detailInfo = yield call(queryDetailList, parse(payload));
      yield put({ type: 'setBillId', billId: payload.id });
      yield put({ type: 'setBillInfo', billInfo: payload.record }); // 暂存当前选择的出库单信息
      yield put({ type: 'showLoading' });
      // console.log("detailInfo",detailInfo,detailInfo.data.data.results.detailList);
      if (detailInfo.data.code === '200') {
        const updateDataSource = detailInfo.data.data.results.detailList;
        // console.warn("updateDataSource",updateDataSource);
        yield put({
          type: 'querySuccess',
          payload: {
            pageDetail: updateDataSource,
            pageStatus: detailInfo.data.data.results.status,
            currRemarks: detailInfo.data.data.remarks,
          },
        });
        yield put({
          type: 'editableMem',
          payload: { dataSource: [] },
        });
      }
    },
    * getMonthDate({ payload }, { put }) { // 获取日期
      const monthDate = payload.monthDate;
      yield put({
        type: 'querySuccess',
        payload: {
          monthDate,
        },
      });
    },
    * getPopListData({ payload }, { select, call, put }) { // 物资编码请求物资 第一次显示列表时触发获取数据的方法
      const { popupListPagination, cateId, depotId, id, storeId, queryModalString } = yield select(state => state.stockOutDetailsModule);
      // const { storeId } = yield select(state => state.stockOutModule);
      const pageNo = payload.pageNo || popupListPagination.current;
      const pageSize = payload.pageSize || popupListPagination.pageSize;
      const queryString = payload.queryString || queryModalString;
      let reqParams = {};
      const thisCateId = payload.cateId || cateId;
      if (thisCateId) {
        reqParams = {
          id,
          storeId,
          depotId,
          cateId: thisCateId,
          status: '1', // 后端要求
          page: pageNo, // 查看第几页内容 默认1
          rows: pageSize, // 一页展示条数 默认10
          queryString,
        };
      } else {
        reqParams = {
          id,
          storeId,
          depotId,
          status: '1', // 后端要求
          page: pageNo, // 查看第几页内容 默认1
          rows: pageSize, // 一页展示条数 默认10}
          queryString,
        };
      }
      const goodsData = yield call(queryGoodsID, parse(reqParams));
      if (goodsData && goodsData.data) {
        yield put({ type: 'querySuccess',
          payload: {
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
    * queryBillList({ payload }, { call, put }) { // 物资数据 点击查看或调单
      message.destroy();
      yield put({ type: 'showLoading' });
      yield put({ type: 'setBillId', billId: payload.id });
      yield put({ type: 'setBillInfo', billInfo: payload.record }); // 暂存当前选择的出库单信息
      const data = yield call(queryDetailList, parse(payload));
      const detailList = _.cloneDeep(data.data.data.detailList);
      if (data.data && data.data.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            pageDetail: data.data.data.detailList,
            dataSourceIndex: detailList,
            id: data.data.data.id,
            billType: String(data.data.data.billType),
            // busiId: data.data.data.busiId,
            // busiName: data.data.data.busiName,
            bussDate: data.data.data.bussDate,
            depotId: data.data.data.depotId,
            depotName: data.data.data.depotName,
            status: data.data.data.status,
            remarks: data.data.data.remarks,
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
    * setBussinessDate({ payload }, { put }) { // 设置出库日期
      yield put({ type: 'setBussDate', bussDate: payload.dateString });
    },
    * queryWarehouse({ payload }, { call, put, select }) { // 请求仓库
      yield put({ type: 'showLoading' });
      const data = yield call(queryWarehouse, parse(payload));
      if (data.data && data.data.success) {
        const baseInfoOld = yield select(state => state.stockOutDetailsModule.baseInfo);
        const houseList = data.data.data.page.data;
        houseList.unshift({ id: '', depotName: '请选择' });
        yield put({
          type: 'querySuccess',
          payload: {
            baseInfo: { ...baseInfoOld, warehouse: houseList },
          },
        });
      } else {
        message.warning(`操作失败，请参考：${data.data.errorInfo}`);
        yield put({ type: 'hideLoading' });
      }
    },
    // * querySupplier({ payload }, { call, put, select }) {
    //   message.destroy();
    //   const data = yield call(querySupplier, parse(payload));
    //   if (data.data && data.data.success) {
    //     const baseInfoOld = yield select(state => state.stockOutDetailsModule.baseInfo);
    //     const suppliers = data.data.data.page.data;
    //     suppliers.unshift({ id: '', suppName: '请选择' });
    //     yield put({
    //       type: 'querySuccess',
    //       payload: {
    //         baseInfo: { ...baseInfoOld, supplier: suppliers },
    //       },
    //     });
    //   } else {
    //     message.warning(`操作失败，请参考：${data.data.errorInfo}`);
    //     yield put({ type: 'hideLoading' });
    //   }
    // },
    * startWithType({ payload }, { put, select }) { // 改为编辑状态
      yield put({ type: 'changePageType', pageType: payload.pageType });
      const storePageType = yield select(state => state.stockOutDetailsModule.pageType);
      // console.log("startWithType storeOpType", storeOpType);
      if (storePageType === 'add') {
        const rowsObj = [];
        const emptyItem = _.cloneDeep(stockOutDetailsItemModel);
        rowsObj.push(emptyItem);
        yield put({ type: 'gotDetailList', pageDetail: rowsObj });
      }
    },
    * resyncListData({ payload }, { put, select }) { // 编辑列表后同步，以在列表中即时显示
      yield put({ type: 'showLoading' });
      const storeListData = yield select(state => state.stockOutDetailsModule.pageDetail);
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
      const storeEditableMem = yield select(state => state.stockOutDetailsModule.editableMem);
      const storeListData = yield select(state => state.stockOutDetailsModule.pageDetail);
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
      const data = yield select(state => state.stockOutDetailsModule.pageDetail);
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
      const data = yield call(queryGoodsByString, parse(payload)); // 物资的接口不清楚
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
      const { pageDetail, dataSourceIndex, delIdsList } = yield select(state => state.stockOutDetailsModule);
      const newPageData = _.cloneDeep(pageDetail); // 使用新对象
      const selectedObjs = _.cloneDeep(payload.selectedObjs); // 使用新对象
      selectedObjs.map((item) => { item.goodsId = item.id; return null; });
      // console.log('selectedObjs', ...selectedObjs);
      const isRemove = _.find(dataSourceIndex, newData => newData.id === newPageData[payload.index].id);
      if (isRemove) {
        delIdsList.push(isRemove.id);
        yield put({ type: 'querySuccess', payload: { delIdsList } });
      }
      newPageData.splice(payload.index + 1, 0, ...selectedObjs); // Insert selectedObjs to newPageData at payload.index
      newPageData.splice(payload.index, 1); // Remove the old item at index
      // Object.assign(
      //   newPageData[payload.index],
      //   selectedObjs,
      //   {goodsId: selectedObj.id, id:''} // 更新goodsId，新增的也要去掉id
      // );
      // console.log('after newPageData=>', JSON.stringify(newPageData));
      yield put({ type: 'gotDetailList', pageDetail: newPageData });

      const storeEditableMem = yield select(state => state.stockOutDetailsModule.editableMem);
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
    },
    * toNextMemByCurr({ payload }, { select, put }) { // 自动换焦点
      // console.log('toNextMemByCurr！', JSON.stringify(payload))
      const storeEditableMem = yield select(state => state.stockOutDetailsModule.editableMem);
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
              let indexCol = colIndex + 1;
              if (payload.isShow) {
                // console.warn('00000000000000000');
                indexCol += 1;
                // item[itemKeys[colIndex + 1]] = true;
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
      if (arrivedLastRowIndex >= 0) { // 添加新行
        yield put({ type: 'insertNewListItemAfterIndex', payload: { index: arrivedLastRowIndex } });
      }
      // console.log('storeEditableMem', JSON.stringify(storeEditableMem));
      yield put({ type: 'setNewEditableMem', editableMem: storeEditableMem });
      // if (arrivedLastRowIndex >= 0) { // 启用编辑项
      //   yield put({ type: 'toNextMemByCurr', payload: { rowIndex: arrivedLastRowIndex } });
      // }
    },
    * insertNewListItemAfterIndex({ payload }, { select, put }) { // 点击添加行按钮在某一下标下添加一行
      yield put({ type: 'showLoading' });
      const storeListData = yield select(state => state.stockOutDetailsModule.pageDetail);
      const newPageData = _.cloneDeep(storeListData); // 使用新对象
      const emptyItem = _.cloneDeep(stockOutDetailsItemModel);
      emptyItem.id = moment().toISOString(); // 使用时间字符串作为对象，使用new date()对象的话有错
      newPageData.splice(payload.index + 1, 0, emptyItem); // Insert an emptyItem after index to an array
      yield put({ type: 'gotDetailList', pageDetail: newPageData });
      // console.log("我来判断是否走了");
      // 重新添加一行mem记录
      const storeEditableMem = yield select(state => state.stockOutDetailsModule.editableMem);
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
    * toggleMemStatus({ payload }, { select, put }) { // 指控其他所有的焦点状态
      // rowIndex, fieldName
      const storeEditableMem = yield select(state => state.stockOutDetailsModule.editableMem);
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
    * removeListItemAtIndex({ payload }, { select, put }) { // 删除某一行
      yield put({ type: 'showLoading' });
      const storeListData = yield select(state => state.stockOutDetailsModule.pageDetail);
      const pageType = yield select(state => state.stockOutDetailsModule.pageType);
      const delIdsList = yield select(state => state.stockOutDetailsModule.delIdsList);
      const dataSourceIndex = yield select(state => state.stockOutDetailsModule.dataSourceIndex);
      if (pageType === 'edit') {
        const isRemove = _.find(dataSourceIndex, newDate => newDate.id === storeListData[payload.index].id);
        if (isRemove) {
          delIdsList.push(isRemove.id);
          yield put({ type: 'querySuccess', payload: { delIdsList } });
        }
      }
      // console.warn('----------payload.deltId', payload.deltId, '----------------delIdsList', delIdsList);
      const newPageData = _.cloneDeep(storeListData); // 使用新对象
      newPageData.splice(payload.index, 1); // remove 1 item at index from an array javascript
      yield put({ type: 'gotDetailList', pageDetail: newPageData });
    },
    * saveStockOutDetails({ payload }, { call, put, select }) { // 根据状态保存详细信息
      // const savingStatusMessage = message.loading('正在保存，请稍候……', 0);
      if (payload.displaySavingMessage !== false) {
        const { currRemarks, pageDetail, pageType, dataSourceIndex } = yield select(state => state.stockOutDetailsModule);
        // 校验单元格变红
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
        const invalidGoodsCode = _.findIndex(cloneListData, item => !item.goodsCode);
        if (invalidGoodsCode >= 0) {
          message.error(`第${invalidGoodsCode + 1}行“物品编码”数据无效，请检查！`, 5);
          return null;
        }
        const invalidGoodsQty = _.findIndex(cloneListData, item => !item.goodsQty || Number(item.goodsQty) === 0);
        if (invalidGoodsQty >= 0) {
          message.error(`第${invalidGoodsQty + 1}行“数量”数据不能为空或零，请检查！`, 5);
          return null;
        }
        const invalidWareQty = _.findIndex(cloneListData, item => Number(item.wareQty) < Number(item.goodsQty));
        if (invalidWareQty >= 0) {
          message.error(`第${invalidWareQty + 1}行“数量”不能大于库存数量，请检查！`, 5);
          return null;
        }
        const invalidDualUnitName = _.findIndex(cloneListData, item => item.dualUnitName && (!item.dualGoodsQty));
        if (invalidDualUnitName >= 0) {
          message.error(`第${invalidDualUnitName + 1}行是双单位物资，“辅助数量”数据无效，请检查！`, 5);
          return null;
        }
        const invalidDualWareQty = _.findIndex(cloneListData, item => (item.dualUnitName && Number(item.dualWareQty) < Number(item.dualGoodsQty)));
        if (invalidDualWareQty >= 0) {
          message.error(`第${invalidDualWareQty + 1}行是双单位物资，“辅助数量”不能大于“辅助库存数量”，请检查！`, 5);
          return null;
        }
        cloneListData.map((item) => {
          if (pageType === 'add') {
            delete item.id;
          }
          if (pageType === 'edit') {
            const isRemove = _.find(dataSourceIndex, newDate => newDate.id === item.id);
            if (!isRemove) {
              delete item.id;
            }
          }

          // delete item.id;
          // delete item.createTime; // 不需要手动保存创建时间
          // delete item.updateTime;
          // delete item.updateUser;
          // delete item.deleteFlag;
          return null;
        });
        const { id, storeId, depotId, billType, baseInfo, depotName, delIdsList } = yield select(state => state.stockOutDetailsModule);
        const storePageType = pageType;
        // const billTypeList = yield select(state => state.stockOutModule.stockOutTypeList);
        const depotList = _.find(baseInfo.warehouse, item => item.id === depotId);
        const wareHouseName = depotName || depotList.depotName;
        // const busiList = _.find(baseInfo.supplier, item => item.id === busiId);
        // const suppName = busiName || busiList.suppName;
        // const storeName = store ? store.name : '';
        // const depotList = _.find(pageDetail, newDate => newDate.id === item.id);
        const bussDate = yield select(state => state.stockOutDetailsModule.bussDate);
        const detailsData = {
          status: payload.status,
          storeId,
          billType,
          depotId,
          depotName: wareHouseName,
          // busiId,
          // busiName: suppName,
          delIdsList,
          bussDate,
          remarks: currRemarks,
          detailList: _.cloneDeep(cloneListData),
        };
        yield put({ type: 'changeSavingStatus', savingStatus: true });
        // const storeBillId = yield select(state => state.stockOutDetailsModule);
        const storeBillId = id;
        let saveData = null;
        if (storePageType === 'add') {
          saveData = yield call(addStockOut, parse(detailsData));
        } else { // 更新时包含ID
          saveData = yield call(updStockOut, Object.assign(parse(detailsData), { id: storeBillId }));
        }
        // console.log("saveDetails data",saveData,saveData.data.code,saveData.data.success,saveData.data.code === 200 && saveData.data.success === true);
        if (saveData.data.code === '200' && saveData.data.success === true) {
          message.success('操作成功！');
          // 只改变页面状态(pageType) 备注不会带过去 使用跳转到查看页的方式 需要加setTimeOut
          // const path = `#/stock/stockOut/details/view/${storeId}/${saveData.data.data.id}`;
          const path = '#/stock/stockOut';
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
    * resetSearchList({ payload }, { put }) { // 重置搜索条件列表
      yield put({
        type: 'querySuccess',
        payload: {
          billType: '',
          depotId: '',
          depotName: '',
          bussDate: moment(),
          // busiId: '',
          // busiName: '',
          currRemarks: '',
        },
      });
    },
    * cancelDetailData({ payload }, { put }) { // 点击取消/返回按钮
      const path = '/stock/stockOut';
      yield put(routerRedux.push(path));
    },
    * changeEditingStatus({ payload }, { select, put }) { // 编辑完到货日期后，表格改为非编辑状态
      const storeEditableMem = yield select(state => state.stockOutDetailsModule.editableMem);
      const { rowIndex, fieldName, status } = payload;
      storeEditableMem[rowIndex][fieldName] = status;
      yield put({ type: 'setNewEditableMem', editableMem: storeEditableMem });
    },
    * searchTreeList({ payload }, { call, put }) { // 查找物资类别
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
    // * resetData({ payload }, { put }) {
    //   yield put({ type: 'setNewEditableMem', editableMem: new Array(0) }); // 删掉原来的mem，每次重新计算
    //   yield put({ type: 'resetDetailList', pageDetail: new Array(0) }); // 删掉原来的列表数据以防止列表生成men表时计算错误
    // },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        const pathname = location.pathname;
        if (location.pathname.lastIndexOf('/stock/stockOut/details') === -1) {
          dispatch({
            type: 'saveStockOutDetails',
            payload: { displaySavingMessage: false },
          });
          // dispatch({
          //   type: 'resetData',
          // });
        }
        const re = pathToRegexp('/stock/stockOut/details/:itemId/:storeId/:id');
        const match = re.exec(pathname);
        // console.warn(match);
        if (match) {
          const pageType = match[1];
          const storeId = match[2];
          const id = match[3] === '0' ? '' : match[3];
          let pageDetail = [];
          dispatch({
            type: 'editableMem',
            payload: { pageDetail: [] },
          });
          if (pageType === 'add') {
            pageDetail = [{
              // 隐藏字段
              id: null,
              goodsId: null,
              unitId: null,
              dualUnitId: null,
              ordUnitId: null,
              dualUnitFlag: null,
              dualWareQty: null,
              // 显示字段
              goodsCode: null,
              goodsName: null,
              goodsSpec: null,
              dualUnitName: null,
              dualGoodsQty: null,
              unitName: null,
              goodsQty: null,
              unitPrice: 0.00,
              goodsAmt: null,
              remarks: null,
            }];
          } else if (pageType === 'view' || pageType === 'edit') {
            dispatch({
              type: 'queryBillList',
              payload: {
                id,
                storeId,
              },
            });
          }
          dispatch({
            type: 'querySuccess',
            payload: {
              id,
              storeId,
              pageType,
              pageDetail,
            },
          });
          dispatch({
            type: 'queryWarehouse',
            payload: {
              storeId,
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
