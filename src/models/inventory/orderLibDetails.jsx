import React from 'react';
import { message, Modal, Tag } from 'antd';
import { parse } from 'qs';
// import { routerRedux } from 'dva/router';
import _ from 'lodash';
import moment from 'moment';
import { routerRedux } from 'dva/router';
import { getCurrUser, getDetailList, getSplitingDetailList, queryGoodsByString, doItInProgress } from '../../services/inventory/orderLibDetails';
// import { setTopLoadingStatus } from '../../services/inventory/common';
import { orderLibDetailsItemModel } from './_common';

export default {
  namespace: 'orderLibDetailsModule',
  state: {
    storeId: '',
    billNo: '',
    opType: 'view', // create, edit, view
    user: {},
    loadingList: false,
    pageInfo: {},
    pageDetail: [],
    editableMem: [],
    pageStatus: 0,
    goodsList: [],
    bussDate: moment(new Date()).format('YYYY-MM-DD'),
    filterNo: '',
    currentId: '',
    prosessingStatus: 'prepare',
    processData: null,
    processStatus: '',
    billInfo: {},
    billStatus: {},
  },
  reducers: { // Update above state.
    mergeData(state, action) { // 初始模块值
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

    setCurrId(state, action) {
      return { ...state, currentId: action.currentId };
    },
    setFilterNo(state, action) {
      return { ...state, filterNo: action.filterNo };
    },
    setProsessingStatus(state, action) {
      return { ...state, prosessingStatus: action.prosessingStatus };
    },

  },
  effects: { // Fire an action or action a function here.
    * intoModel({ payload }, { call, put }) { // 进入详情页
      yield put({ type: 'setProsessingStatus', prosessingStatus: 'prepare' }); // 设置处理状态
      const user = yield call(getCurrUser, parse(payload));
      if (user) {
        yield put({ type: 'gotUser', user: user.data });
      }
      yield put({ type: 'mergeData', payload });
    },
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
    // 详情列表
    * showDetailList({ payload }, { select, call, put }) { // 获取列表
      const detailInfo = yield call(getSplitingDetailList, parse({ id: payload.selIds[0] }));
      // console.warn('models--detailInfo', detailInfo);
      // yield put({ type: 'setBussDate', bussDate: moment(payload.bussDate).format('YYYY-MM-DD') });
      // yield put({ type: 'showLoading' });
      // yield put({ type: 'setCurrId', currentId: payload.selIds }); // 设置当前ID
      // yield put({ type: 'setFilterNo', filterNo: payload.selectedNos }); // 设置搜索ID

      yield put({
        type: 'mergeData',
        payload: {
          bussDate: moment(payload.bussDate).format('YYYY-MM-DD'),
          currentId: payload.selIds,
          filterNo: payload.selectedNos,
          loadingList: true,
        },
      });
      const billInfo = payload.billInfo;
      const billStatus = yield select(state => state.orderLibModule.billStatus);
      // console.log('detailInfo', detailInfo);
      if (detailInfo.data.code === '200') {
        yield put({
          type: 'mergeData',
          payload: {
            pageInfo: detailInfo.data.data.applyOrder,
            pageDetail: detailInfo.data.data.detailList,
            pageStatus: billInfo.status,
            billInfo,
            loadingList: false,
            billStatus,
          }
        });
      }

      yield put({ type: 'mergeData', payload: { processData: null, processStatus: '' } }); // 初始拆单操作
    },
    * confirmProcessData({ payload }, { put }) { // 拆单失败，提示弹窗的 × 号事件，点击知道了事件
      // const path = '/stock/orderLib';
      // const processData = yield select(state => state.orderLibDetailsModule.processData);
      // console.warn('processData', processData);
      yield put({ type: 'mergeData', payload: { processData: null, processStatus: '' } }); // 关闭拆单操作
      // yield put(routerRedux.push(path));
    },
    // 一键生成订单
    * showDetailListInGeneration({ payload }, { select, call, put }) { // 获取选中条目的所有列表
      const allSelectedIds = yield select(state => state.orderLibModule.selectedRows);
      const allIds = allSelectedIds.map(item => item.id);
      const detailInfo = yield call(getDetailList, { selIds: allIds });
      // console.log("detailInfo",detailInfo);
      yield put({ type: 'showLoading' });

      if (payload && payload.selIds) {
        yield put({ type: 'setCurrId', currentId: payload.selIds }); // 设置当前ID
      }
      if (payload && payload.selectedNos) {
        yield put({ type: 'setFilterNo', filterNo: payload.selectedNos }); // 设置搜索ID
      }

      if (detailInfo.data.code === '200') {
        yield put({ type: 'gotDetailList', pageDetail: detailInfo.data.data.page, pageStatus: 962 });
      }
    },
    * startWithType({ payload }, { put }) { // 改为编辑状态
      // console.log('startWithType!');
      yield put({ type: 'changeOpType', opType: payload.opType });
      // const storeOpType = yield select(state => state.orderLibDetailsModule.opType);
      // // console.log("startWithType storeOpType", storeOpType);
      // if (storeOpType === 'create') {
      //   const rowsObj = [];
      //   const emptyItem = _.cloneDeep(orderLibDetailsItemModel);
      //   rowsObj.push(emptyItem);
      //   yield put({ type: 'gotDetailList', pageDetail: rowsObj });
      // }
    },
    * resyncListData({ payload }, { put, select }) { // 编辑列表后同步，以在列表中即时显示
      yield put({ type: 'showLoading' });
      const storeListData = yield select(state => state.orderLibDetailsModule.pageDetail);
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
      const storeEditableMem = yield select(state => state.orderLibDetailsModule.editableMem);
      const storeListData = yield select(state => state.orderLibDetailsModule.pageDetail);
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
      const storeListData = yield select(state => state.orderLibDetailsModule.pageDetail);
      const newPageData = _.cloneDeep(storeListData); // 使用新对象
      Object.assign(newPageData[payload.index], payload.selectedObj, { goodsId: payload.selectedObj.id, id: '' }); // 更新goodsId，新增的也要去掉id
      yield put({ type: 'gotDetailList', pageDetail: newPageData });
    },
    * insertNewListItemAfterIndex({ payload }, { select, put }) { // 点击添加行按钮在某一下标下添加一行
      yield put({ type: 'showLoading' });
      const storeListData = yield select(state => state.orderLibDetailsModule.pageDetail);
      const newPageData = _.cloneDeep(storeListData); // 使用新对象
      const emptyItem = _.cloneDeep(orderLibDetailsItemModel);
      emptyItem.id = new Date();
      newPageData.splice(payload.index + 1, 0, emptyItem); // Insert an emptyItem after index to an array
      yield put({ type: 'gotDetailList', pageDetail: newPageData });
    },
    * removeListItemAtIndex({ payload }, { select, put }) { // 点击添加行按钮在某一下标下添加一行
      yield put({ type: 'showLoading' });
      const storeListData = yield select(state => state.orderLibDetailsModule.pageDetail);
      const newPageData = _.cloneDeep(storeListData); // 使用新对象
      newPageData.splice(payload.index, 1); // remove 1 item at index from an array javascript
      yield put({ type: 'gotDetailList', pageDetail: newPageData });
    },
    * setBussinessDate({ payload }, { put }) { // 设置要货日期
      yield put({ type: 'setBussDate', bussDate: payload.dateString });
    },
    * progressOrderLibDetails({ payload }, { call, put, select }) { // “处理”功能
      // console.log("payload",payload);
      const allSelectedIds = yield select(state => state.orderLibModule.selectedRows);
      const distribId = yield select(state => state.orderLibModule.orgId);
      const allIds = allSelectedIds.map(item => item.id);
      yield put({ type: 'setProsessingStatus', prosessingStatus: 'progressing' }); // 设置处理状态
      // const prosessingStatusMessage = message.loading('正在拆分，请稍候……', 0);
      // console.warn('allSelectedIds is empty???', allIds, 'distribId is not good???', distribId); // 避免拆分失败后，换一个单子，delIds会叠加的问题 待测
      const saveData = yield call(doItInProgress, { selIds: allIds, distribId });
      // console.log("doItInProgress data",saveData,saveData.data.code,saveData.data.success,saveData.data.code === 200 && saveData.data.success === true);
      if (saveData.data.code === '200' && saveData.data.success === true) {
        yield put({ type: 'showDetailListInGeneration' }); // 重新获取所有列表项
        yield put({ type: 'orderLibModule/updateSelectedRows', selectedRows: [] }); // 清空选择行
        yield put({ type: 'setProsessingStatus', prosessingStatus: 'done' }); // 设置处理状态
      } else {
        // console.warn('status is not 200, should telling me, ha?');
        message.error(`拆分失败！原因：${saveData.data.errorInfo}`, 5); // 拆分一次之后按钮置灰，拆分失败后点第二次拆分 传的delIds为空 待议
        // yield put({ type: 'orderLibModule/updateSelectedRows', selectedRows: [] }); // 清空选择行
        yield put({ type: 'setProsessingStatus', prosessingStatus: 'done' }); // 设置处理状态
      }
      // console.log('progressOrderLibDetails saveData', saveData.data.data.ok);
      if (saveData.data.data.ok) { // "拆分成功"
        Modal.success({
          title: '拆分成功',
          content: <div>
            <p>以下为拆分后的订单号，请确认：</p>
            <p>{saveData.data.data.ok.map(item => (<Tag style={{ margin: 5 }}>{item}</Tag>))}</p>
          </div>,
        });
        // console.log('saveData.data.data.ok', saveData.data.data.ok);
        yield put({ type: 'mergeData', payload: { processData: saveData.data.data.ok, processStatus: 'OK' } }); // 保存结果
      } else if (saveData.data.data.noRef) { // "以下物资没有对应的供货关系，请完善的供货关系表或仓库配送关系表后拆分订单。"
        yield put({ type: 'mergeData', payload: { processData: saveData.data.data.noRef, processStatus: 'noRef' } }); // 保存结果
      } else if (saveData.data.data.noPrice) { // "以下物资在配送售价单中没有价格信息，请完善的对应物资的价格信息后拆分订单。"
        yield put({ type: 'mergeData', payload: { processData: saveData.data.data.noPrice, processStatus: 'noPrice' } }); // 保存结果
      }
    },
    * cancelDetailData({ payload }, { put }) {
      const path = '/stock/orderLib';
      yield put({
        type: 'mergeData',
        payload: {
          filterNo: '', // 请购单号
          user: {}, // 操作人
          billStatus: {}, // 请购状态
          pageInfo: {},  // 请购机构、创建人、创建时间
          pageDetail: [], // 订单信息
        },
      });
      yield put(routerRedux.push(path));
    },
    * switchSavingStatus({ payload }, { put }) {
      yield put({ type: 'setProsessingStatus', prosessingStatus: payload.prosessingStatus });
    },
  },
  subscriptions: {
    // setup({ dispatch, history }) {
    //   history.listen((location) => {
    //     if (location.pathname !== '/stock/orderLib/details') {
    //       // dispatch({
    //       //   type: 'switchSavingStatus',
    //       //   payload: { prosessingStatus: false },
    //       // });
    //     }
    //   });
    // },
  },
};
