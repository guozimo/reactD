import { parse } from 'qs';
// import { routerRedux } from 'dva/router';
import { message } from 'antd';
import _ from 'lodash';
import moment from 'moment';
import pathToRegexp from 'path-to-regexp';
import { routerRedux } from 'dva/router';
import { updateForm, queryGoodsByString, addScmTransfer, addForm, updScmTransfer } from '../../services/inventory/cannManage';
import { cannManageItemModel } from './_common';
import { queryGoodsID, queryDepot, findTreeList } from '../../services/inventory/common';

export default {
  namespace: 'cannMangeDetailsModule',
  state: {
    storeId: '',
    billNo: '',
    billId: '',
    // billInfo: {},
    opType: 'view', // create, edit, view
    loadingList: false,
    pageDetail: [{
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
      goodsQty: '',
      wareQty: '',
      unitPrice: '',
      unitPriceNotax: '',
      dualGoodsQty: '',
    }],
    pageNewDetail: [{
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
      goodsQty: '',
      wareQty: '',
      unitPrice: '',
      unitPriceNotax: '',
      dualGoodsQty: '',
    }],
    editableMem: [],
    pageStatus: 0,
    goodsList: [],
    bussDate: moment(new Date()).format('YYYY-MM-DD'),
    savingStatus: false,
    foundTreeList: [],
    depotCannList: [],

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
    outDepotId: '',
    inDepotId: '',
    remarks: '',
    startDate: '',
    dataSourceIndex: [], // 编辑返回几条数据
    delIdsList: [], // 删除数据
    newCannList: [],
    depotInCannList: [],
    fetching: false,
    InFetching: false,
    queryModalString: '',  // modal模糊搜索
    popupListLoading: false,
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
    hideLoading(state) {
      return { ...state, loadingList: false };
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
    mergeData(state, action) {
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
    * addForm({ payload }, { call, put, select }) {
      // console.warn("我倾全力吗");
      const { storeId } = yield select(state => state.cannManage);
      yield put({ type: 'showLoading' });
      let storeIdAll = '';
      if (payload.storeId) {
        storeIdAll = payload.storeId;
      } else {
        storeIdAll = storeId;
      }
      const data = yield call(addForm, parse(Object.assign(payload, { storeId: storeIdAll })));
      if (data.data && data.data.success) {
        // console.log("你好",data.data.data.startDate);
        yield put({
          type: 'querySuccess',
          payload: {
            startDate: data.data.data.startDate,
            // weatherList: data.data.data.aclStoreList,
            // eventList: data.data.data.holidaysList,
          },
        });
      } else {
        message.warning(`操作失败，请参考：${data.data.errorInfo}`);
        yield put({ type: 'hideLoading' });
      }
    },
    * queryDepot({ payload }, { call, put, select }) {
      // console.warn("我倾全力吗");
      yield put({ type: 'showLoading' });
      const { storeId } = yield select(state => state.cannManage);
      let storeIdAll = '';
      if (payload.storeId) {
        storeIdAll = payload.storeId;
      } else {
        storeIdAll = storeId;
      }
      const data = yield call(queryDepot, parse(Object.assign(payload, { storeId: storeIdAll })));
      if (data.data && data.data.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            depotCannList: data.data.data.page.data,
            depotInCannList: data.data.data.page.data,
            // weatherList: data.data.data.aclStoreList,
            // eventList: data.data.data.holidaysList,
          },
        });
      } else {
        message.warning(`操作失败，请参考：${data.data.errorInfo}`);
        yield put({ type: 'hideLoading' });
      }
    },
    * outQueryDepot({ payload }, { call, put, select }) {
      // console.warn("我倾全力吗");
      yield put({ type: 'showLoading' });
      const { storeId } = yield select(state => state.cannManage);
      const data = yield call(queryDepot, parse(Object.assign(payload, { storeId })));
      const busiIdAll = yield select(state => state.cannMangeDetailsModule.newCannList);
      if (data.data && data.data.success) {
        let newShopList = data.data.data.page.data;
        // console.log("busiIdAll",busiIdAll);
        // console.log("newShopList",newShopList);
        if (busiIdAll.length) {
          newShopList = newShopList.concat(busiIdAll);
        }
        if (payload.type === 'out') {
          yield put({
            type: 'querySuccess',
            payload: {
              fetching: false,
              depotCannList: newShopList,
              // weatherList: data.data.data.aclStoreList,
              // eventList: data.data.data.holidaysList,
            },
          });
        } else {
          yield put({
            type: 'querySuccess',
            payload: {
              fetching: false,
              depotInCannList: newShopList,
              // weatherList: data.data.data.aclStoreList,
              // eventList: data.data.data.holidaysList,
            },
          });
        }
      } else {
        message.warning(`操作失败，请参考：${data.data.errorInfo}`);
        yield put({ type: 'hideLoading' });
      }
    },
    * getPopListData({ payload }, { select, call, put }) {
      const { popupListPagination, cateId, outDepotId, queryModalString } = yield select(state => state.cannMangeDetailsModule);
      const { storeId } = yield select(state => state.cannManage);
      const pageNo = payload.pageNo || popupListPagination.current;
      const pageSize = payload.pageSize || popupListPagination.pageSize;
      const queryString = payload.queryString || queryModalString;
      yield put({ type: 'mergeData', payload: { popupListLoading: true } });
      let reqParams = {};
      const thisCateId = payload.cateId || cateId;
      if (thisCateId) {
        reqParams = {
          cateId: thisCateId,
          depotId: outDepotId,
          storeId,
          status: '1', // 后端要求
          page: pageNo, // 查看第几页内容 默认1
          rows: pageSize, // 一页展示条数 默认10
          queryString,
        };
      } else {
        reqParams = {
          storeId,
          depotId: outDepotId,
          status: '1', // 后端要求
          page: pageNo, // 查看第几页内容 默认1
          rows: pageSize, // 一页展示条数 默认10}
          queryString,
        };
      }
      const goodsData = yield call(queryGoodsID, parse(reqParams));
      if (goodsData && goodsData.data) {
        // console.warn("goodsData", goodsData.data.data.totalCount);
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
      const data = yield call(updateForm, parse(payload));
      yield put({ type: 'setBillId', billId: payload.id });
      // yield put({ type: 'setBillInfo', billInfo: payload.record }); // 暂存当前选择的直运单信息
      // yield put({ type: 'showLoading' });
      // console.log("detailInfo",detailInfo,detailInfo.data.data.results.detailList);
      // if (detailInfo.data.code === '200') {
      //   yield put({ type: 'gotDetailList', pageDetail: detailInfo.data.data.results.detailList, pageStatus: detailInfo.data.data.results.status });
      // }
      if (data.data && data.data.success) {
        if (data.data.data.detailList.length !== 0) {
          const scmList = _.cloneDeep(data.data.data.detailList);
          const updateDataSource = [];
          scmList.map((rowItem, index) => {
            // let goodsPrice = '';
            // if (rowItem.lastPrice) {
            //   goodsPrice = rowItem.lastPrice;
            // } else {
            // 辅助价格（双单位）
            // const goodsPrice = rowItem.unitPrice;
            // if (!rowItem.goodsPrice) { // 当没有物资价格时 物资价格 = 含税价（unitPrice）
            //   rowItem.goodsPrice = rowItem.unitPrice;
            // } else { // 不含税价（unitPrice）
            //   if (rowItem.lastPrice) {
            //     rowItem.unitPrice = rowItem.lastPrice;
            //   } else {
            //     rowItem.unitPrice = rowItem.goodsPrice;
            //   }
            // }
            // }
            // 不含税单价（unitPriceNotax） = 含税单价(goodsPrice) / (1 + 税率(taxRatio) )；
            const unitPriceNotax = rowItem.unitPrice / (1 + Number(rowItem.taxRatio));
            // console.log("unitPriceNotax",unitPriceNotax,"rowItem.unitPrice / (1 + Number(rowItem.taxRatio))",rowItem.unitPrice / (1 + Number(rowItem.taxRatio)));
            // goodsAmtNotax 不含税金额 公式：不含税金额 = 不含税单价(unitPriceNotax)*采购数量(ordUnitNum)
            const goodsAmtNotax = (rowItem.goodsQty ? rowItem.goodsQty * (unitPriceNotax || 0) : 0);
            // 不含税金额
            // const goodsAmtNotax = (rowItem.goodsQty ? rowItem.goodsQty * goodsPrice : 0); // 含税入库价 goodsPrice 含税金额 goodsAmtNotax
            // console.log(
            //   "rowItem.goodsAmtNotax含税金额",rowItem.goodsAmtNotax,
            //   "rowItem.taxRatio税率",rowItem.taxRatio,
            //   "rowItem.goodsPrice含税价",rowItem.goodsPrice,Number(rowItem.taxRatio),
            //   "总结",rowItem.goodsPrice/(1+rowItem.taxRatio)
            // );
            // let unitPrice = '';
            // if (rowItem.lastPrice) {
            //   unitPrice = rowItem.lastPrice;
            // } else {
            //   unitPrice = rowItem.goodsPrice;
            // }
            // rowItem.unitPrice = (rowItem.goodsQty ? (rowItem.goodsPrice / (1 + Number(rowItem.taxRatio))).toFixed(2) : 0); // 不含税价 unitPrice 含税入库价 goodsPrice/1+税率 taxRatio
            const goodsTaxAmt = (rowItem.goodsQty ? rowItem.goodsQty * rowItem.unitPrice * rowItem.taxRatio : 0); // 税额 goodsTaxAmt 数量*含税入库价*税率 taxRatio
            const goodsAmt = (rowItem.goodsQty ? rowItem.goodsQty * (rowItem.unitPrice || 1) : 0); // 不含税金额 goodsAmt 不含税价*入库数量

            const newSourceItem = Object.assign({}, rowItem, { goodsAmt, goodsAmtNotax, unitPriceNotax, goodsTaxAmt, key: index + 1 });
            // console.log("2222222222222newSourceItem",newSourceItem);
            updateDataSource.push(newSourceItem);
            return updateDataSource;
          });
          // console.warn("-----------updateDataSource",updateDataSource);
          yield put({
            type: 'querySuccess',
            payload: {
              dataSourceIndex: _.cloneDeep(updateDataSource),
              pageDetail: updateDataSource,
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
    * startWithType({ payload }, { put, select }) { // 改为编辑状态
      // console.log('startWithType!');
      yield put({ type: 'changeOpType', opType: payload.opType });
      const storeOpType = yield select(state => state.cannMangeDetailsModule.opType);
      // console.log("startWithType storeOpType", storeOpType);
      if (storeOpType === 'create') {
        const rowsObj = [];
        const emptyItem = _.cloneDeep(cannManageItemModel);
        rowsObj.push(emptyItem);
        yield put({ type: 'gotDetailList', pageDetail: rowsObj });
      }
    },
    * resyncListData({ payload }, { put, select }) { // 编辑列表后同步，以在列表中即时显示
      yield put({ type: 'showLoading' });
      const storeListData = yield select(state => state.cannMangeDetailsModule.pageDetail);
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
      const storeEditableMem = yield select(state => state.cannMangeDetailsModule.editableMem);
      const storeListData = yield select(state => state.cannMangeDetailsModule.pageDetail);
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
      const data = yield select(state => state.cannMangeDetailsModule.pageDetail);
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
      const { outDepotId, inDepotId } = yield select(state => state.cannMangeDetailsModule);
      const { storeId } = yield select(state => state.cannManage);
      // console.warn('outDepotId', outDepotId, 'inDepotId', inDepotId, 'storeId', storeId);
      if (!storeId || !outDepotId) {
        message.error('调出仓库不能为空！');
        return false;
      } else if (!storeId || !inDepotId) {
        message.error('调入仓库不能为空！');
        return false;
      }
      const newPayload = {
        ...payload,
        storeId,
        status: 1,
        depotId: outDepotId,
      };
      // console.log('newPayload', newPayload);
      const data = yield call(queryGoodsByString, parse(newPayload));
      if (data.data && data.data.success) {
        yield put({
          type: 'mergeData',
          payload: {
            goodsList: data.data.data.data,
          },
        });
        yield put({ type: 'hideLoading' });
      } else {
        message.warning(`操作失败，请参考：${data.data.errorInfo}`);
        yield put({ type: 'hideLoading' });
      }
      return null;
    },
    * syncSeletedItemIntoList({ payload }, { select, put }) { // 将选择的物资对象合并到表格对象中
      yield put({ type: 'showLoading' });
      const { pageDetail, dataSourceIndex, delIdsList } = yield select(state => state.cannMangeDetailsModule);
      const newPageData = _.cloneDeep(pageDetail); // 使用新对象
      const selectedObjs = _.cloneDeep(payload.selectedObjs); // 使用新对象
      // console.log('payload.index', payload);
      // console.log('selectedObjs=>', JSON.stringify(selectedObjs));
      // console.log('newPageData=>', JSON.stringify(newPageData));
      // console.log('newPageData[payload.index].id=>', newPageData[payload.index], newPageData[payload.index]);
      selectedObjs.map((item) => { item.goodsId = item.id; return null; });
      // console.log('selectedObjs', ...selectedObjs);   delIdsList.push(payload.deltId);
      // dataSourceIndex.map((item) => {
      //   (newPageData[payload.index].id === item.id) ? (delIdsList.push(item.id)) : '';
      // }
      // )
      //  判断修改数据时，修改的是不是后台传递过来的数据
      const isRemove = _.find(dataSourceIndex, newDate => newDate.id === newPageData[payload.index].id);
      if (isRemove) {
        delIdsList.push(isRemove.id);
        yield put({ type: 'querySuccess', payload: { delIdsList } });
      }
      // console.log("newPageData[payload.index];", newPageData[payload.index],"delIdsList",delIdsList);
      newPageData.splice(payload.index + 1, 0, ...selectedObjs); // Insert selectedObjs to newPageData at payload.index
      newPageData.splice(payload.index, 1); // Remove the old item at index
      // Object.assign(
      //   newPageData[payload.index],
      //   selectedObjs,
      //   {goodsId: selectedObj.id, id:''} // 更新goodsId，新增的也要去掉id
      // );
      // console.log('after newPageData=>', JSON.stringify(newPageData));
      yield put({ type: 'gotDetailList', pageDetail: newPageData });

      const storeEditableMem = yield select(state => state.cannMangeDetailsModule.editableMem);
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
        // console.log("payload.isModal",payload.isModal);
        yield put({
          type: 'editableMem',
          payload: { dataSource: [] },
        });
      }
    },
    * toNextMemByCurr({ payload }, { select, put }) { // 自动换焦点
      // console.log('toNextMemByCurr！', JSON.stringify(payload))
      const storeEditableMem = yield select(state => state.cannMangeDetailsModule.editableMem);
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
          // console.log('toNextMem hasBeenSet', hasBeenSet);
          // console.log("itemVales.map", colIndex , itemKeys.length - 1)
          if (hasBeenSet === false) {
            // console.log("设置为非选中：", itemKeys[colIndex]);
            item[itemKeys[colIndex]] = false;
            if (colIndex === itemKeys.length - 1) {
              const nextRowObj = storeEditableMem[payload.rowIndex + 1];
              // console.log("toNextMem nextRowObj", nextRowObj);
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
            }
          }
          return null;
        });
        return null;
      });
      // console.log('toNextMem arrivedLastRowIndex', arrivedLastRowIndex);
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
      const storeEditableMem = yield select(state => state.cannMangeDetailsModule.editableMem);
      // console.log('rowIndex, fieldName', JSON.stringify(payload));
      console.log('toggleMemStatus', JSON.stringify(storeEditableMem));
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
      // const storeEditableMem = yield select(state => state.cannMangeDetailsModule.editableMem);
      yield null;
    },
    * insertNewListItemAfterIndex({ payload }, { select, put }) { // 点击添加行按钮在某一下标下添加一行
      yield put({ type: 'showLoading' });
      const storeListData = yield select(state => state.cannMangeDetailsModule.pageDetail);
      const newPageData = _.cloneDeep(storeListData); // 使用新对象
      const emptyItem = _.cloneDeep(cannManageItemModel);
      emptyItem.id = moment().toISOString(); // 时间转换为字符串
      newPageData.splice(payload.index + 1, 0, emptyItem); // Insert an emptyItem after index to an array
      // console.log("")
      yield put({ type: 'gotDetailList', pageDetail: newPageData });

      // 重新添加一行mem记录
      const storeEditableMem = yield select(state => state.cannMangeDetailsModule.editableMem);
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
      // console.log('222tempRow', tempRow);
      // console.log('3333storeEditableMem', storeEditableMem);
      // console.log('444444payload.index + 1', payload.index + 1);

      storeEditableMem.splice(payload.index + 1, 0, tempRow); // Insert an emptyItem after index to an array
      yield put({ type: 'setNewEditableMem', editableMem: storeEditableMem });
      yield put({ type: 'toggleMemStatus', payload: { rowIndex: payload.index + 1, fieldName: tempRowKeys[0] } });
    },
    * removeListItemAtIndex({ payload }, { select, put }) { // 点击添加行按钮在某一下标下添加一行
      yield put({ type: 'showLoading' });
      const storeListData = yield select(state => state.cannMangeDetailsModule.pageDetail);
      const dataSourceIndex = yield select(state => state.cannMangeDetailsModule.dataSourceIndex);
      // const editableMem = yield select(state => state.requisitionDetailsModule.editableMem);
      const opType = yield select(state => state.cannMangeDetailsModule.opType);
      const delIdsList = yield select(state => state.cannMangeDetailsModule.delIdsList);
      if (opType === 'edit') {
        const isRemove = _.find(dataSourceIndex, newDate => newDate.id === storeListData[payload.index].id);
        if (isRemove) {
          delIdsList.push(isRemove.id);
          yield put({ type: 'querySuccess', payload: { delIdsList } });
        }
        // delIdsList.push(payload.deltId);
        // yield put({ type: 'querySuccess', payload: { delIdsList } });
      }
      // console.warn('----------payload.deltId', payload.deltId, '----------------delIdsList', delIdsList);
      const newPageData = _.cloneDeep(storeListData); // 使用新对象
      // const newEditableMem = _.cloneDeep(editableMem); // 使用新对象
      newPageData.splice(payload.index, 1); // remove 1 item at index from an array javascript
      // newEditableMem.splice(payload.index, 1); // remove 1 item at index from an array javascript
      yield put({ type: 'querySuccess', payload: { pageDetail: newPageData } });
    },
    * setBussinessDate({ payload }, { select, put }) { // 设置要货日期
      const storeListData = yield select(state => state.cannMangeDetailsModule.pageDetail);
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
        yield put({ type: 'querySuccess', payload: { bussDate: payload.dateString } });
      }
    },
    * saveRequisitionDetails({ payload }, { call, put, select }) { // 根据状态保存详细信息
      // const savingStatusMessage = message.loading('正在保存，请稍候……', 0);
      if (payload.displaySavingMessage !== false) {
        const { pageDetail, opType, dataSourceIndex, delIdsList } = yield select(state => state.cannMangeDetailsModule);
        // console.log("pageDetail",pageDetail);
        const newPageDetail = pageDetail.filter(item => item.goodsCode);
        // console.log("newPageDetail", newPageDetail);
        const cloneListData = _.cloneDeep(newPageDetail);
        if (!cloneListData.length) {
          message.error('第一行物资编码不能为空');
          return false;
        }
        // let isSave = true;
        // let isAllUpdate = true;
        cloneListData.map((item) => {
          // console.warn("item.wareQty",item.goodsQty,!item.goodsQty);
          // if (!item.goodsCode) {
          //   message.error(`第${i + 1}行，物品编码不能为空`);
          //   isSave = false;
          //   return false;
          // } else if (!item.goodsQty) {
          //   message.error(`第${i + 1}行，数量不能为空`);
          //   isSave = false;
          //   return false;
          // } else if (Number(item.wareQty) < Number(item.goodsQty)) {
          //   message.error(`第${i + 1}行，数量不能大于库存数量`);
          //   isSave = false;
          //   return false;
          // } else if (item.dualUnitName && (!item.dualGoodsQty)) {
          //   message.error(`第${i + 1}行，辅助数量不能为空`);
          //   isSave = false;
          //   return false;
          // } else if (item.dualUnitName && Number(item.dualWareQty) < Number(item.dualGoodsQty)) {
          //   message.error(`第${i + 1}行，辅助数量不能大于辅助库存数量`);
          //   isSave = false;
          //   return false;
          // }

          if (opType === 'create') {
            delete item.id;
          }
          // console.warn('storeOpType', opType);
          if (opType === 'edit') {
            // console.log(item.id, )
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
        const invalidiGoodsCode = _.findIndex(cloneListData, item => !item.goodsCode);
        if (invalidiGoodsCode >= 0) {
          message.error(`第${invalidiGoodsCode + 1}行“物品编码”数据无效，请检查！`, 5);
          return null;
        }
        const invalidiGoodsQty = _.findIndex(cloneListData, item => !item.goodsQty);
        if (invalidiGoodsQty >= 0) {
          message.error(`第${invalidiGoodsQty + 1}行为双单位物品，“数量”数据无效，请检查！`, 5);
          return null;
        }
        const invalidiWareQty = _.findIndex(cloneListData, item => Number(item.wareQty) < Number(item.goodsQty));
        if (invalidiWareQty >= 0) {
          message.error(`第${invalidiWareQty + 1}行数量不能大于库存数量，请检查！`, 5);
          return null;
        }
        const invalidiDualGoodsQty = _.findIndex(cloneListData, item => item.dualUnitName && (!item.dualGoodsQty));
        if (invalidiDualGoodsQty >= 0) {
          message.error(`第${invalidiDualGoodsQty + 1}行“辅助数量”数据无效，请检查！`, 5);
          return null;
        }
        const invalidiDualWareQty = _.findIndex(cloneListData, item => item.dualUnitName && (Number(item.dualWareQty) < Number(item.dualGoodsQty)));
        if (invalidiDualWareQty >= 0) {
          message.error(`第${invalidiDualWareQty + 1}行辅助数量不能大于辅助库存数量，请检查！`, 5);
          return null;
        }
        // return false;
        // const validateLength = cloneListData.filter(item => item.goodsCode).length;
        // if (!validateLength) {
        //   message.error('验证数据无效！');
        //   return null;
        // }

        // const invalidi = _.findIndex(cloneListData, item => !item.purcUnitNum || !item.dualUnitNum || !item.arrivalDate);
        // if (invalidi >= 0) {
        //   message.error(`第${invalidi + 1}行数据无效，请检查！`);
        //   return null;
        // }
        // if (isSave) {
        const { storeId } = yield select(state => state.cannManage);
        // const depotList = yield select(state => state.requisitionModule.depotList);
        // const store = _.find(depotList, item => item.id === storeId);
        // const storeName = store ? store.name : '';
        // console.warn("cloneListData",cloneListData);
        const { bussDate, outDepotId, inDepotId, depotCannList, remarks, dataAll } = yield select(state => state.cannMangeDetailsModule);
        const outDepotIdAll = _.find(depotCannList, item => item.id === outDepotId);
        const inDepotIdAll = _.find(depotCannList, item => item.id === inDepotId);
        const detailsData = {
          status: payload.status,
          storeId,
          outDepotId, // 新增调出仓库ID
          inDepotId, // 新增调入仓库ID
          remarks,
          bussDate,
          delIdsList,
          outDepotName: outDepotIdAll.depotName,
          inDepotName: inDepotIdAll.depotName,
          detailList: _.cloneDeep(cloneListData),
        };
        yield put({ type: 'changeSavingStatus', savingStatus: true });
        const storeOpType = yield select(state => state.cannMangeDetailsModule.opType);
        let saveData = null;
        if (storeOpType === 'create') {
          saveData = yield call(addScmTransfer, parse(detailsData));
        } else { // 更新时包含ID
          saveData = yield call(updScmTransfer, Object.assign(parse(detailsData), { id: dataAll.id }));
        }
        // console.log("saveDetails data",saveData,saveData.data.code,saveData.data.success,saveData.data.code === 200 && saveData.data.success === true);
        if (saveData.data.code === '200' && saveData.data.success === true) {
          // setTimeout(savingStatusMessage, 100);
          message.success('操作成功！');
          // yield put({ type: 'changeOpType', opType: 'view' }); // 操作成功后改成浏览模式
          // yield put({ type: 'cancelDetailData', payload: {} });
          const pageNewDetail = yield select(state => state.cannMangeDetailsModule.pageNewDetail);
          const path = '/stock/cannManage';
          yield put({
            type: 'initModule',
            payload: {
              pageDetail: _.cloneDeep(pageNewDetail),
              remarks: '',
              startDate: '',
            },
          });
          yield put(routerRedux.push(path));
          yield put({
            type: 'cannManage/getList',
            payload: {
              pageNo: 1,
            },
          });
          yield put({
            type: 'cannMangeDetailsModule/querySuccess',
            payload: {
              outDepotId: '',
              inDepotId: '',
              remarks: '',
              bussDate: moment(new Date()).format('YYYY-MM-DD'),
              dataSourceIndex: [],
              delIdsList: [],
              pageStatus: 0,
            },
          });
          yield put({ type: 'changePageStatus', pageStatus: payload.status });
          yield put({ type: 'changeSavingStatus', savingStatus: false });
        } else {
          message.warning(`操作失败，请参考：：${saveData.data.errorInfo}`);
          // setTimeout(savingStatusMessage, 100);
          yield put({ type: 'changeSavingStatus', savingStatus: false });
        }
      }
      // }
      return null;
    },
    * cancelDetailData({ payload }, { put, select }) {
      const pageNewDetail = yield select(state => state.cannMangeDetailsModule.pageNewDetail);
      const path = '/stock/cannManage';
      yield put({
        type: 'initModule',
        payload: {
          pageDetail: _.cloneDeep(pageNewDetail),
          remarks: '',
          startDate: '',
        },
      });
      yield put(routerRedux.push(path));
    },
    * switchSavingStatus({ payload }, { put }) {
      yield put({ type: 'changeSavingStatus', savingStatus: payload.savingStatus });
    },
    * changeEditingStatus({ payload }, { select, put }) {
      const storeEditableMem = yield select(state => state.cannMangeDetailsModule.editableMem);
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
    // * resetData({ payload }, { put }) {
      // yield put({ type: 'setNewEditableMem',  });
      // console.warn("-------------------------我走了");
      // yield put({ type: 'querySuccess',
      //   payload: {
      //     editableMem: new Array(0),
      //     pageDetail: new Array(0),
      //   },
      // }); // 删掉原来的列表数据以防止列表生成men表时计算错误
    // },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        // if (location.pathname === '/stock/cannManage/details/:storeIdKey') {
        //   console.warn("-----------------进来了");
        // }
        // if (location.pathname !== '/stock/cannManage/details/:storeIdKey') {
        //
        // } else {
        // console.warn("我是判断是否有值");
        if (location.pathname === '/stock/cannManage') {
          // console.warn("--------------------------------------我是全部数据");
          dispatch({
            type: 'saveRequisitionDetails',
            payload: { displaySavingMessage: false },
          });
          dispatch({
            type: 'editableMem',
            payload: { dataSource: [] },
          });
          // dispatch({
          //   type: 'resetData',
          // });
        }
        const pathname = location.pathname;
        const re = pathToRegexp('/stock/cannManage/details/:storeIdKey');
        const match = re.exec(pathname);
        // console.warn("match",match);
        if (match) {
          const storeIdKey = match[1];
          let cannManageAll = window.sessionStorage.getItem(`cannManage_${storeIdKey}`);
          // console.warn("请求的全部的值", JSON.parse(cannManageAll));
          cannManageAll = JSON.parse(cannManageAll);
          dispatch({
            type: 'editableMem',
            payload: { pageDetail: [] },
          });
          // console.warn("33333333请求的全部的值", cannManageAll, cannManageAll.storeId, cannManageAll.opType);
          if (cannManageAll) { // 取得值不为空
            if (cannManageAll.opType !== 'create') {
              dispatch({
                type: 'showDetailList',
                payload: {
                  id: cannManageAll.cannId,
                  storeId: cannManageAll.storeId,
                },
              });
            }
            dispatch({
              type: 'querySuccess',
              payload: { storeId: cannManageAll.storeId, opType: cannManageAll.opType },
            });
            dispatch({
              type: 'startWithType', // 写在此处不写在上面intoModel的原因是因为要驱动初始添加数据。
              payload: {
                opType: cannManageAll.opType,
              },
            });
            dispatch({
              type: 'findTreeList',
              payload: { type: 0 },
            });
            // console.warn("storeId",storeId,"match",match);
            dispatch({
              type: 'queryDepot',
              payload: { rows: 10, storeId: cannManageAll.storeId },
            });
            dispatch({
              type: 'addForm',
              payload: {
                storeId: cannManageAll.storeId,
              },
            });
          }
        }
      });
    },
  },
};
