import { parse } from 'qs';
import { message } from 'antd';
import _ from 'lodash';
import pathToRegexp from 'path-to-regexp';
import { routerRedux } from 'dva/router';
import { queryWarehouse } from '../../services/inventory/common';
import { getDetailList, saveDetails } from '../../services/inventory/dispatchCheck';

let idAll = '';
let opTypeAll = '';

export default {
  namespace: 'dispatchCheckDetails',
  state: {
    opType: '', // 验收或查看check,view
    loadingList: false, // 缓冲
    billNo: '', // 配送单号
    storeName: '', // 请购门店
    depotName: '', // 出库仓库
    inDepotName: '', // 入库仓库
    dispatchOutNo: '', // 配送出库单号
    auditStatus: '', // 验收状态
    distribName: '', // 配送中心
    orderDate: '', // 单号创建日期
    depotId: '', // 入库仓库id
    depotList: [], // 仓库列表
    initialDepotName: '', // 入库仓库初始值
    auditUser: '', // 验收人
    createTime: '', // 验收时间
    pageDetail: [{  // 表格数据
      id: 1,
      goodsCode: '', // 物资编码
      goodsName: '', // 物资名称
      goodsSpec: '', // 物资规格
      purcUnitNum: '', // 订货数量
      purcUnitName: '', // 订货单位
      ordUnitNum: '', // 采购数量
      ordUnitName: '', // 采购单位
      goodsPrice: '', // 采购单价
      goodsAmt: '', // 采购金额
      auditQty: '', // 验收数量
      unitNum: '', // 标准数量
      unitName: '', // 标准单位
      dualUnitNum: '', // 辅助数量
      dualUnitName: '', // 辅助单位
      taxRatio: '', // 税率
      goodsAmtNotax: '', // 不含税金额
      remarks: '', // 备注
    }],
    editableMem: [], // 可编辑表格对象的状态：true/false
  },
  reducers: { // Update above state.
    // 更新state中的数据
    updateState(state, action) {
      return { ...state, ...action.payload };
    },
    // 更新state中的数据，阻止缓冲
    querySuccess(state, action) {
      return { ...state, ...action.payload, loadingList: false };
    },
    // 缓冲
    showLoading(state) {
      return { ...state, loadingList: true };
    },
    // 缓冲
    hideLoading(state) {
      return { ...state, loadingList: false };
    },
    setNewEditableMem(state, action) {
      return { ...state, editableMem: action.editableMem };
    },
  },
  effects: {
    // 修改入库仓库
    * changeDepot({ payload }, { put }) {
      yield put({
        type: 'updateState',
        payload: {
          depotId: payload.depotId,
        },
      });
    },
    // 在dispatchCheck页面,点击查看或验收：获取类型
    * startWithType({ payload }, { put }) {
      yield put({ type: 'showLoading' });
      yield put({
        type: 'updateState',
        payload: {
          opType: payload.opType,
        },
      });
    },
    // 在dispatchCheck页面,点击查看或验收：获取仓库
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
    // 在dispatchCheck页面,点击查看或验收：获取搜索部分+列表值
    * showDetailList({ payload }, { call, put, select }) {
      yield put({ type: 'showLoading' });
      idAll = payload.id;
      const detailInfo = yield call(getDetailList, parse(payload));
      if (detailInfo.data.code === '200' && detailInfo.data.success === true) {
        yield put({
          type: 'querySuccess',
          payload: {
            pageDetail: detailInfo.data.data.scmDispatchDetails,
            billNo: detailInfo.data.data.billNo,
            storeName: detailInfo.data.data.storeName,
            depotName: detailInfo.data.data.depotName,
            inDepotName: detailInfo.data.data.inDepotName,
            dispatchOutNo: detailInfo.data.data.dispatchOutNo,
            auditStatus: detailInfo.data.data.auditStatus,
            distribName: detailInfo.data.data.distribName,
            orderDate: detailInfo.data.data.orderDate,
            auditUser: detailInfo.data.data.auditUser,
            createTime: detailInfo.data.data.createTime,
          },
        });
        const pageDetail1 = yield select(state => state.dispatchCheckDetails.pageDetail);
        if (opTypeAll === 'check') {
          for (let i = 0; i < pageDetail1.length; i += 1) {
            pageDetail1[i].auditQty = pageDetail1[i].unitNum;
          }
        }
        yield put({
          type: 'updateState',
          payload: { pageDetail: pageDetail1 },
        });
        yield put({
          type: 'editableMem',
          payload: { dataSource: [] },
        });
      } else {
        message.warning(`操作失败，请参考：${detailInfo.data.errorInfo}`);
        yield put({ type: 'hideLoading' });
      }
    },
    // 编辑列表后同步，以在列表中即时显示
    * resyncListData({ payload }, { put, select }) {
      yield put({ type: 'showLoading' });
      const storeListData = yield select(state => state.dispatchCheckDetails.pageDetail);
      const newPageData = _.cloneDeep(storeListData); // 使用新对象
      yield put({
        type: 'querySuccess',
        payload: {
          pageDetail: newPageData,
        },
      });
    },
    // 初始化数据
    * editableMem({ payload }, { put, select }) {
      const data = yield select(state => state.dispatchCheckDetails.pageDetail);
      const editableMemData = Array(data.length);
      for (let i = 0; i < data.length; i += 1) {
        editableMemData[i] = _.cloneDeep({});
      }
      yield put({ type: 'querySuccess', payload: { editableMem: editableMemData } });
    },
    // 辅助数量、验收，点击enter跳转到下一个编辑状态，自动换焦点
    * toNextMemByCurr({ payload }, { select, put }) {
      const storeEditableMem = yield select(state => state.dispatchCheckDetails.editableMem);
      let hasBeenSet = false;
      storeEditableMem.map((item) => {
        const itemKeys = Object.keys(item); // 获取属性
        const itemVales = Object.values(item); // 获取属性值
        itemVales.map((value, colIndex) => {
          if (value !== true) {
            return null;
          }
          if (hasBeenSet === false) {
            item[itemKeys[colIndex]] = false;
            if (colIndex === itemKeys.length - 1) {
              const nextRowObj = storeEditableMem[payload.rowIndex + 1];
              if (nextRowObj) {
                // 找到下一行的第一个元素，选中
                nextRowObj[itemKeys[0]] = true;
                hasBeenSet = true;
              }
            } else {
              let indexCol = colIndex + 1;
              if (payload.isShow) {
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
      yield put({
        type: 'updateState',
        payload: {
          editableMem: storeEditableMem,
        },
      });
    },
    // 修改其他的编辑状态为非编辑状态
    * toggleMemStatus({ payload }, { select, put }) {
      const storeEditableMem = yield select(state => state.dispatchCheckDetails.editableMem);
      storeEditableMem.map((item, rowIndex) => {
        const itemKeys = Object.keys(item);
        const itemVales = Object.values(item);
        // 循环遍历每一行为正在编辑的状态修改为非编辑状态，当前正在编辑的项目除外
        itemVales.map((value, colIndex) => {
          if (value === true && rowIndex === payload.rowIndex && itemKeys[colIndex] === payload.fieldName) {
            // item[itemKeys[colIndex]] = true; // keep status
          } else {
            item[itemKeys[colIndex]] = false;
          }
          return null;
        });
        return null;
      });
      yield put({ type: 'setNewEditableMem', editableMem: storeEditableMem });
    },
    // 点击验收，保存验收信息
    * saveDirectCheckDetails({ payload }, { call, put, select }) {
      if (payload.displaySavingMessage === false) {
        yield false;
      }
      // 验证是否选择入库仓库
      const depotListId = yield select(state => state.dispatchCheckDetails.depotId);
      if (!depotListId) {
        message.error('请选择入库仓库！');
        return null;
      }
      // 列表内容
      let storeListData = yield select(state => state.dispatchCheckDetails.pageDetail);
      storeListData = _.cloneDeep(storeListData);
      // 保存到小数点后四位
      storeListData.map((item) => {
        item.auditQty = Math.round(item.auditQty * 10000) / 10000;
        return null;
      });
      const storeLists = _.cloneDeep(storeListData);
      const detailList = storeLists.map(item => ({
        id: item.id,
        auditQty: item.auditQty || 0, // 本次验收
        unitNum: item.unitNum, // 标准数量
        auditDualQty: item.dualUnitNum, // 辅助数量
      }));
      // 验证验收数量
      const invalidIndex = _.findIndex(
        detailList,
        item => !item.auditQty || item.auditQty > item.unitNum,
      );
      if (invalidIndex >= 0) {
        message.error(`第${invalidIndex + 1}行验收数量有误，需大于0小于标准数量，请检查！`);
        return null;
      }
      const detailsData = {
        id: idAll, // 主单据id
        depotId: depotListId, // 仓库ID
        detailList: _.cloneDeep(detailList),
      };
      const saveData = yield call(saveDetails, parse(detailsData));
      if (saveData.data.code === '200' && saveData.data.success === true) {
        message.success('操作成功！');
        const path = '/stock/dispatchCheck';
        yield put({ // 操作成功后改变验收状态
          type: 'updateState',
          payload: {
            auditStatus: payload.status,
          },
        });
        yield put(routerRedux.push(path));
        // yield put({ // 操作成功后改成浏览模式
        //   type: 'updateState',
        //   payload: {
        //     opType: 'view',
        //   },
        // });
      } else {
        message.warning(`操作失败，请参考：${saveData.data.errorInfo}`);
      }
      return null;
    },
    // 点击返回，返回查询页，实现路由跳转
    * cancelDetailData({ payload }, { put }) {
      const path = '/stock/dispatchCheck';
      yield put({
        type: 'updateState',
        payload: {
          pageDetail: [],
          depotId: '',
          auditStatus: '',
          orderDate: '', // 单号创建日期
          depotName: '', // 出库仓库
          inDepotName: '', // 入库仓库
          billNo: '', // 配送单号
          distribName: '', // 配送中心
          dispatchOutNo: '', // 配送出库单号
          storeName: '', // 请购门店
          auditUser: '', // 验收人
          createTime: '', // 验收时间
        },
      });
      yield put(routerRedux.push(path));
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname !== '/stock/dispatchCheck/details/:pageType/:storeId/:id') {
          dispatch({
            type: 'editableMem',
            payload: { pageDetail: [] },
          });
          dispatch({
            type: 'saveDirectCheckDetails',
            payload: { displaySavingMessage: false },
          });
        }

        const pathname = location.pathname;
        const re = pathToRegexp('/stock/dispatchCheck/details/:pageType/:storeId/:id');
        const match = re.exec(pathname);
        if (match) {
          opTypeAll = match[1];
          const pageType = match[1];
          const storeId1 = match[2];
          const id1 = match[3];
          dispatch({ // 传列表的值
            type: 'showDetailList',
            payload: {
              id: id1,
            },
          });
          dispatch({ // 传类型
            type: 'startWithType',
            payload: {
              opType: pageType,
            },
          });
          if (pageType === 'check') {
            dispatch({ // 请求仓库
              type: 'queryDepot',
              payload: {
                storeId: storeId1,
                rows: 10,
              },
            });
          }
        }
      });
    },
  },
};
