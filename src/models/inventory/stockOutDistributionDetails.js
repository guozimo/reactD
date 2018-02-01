import { parse } from 'qs';
import { message } from 'antd';
import pathToRegexp from 'path-to-regexp';
import { routerRedux } from 'dva/router';
import _ from 'lodash';
import moment from 'moment';
import { stockOutDistributionDetailsItemModel } from './_common';
import { queryWarehouse, findTreeList } from '../../services/inventory/common';
import { queryDetailList, queryGoodsByString, updStockOut, update } from '../../services/inventory/stockOutDistributionDetails';


const dateFormat = 'YYYY-MM-DD';

export default {
  namespace: 'stockOutDistributionDetails',
  state: {
    loading: false,
    redFlag: {}, // 文字标红的处理集合
    sureModal: false, // 部分出库的弹窗判定
    complexModal: false, // 多重数据累加的弹窗判定
    readyOutDataArray: [], // 部分出库的部分集合
    complexDataArray: [], // 判断多重物品的量是否超出的集合
    storeId: '', // 机构id
    billId: '', // 出库单id
    pageType: '', // 页面类型，新增、编辑、查看
    goodsList: [],
    detailList: [],
    pageDetail: [{ // 可编辑表格内的内容初始化
      // 隐藏字段
      id: null,
      goodsId: null,
      unitId: null,
      dualUnitId: null,
      ordUnitId: null,
      purcUnitId: null,
      applyId: null,
      // 显示字段
      applyBillNo: null,
      goodsCode: null,
      goodsName: null,
      goodsSpec: null,
      ordUnitName: null,
      ordUnitNum: null,
      outNum: null,
      wareNum: null,
      outDualNum: null,
      dualUnitNum: null,
      dualUnitName: null,
      purcUnitNum: null,
      purcUnitName: null,
      unitNum: null,
      unitName: null,
      remarks: null,
    }],
    editableMem: [], // 可编辑表格
    currRemarks: '',
    // user: {},
    savingStatus: false,
    pageStatus: 0, // 本订单的状态，给后台提供用
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
    goodsPopListModel: {},
    queryModalString: '',
    cateId: '',
    findList: [],
    foundTreeList: [],
    dataSourceIndex: [], // 编辑返回几条数据
    delIdsList: [], // 删除数据
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
  reducers: {
    setNewEditableMem(state, action) {
      return { ...state, editableMem: action.editableMem };
    },
    showLoading(state) {
      return { ...state, loading: true };
    },
    hideLoading(state) {
      return { ...state, loading: false };
    },
    // 保存可编辑框的暂存数据
    gotDetailList(state, action) {
      return { ...state, pageDetail: action.pageDetail, loading: false };
    },
    // 字体标红的
    queryRedFlag(state, action) {
      const payloadArray = action.payload;
      const allPayloadArray = state.redFlag;
      allPayloadArray[action.rowIndex] = payloadArray;
      return { ...state, redFlag: allPayloadArray };
    },
    querySuccess(state, action) {
      return { ...state, ...action.payload, loading: false };
    },
  },
  effects: { // Fire an action or action a function here.
    // 跳转过来 执行获取出库详细单功能
    * queryfindUpdate({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      // console.log(payload);
      const data = yield call(update, parse(payload));
      // console.log(data,data.data.data.scmDispatchDetails);


      // console.log('接收到的数据为：', data, data.data.data.scmDispatchOutDetailList);
      if (data.data && data.data.success) {
        const pageDetailNull = data.data.data.scmDispatchDetails;
        // const pageDetailNull = [{
        //   // 隐藏字段
        //   id: 1,
        //   goodsId: null,
        //   unitId: null,
        //   dualUnitId: null,
        //   ordUnitId: null,
        //   purcUnitId: null,
        //   applyId: null,
        //   // 显示字段
        //   applyBillNo: null,
        //   goodsCode: null,
        //   goodsName: '苹果',
        //   goodsSpec: null,
        //   ordUnitName: null,
        //   ordUnitNum: 15,
        //   outNum: 7,
        //   wareNum: null,
        //   outDualNum: null,
        //   dualUnitNum: null,
        //   dualUnitName: null,
        //   purcUnitNum: null,
        //   purcUnitName: null,
        //   unitNum: null,
        //   unitName: null,
        //   remarks: null,
        // }, {
        //   // 隐藏字段
        //   id: 2,
        //   goodsId: null,
        //   unitId: null,
        //   dualUnitId: null,
        //   ordUnitId: null,
        //   purcUnitId: null,
        //   applyId: null,
        //   // 显示字段
        //   applyBillNo: null,
        //   goodsCode: null,
        //   goodsName: '菠萝',
        //   goodsSpec: null,
        //   ordUnitName: null,
        //   ordUnitNum: 10,
        //   outNum: 4,
        //   wareNum: null,
        //   outDualNum: null,
        //   dualUnitNum: null,
        //   dualUnitName: null,
        //   purcUnitNum: null,
        //   purcUnitName: null,
        //   unitNum: null,
        //   unitName: null,
        //   remarks: null,
        // }];
        /**
         * 数据内容的初始化
         * currOutNum 标准 当前出库数
         * currOutDualNum 辅助 当前出库
         */
        if (pageDetailNull != null) {
          for (let i = 0, index = pageDetailNull.length; i < index; i += 1) {
            pageDetailNull[i].currOutNum = parseFloat((pageDetailNull[i].unitNum - pageDetailNull[i].outNum).toFixed(4));
            pageDetailNull[i].currOutDualNum = parseFloat((pageDetailNull[i].dualUnitNum - pageDetailNull[i].outDualNum).toFixed(4));
          }
        }
        // console.log(pageDetailNull);
        yield put({
          type: 'querySuccess',
          payload: {
            findList: data.data.data,
            pageDetail: pageDetailNull,
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
    * showDetailList({ payload }, { call, put }) { // 获取列表
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
            currRemarks: detailInfo.data.data.remarks,
          },
        });
        yield put({
          type: 'editableMem',
          payload: { dataSource: [] },
        });
      }
    },
    * getMonthDate({ payload }, { put }) {
      const monthDate = payload.monthDate;
      yield put({
        type: 'querySuccess',
        payload: {
          monthDate,
        },
      });
    },
    * setBussinessDate({ payload }, { put }) { // 设置出库日期
      yield put({ type: 'setBussDate', bussDate: payload.dateString });
    },
    * queryWarehouse({ payload }, { call, put, select }) {
      yield put({ type: 'showLoading' });
      const data = yield call(queryWarehouse, parse(payload));
      if (data.data && data.data.success) {
        const baseInfoOld = yield select(state => state.stockOutDistributionDetails.baseInfo);
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
    * startWithType({ payload }, { put, select }) { // 改为编辑状态
      yield put({ type: 'changePageType', pageType: payload.pageType });
      const storePageType = yield select(state => state.stockOutDistributionDetails.pageType);
      // console.log("startWithType storeOpType", storeOpType);
      if (storePageType === 'add') {
        const rowsObj = [];
        const emptyItem = _.cloneDeep(stockOutDistributionDetailsItemModel);
        rowsObj.push(emptyItem);
        yield put({ type: 'gotDetailList', pageDetail: rowsObj });
      }
    },
    * resyncListData({ payload }, { put, select }) { // 编辑列表后同步，以在列表中即时显示
      yield put({ type: 'showLoading' });
      const storeListData = yield select(state => state.stockOutDistributionDetails.pageDetail);
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
      const storeEditableMem = yield select(state => state.stockOutDistributionDetails.editableMem);
      const storeListData = yield select(state => state.stockOutDistributionDetails.pageDetail);
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
      const data = yield select(state => state.stockOutDistributionDetails.pageDetail);
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
    * toNextMemByCurr({ payload }, { select, put }) { // 自动换焦点
      const storeEditableMem = yield select(state => state.stockOutDistributionDetails.editableMem);
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
              if (nextRowObj) {
                nextRowObj[itemKeys[0]] = true;
                hasBeenSet = true;
              } else {
                arrivedLastRowIndex = currRowIndex;
              }
            } else {
              // console.log("找到下一个元素，选中？", itemKeys[colIndex + 1],payload.rowIndex,rowIndex);
              let indexCol = colIndex + 1;
              if (payload.isShow && indexCol < itemKeys.length - 1) {
                // console.warn('00000000000000000');
                indexCol += 1;
                // item[itemKeys[colIndex + 1]] = true;
              } else if (payload.isShow) {
                const nextRowObj = storeEditableMem[payload.rowIndex + 1];
                nextRowObj[itemKeys[0]] = true;
              }
              item[itemKeys[indexCol]] = true;
              hasBeenSet = true;
            }
          }
          return null;
        });
        return null;
      });
      if (arrivedLastRowIndex >= 0) { // 添加新行
      //  yield put({ type: 'insertNewListItemAfterIndex', payload: { index: arrivedLastRowIndex } });
      }
      console.log(storeEditableMem);
      yield put({ type: 'setNewEditableMem', editableMem: storeEditableMem });
    },
    * insertNewListItemAfterIndex({ payload }, { select, put }) { // 点击添加行按钮在某一下标下添加一行
      yield put({ type: 'showLoading' });
      const storeListData = yield select(state => state.stockOutDistributionDetails.pageDetail);
      const newPageData = _.cloneDeep(storeListData); // 使用新对象
      const emptyItem = _.cloneDeep(stockOutDistributionDetailsItemModel);
      // console.log(emptyItem);
      emptyItem.id = moment().toISOString(); // 使用时间字符串作为对象，使用new date()对象的话有错
      newPageData.splice(payload.index + 1, 0, emptyItem); // Insert an emptyItem after index to an array
      yield put({ type: 'gotDetailList', pageDetail: newPageData });
      // 重新添加一行mem记录
      const storeEditableMem = yield select(state => state.stockOutDistributionDetails.editableMem);
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
      const storeEditableMem = yield select(state => state.stockOutDistributionDetails.editableMem);
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
      const storeListData = yield select(state => state.stockOutDistributionDetails.pageDetail);
      const pageType = yield select(state => state.stockOutDistributionDetails.pageType);
      const delIdsList = yield select(state => state.stockOutDistributionDetails.delIdsList);
      const dataSourceIndex = yield select(state => state.stockOutDistributionDetails.dataSourceIndex);
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
      if (payload.displaySavingMessage !== false) {
        const { pageDetail } = yield select(state => state.stockOutDistributionDetails);
        const cloneListData = _.cloneDeep(pageDetail);
        // 框变红的校验
        const renderErrorCloneListData = _.cloneDeep(pageDetail);
        for (let i = 0; i < renderErrorCloneListData.length; i += 1) {
          renderErrorCloneListData[i].renderErrorRules = null;
        }
        yield put({ type: 'gotDetailList', pageDetail: renderErrorCloneListData });
        // 进行数据校验
        for (let i = 0, index = cloneListData.length; i < index; i += 1) {
          // if (cloneListData[i].outNum !== cloneListData[i].unitNum && (cloneListData[i].currOutNum == null || Number(cloneListData[i].currOutNum) === 0)) {
          //   message.error(`第${i + 1}行“标准”中的“本次出库数量”数据不能为空或零，请检查！`, 3);
          //   return null;
          // }
          if (cloneListData[i].currOutNum + cloneListData[i].outNum > cloneListData[i].unitNum) {
            message.error(`第${i + 1}行“标准”中的“本次出库数量”+“已出库数量”值大于“订单数量”，请检查!`, 3);
            return null;
          }
          if (cloneListData[i].currOutDualNum > cloneListData[i].dualWareNum) {
            message.error(`第${i + 1}行“辅助”中的“出库数”值大于“库存数量”，请检查!`, 3);
            return null;
          }
          if (cloneListData[i].currOutDualNum > (cloneListData[i].dualUnitNum - cloneListData[i].outDualNum)) {
            message.error(`第${i + 1}行“辅助”中的“出库数”值大于“辅助数量”-“辅助已出库数量”，请检查!`, 3);
            return null;
          }
          if (cloneListData[i].currOutNum > cloneListData[i].wareNum) {
            message.error(`第${i + 1}行“标准”中的“本次出库数量”值大于“库存数量”，请检查!`, 3);
            return null;
          }
        }
        const { findList } = yield select(state => state.stockOutDistributionDetails);
        // ***************************************
        // 出库前组装
        // ***************************************
        // console.log(cloneListData);
        const scmDispatchDetailsPutArray = [];
        for (let i = 0, index = cloneListData.length; i < index; i += 1) {
          scmDispatchDetailsPutArray.push({
            id: cloneListData[i].id,
            currOutNum: cloneListData[i].currOutNum,
            currOutDualNum: cloneListData[i].currOutDualNum,
          });
        }
        const detailsData = {
          id: findList.id,
          //  status: pageStatus,
          // dispatchBillNo: findList.dispatchBillNo,
          // scmDispatchDetails: _.cloneDeep(cloneListData),
          scmDispatchDetails: scmDispatchDetailsPutArray,
        };
        let saveData = null;
        saveData = yield call(updStockOut, detailsData);
        if (saveData.data.code === '200' && saveData.data.success === true) {
          message.success('操作成功！');
          setTimeout(() => {
            // const path = `#/stock/stockOutDistribution/details/view/${storeId}/${saveData.data.data.id}/1`;
            // window.location.href = path;
            const path = '#/stock/stockOutDistribution';
            window.location.href = path;
          }, 150);

          yield put({ type: 'changePageStatus', pageStatus: payload.status });
          yield put({ type: 'changeSavingStatus', savingStatus: false });
          // yield put({ type: 'changePageType', pageType: 'view' }); // 操作成功后改成浏览模式
        } else {
          message.warning(`操作失败，请参考：${saveData.data.errorInfo}`);
          yield put({ type: 'changeSavingStatus', savingStatus: false });
        }
      }
      return null;
    },
    // * updateRedFlag({ payload }, { put }) {
    //   const rowIndexString = `rowIndex${payload.rowIndex}/${payload.types}`;
    //   yield put({
    //     type: 'queryRedFlag',
    //     payload: {
    //       flag: payload.flag,
    //       rowIndex: payload.rowIndex,
    //     },
    //     rowIndex: rowIndexString,
    //   });
    // },
    * resetSearchList({ payload }, { put }) {
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
    * cancelDetailData({ payload }, { put }) {
      const path = '/stock/stockOutDistribution';
      yield put(routerRedux.push(path));
    },
    * changeEditingStatus({ payload }, { select, put }) {
      const storeEditableMem = yield select(state => state.stockOutDistributionDetails.editableMem);
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
    * updateSureModal({ payload }, { put }) {
      yield put({
        type: 'querySuccess',
        payload: {
          sureModal: payload,
        },
      });
    },
    * updateComplexModal({ payload }, { put }) {
      yield put({
        type: 'querySuccess',
        payload: {
          complexModal: payload,
        },
      });
    },
    * updateReadyOutDataArraynow({ payload }, { put }) {
      yield put({
        type: 'querySuccess',
        payload: {
          readyOutDataArray: payload,
        },
      });
    },
    * updateComplexDataArraynow({ payload }, { put }) {
      yield put({
        type: 'querySuccess',
        payload: {
          complexDataArray: payload,
        },
      });
    },
    // * test({ payload }, { select, put }) {
    //   // console.log("if you se e  me>?????");
    //   const { storeId } = yield select(state => state.stockOutDistribution);
    //   console.log(storeId);
    //   yield put({
    //     type: 'queryfindUpdate',
    //     payload: {
    //       // id,
    //       // distribId: storeId,
    //       // status: statusNumber,
    //     },
    //   });
    // },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        const pathname = location.pathname;
        if (location.pathname.lastIndexOf('/stock/stockOutDistribution/details') === -1) {
          dispatch({
            type: 'saveStockOutDetails',
            payload: { displaySavingMessage: false },
          });
        }
        const re = pathToRegexp('/stock/stockOutDistribution/details/:itemId/:storeId/:id/:status');
        const match = re.exec(pathname);
        // console.warn(match);
        if (match) {
          const pageType = match[1];
          const storeId = match[2];
          const id = match[3] === '0' ? '' : match[3];
          const statusNumber = match[4];
          dispatch({
            type: 'editableMem',
            payload: { pageDetail: [] },
          });
          // dispatch({
          //   type: 'test',
          //   payload: {},
          // });
          if (pageType === 'view' || pageType === 'edit') {
            dispatch({
              type: 'queryfindUpdate',
              payload: {
                id,
                distribId: storeId,
                status: statusNumber,
              },
            });
          }
          dispatch({
            type: 'querySuccess',
            payload: {
              id,
              storeId,
              pageType,
              pageStatus: statusNumber,
              pageDetail: [],
            },
          });
        }
      });
    },
  },
};
