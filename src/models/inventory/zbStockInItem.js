import { parse } from 'qs';
import { message } from 'antd';
import pathToRegexp from 'path-to-regexp';
import { routerRedux } from 'dva/router';
import moment from 'moment';
import { queryGoodsID, findTreeList, queryWarehouse, querySupplier } from '../../services/inventory/common';
import { addStockIn, updStockIn, queryDetailList, addForm } from '../../services/inventory/zbStockIn';
import { codeToArray } from '../../utils';

const dateFormat = 'YYYY-MM-DD';

export default {
  namespace: 'zbStockInItem',
  state: {
    loading: false,
    loadingSave: false,
    loadingStock: false,
    storeId: '', // 机构id
    pageType: '', // 页面类型，新增、编辑、查看
    monthDate: null,
    goodsList: [],
    detailList: [],
    delIdsList: [],
    goodsSearchValue: null,
    // 表单项
    id: '',
    billType: null,
    busiId: null,
    busiName: null,
    bussDate: moment().format(dateFormat),
    depotId: null,
    depotName: null,
    status: null,
    remarks: null,
    currentRow: 0,
    baseInfo: { // 基础信息，一些搜索下拉选项之类的
      billType: [
        {
          code: '912',
          name: '采购入库',
        },
        {
          code: '914',
          name: '其他入库',
        },
      ],
      billTypeView: [
        {
          code: '911',
          name: '订货入库',
        },
        {
          code: '912',
          name: '采购入库',
        },
        {
          code: '913',
          name: '盘盈入库',
        },
        {
          code: '914',
          name: '其他入库',
        },
        {
          code: '921',
          name: '调拨入库',
        },
        {
          code: '923',
          name: '自采入库',
        },
      ],
      warehouse: [],
      supplier: [],
    },
    // 选择物资
    listGoods: [],
    searchTree: [],
    selectedRowKeys: null,
    modalVisible: false,
    modalKey: null,
    cateId: null,
    oldGoodsId: null,
    selectedGoods: [],
    cacheSelectGoods: [],
    cacheGoodsCodes: [],
    chooseGoodsCode: [],
    eidtGoodsId: [], // 保存编辑的时候取回来的物资编码数组
    validateList: [ // 验证数组，用于标识哪些单元格已经修改
      {
        goodsCode: null,
      },
    ],
    // 页面下拉选择物资
    miniGoodsVisible: false,
    topMini: 0,
    hotTableHeight: 100,
    adaptRowHeight: 0,
    cellValue: '',
    activeRow: 0,
    goodsKeywords: null, // 用于判断物品编码的输入框里用没有文字
    isCodeChanging: false,
    // 分页
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => `共 ${total} 条`,
      current: 1,
      total: 0,
      pageSize: 10,
      pageSizeOptions: ['10', '20', '50', '100'],
    },
    paginationGoods: {
      size: 'small',
      showTotal: total => `共 ${total} 条`,
      showSizeChanger: true,
      showQuickJumper: true,
      current: 1,
      total: 0,
      pageSize: 10,
      pageSizeOptions: ['10', '20', '50', '100'],
    },
  },
  effects: {
    * queryWarehouse({ payload }, { call, put, select }) {
      message.destroy();
      const data = yield call(queryWarehouse, parse(payload));
      if (data.data && data.data.success) {
        const baseInfoOld = yield select(state => state.zbStockInItem.baseInfo);
        yield put({
          type: 'querySuccess',
          payload: {
            baseInfo: { ...baseInfoOld, warehouse: data.data.data.page.data },
          },
        });
      } else {
        message.warning(`操作失败，请参考：${data.data.errorInfo}`);
        yield put({ type: 'hideLoading' });
      }
    },
    * querySupplier({ payload }, { call, put, select }) {
      message.destroy();
      const data = yield call(querySupplier, parse(payload));
      if (data.data && data.data.success) {
        const baseInfoOld = yield select(state => state.zbStockInItem.baseInfo);
        yield put({
          type: 'querySuccess',
          payload: {
            baseInfo: { ...baseInfoOld, supplier: data.data.data.page.data },
          },
        });
      } else {
        message.warning(`操作失败，请参考：${data.data.errorInfo}`);
        yield put({ type: 'hideLoading' });
      }
    },
    * queryBillList({ payload }, { call, put, select }) {
      yield put({ type: 'showLoading' });
      const data = yield call(queryDetailList, parse(payload));
      const pageType = yield select(state => state.zbStockInItem.pageType);
      if (data.data && data.data.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            detailList: data.data.data.detailList,
            delIdsList: data.data.data.delIdsList,
            id: data.data.data.id,
            billType: String(data.data.data.billType),
            busiId: data.data.data.busiId,
            busiName: data.data.data.busiName,
            bussDate: data.data.data.bussDate,
            depotId: data.data.data.depotId,
            depotName: data.data.data.depotName,
            status: data.data.data.status,
            remarks: data.data.data.remarks,
            chooseGoodsCode: pageType === 'edit' ? codeToArray(data.data.data.detailList, 'goodsId') : [],
            cacheGoodsCodes: pageType === 'edit' ? codeToArray(data.data.data.detailList, 'goodsId') : [],
            eidtGoodsId: pageType === 'edit' ? codeToArray(data.data.data.detailList, 'id') : [],
            hotTableHeight: (data.data.data.detailList.length * 29) + 65,
          },
        });
      } else {
        message.warning(`操作失败，请参考：${data.data.errorInfo}`);
        yield put({ type: 'hideLoading' });
      }
    },
    * saveStockIn({ payload }, { call, put, select }) {
      message.destroy();
      const storeId = yield select(state => state.zbStockInItem.storeId);
      const pageType = yield select(state => state.zbStockInItem.pageType);
      let data = [];
      if (!payload.param.id) {
        data = yield call(addStockIn, parse(payload.param));
      } else {
        data = yield call(updStockIn, parse(payload.param));
      }
      // 根据暂存或者入库改变按钮状态
      if (payload.param.status === 961) {
        yield put({ type: 'showLoadingSave' });
      } else if (payload.param.status === 962) {
        yield put({ type: 'showLoadingStock' });
      }
      if (data.data && data.data.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            detailList: data.data.data.detailList,
            delIdsList: data.data.data.delIdsList,
            id: data.data.data.id,
            billType: String(data.data.data.billType),
            busiId: data.data.data.busiId,
            busiName: data.data.data.busiName,
            bussDate: data.data.data.bussDate,
            depotId: data.data.data.depotId,
            depotName: data.data.data.depotName,
            status: data.data.data.status,
            remarks: data.data.data.remarks,
            chooseGoodsCode: pageType === 'edit' ? codeToArray(data.data.data.detailList, 'goodsId') : [],
            cacheGoodsCodes: pageType === 'edit' ? codeToArray(data.data.data.detailList, 'goodsId') : [],
            eidtGoodsId: pageType === 'edit' ? codeToArray(data.data.data.detailList, 'id') : [],
            hotTableHeight: (data.data.data.detailList.length * 29) + 65,
          },
        });
        // 根据暂存或者入库，跳到不同的页面
        if (data.data.data.status === 961) {
          message.success('暂存成功');
          yield put({ type: 'hideLoadingSave' });
          setTimeout(() => {
            const path = `#/stock/zb/stockIn/${storeId}`;
            window.location.href = path;
          }, 300);
        } else if (data.data.data.status === 962) {
          message.success('入库成功');
          yield put({ type: 'hideLoadingStock' });
          setTimeout(() => {
            const path = `#/stock/zb/stockIn/${storeId}`;
            window.location.href = path;
          }, 300);
        }
      } else {
        message.warning(`操作失败，请参考：${data.data.errorInfo}`);
        yield put({ type: 'hideLoadingStock' });
        yield put({ type: 'hideLoadingSave' });
      }
    },
    * queryTree({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      const data = yield call(findTreeList, parse(payload));
      if (data) {
        yield put({
          type: 'querySuccess',
          payload: {
            searchTree: data.data.data,
          },
        });
      }
    },
    * addForm({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      const data = yield call(addForm, parse(payload));
      if (data.data && data.data.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            bussDate: moment(data.data.data.bussDate).format(dateFormat) || moment().format(dateFormat),
            monthDate: moment(data.data.data.monthDate).format(dateFormat) || moment().format(dateFormat),
          },
        });
      }
    },
    * queryGoods({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      const data = yield call(queryGoodsID, parse(payload));
      if (data.data && data.data.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            listGoods: data.data.data.data,
            paginationGoods: {
              size: 'small',
              showTotal: total => `共 ${total} 条`,
              showSizeChanger: true,
              showQuickJumper: true,
              current: data.data.data.page,
              total: data.data.data.totalCount,
              pageSize: data.data.data.limit,
              pageSizeOptions: ['10', '20', '50', '100'],
            },
          },
        });
      }
    },
    * queryGoodsMini({ payload }, { call, put, select }) {
      yield put({ type: 'showLoading' });
      const data = yield call(queryGoodsID, parse(payload));
      const chooseGoodsCode = yield select(state => state.zbStockInItem.chooseGoodsCode);
      if (data.data && data.data.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            goodsList: data.data.data.data.filter(item => chooseGoodsCode.indexOf(item.id) < 0),
          },
        });
      }
    },
    * changeDetailList({ payload }, { put, select }) {
      yield put({ type: 'showLoading' });
      const detailListOld = yield select(state => state.zbStockInItem.detailList);
      const validateListOld = yield select(state => state.zbStockInItem.validateList);
      const oldSelectCode = yield select(state => state.zbStockInItem.chooseGoodsCode);
      const tempDetailList = detailListOld.filter(item => item.goodsCode);
      const tempValidateList = validateListOld.filter(item => item.goodsCode);
      const selectedGoodsArray = payload.selectedGoods;
      const currentRow = payload.currentRow < tempDetailList.length ? payload.currentRow : tempDetailList.length;
      const newSelectCode = [];
      // 删除已选物资编码数组里替换物资的编码
      oldSelectCode.map((code) => {
        if (code !== detailListOld[currentRow].goodsId) {
          newSelectCode.push(code);
        }
        return false;
      });
      // 提取前半段物资表跟验证列表,顺便丢失索引下的物资（其实是删除）
      const preGoodsArray = [];
      const preValidateArray = [];
      for (let i = 0; i < currentRow;) {
        preGoodsArray.push(tempDetailList[i]);
        preValidateArray.push(tempValidateList[i]);
        i += 1;
      }
      // 提取后半段物资表跟验证列表
      const afterGoodsArray = [];
      const afterValidateArray = [];
      for (let i = (currentRow + 1); i < tempDetailList.length;) {
        afterGoodsArray.push(tempDetailList[i]);
        afterValidateArray.push(tempValidateList[i]);
        i += 1;
      }
      // detailList抽取物品代码数组
      const detailGoodsCodesArray = [];
      detailListOld.map((item) => {
        detailGoodsCodesArray.push(item.goodsCode);
        return false;
      });
      // 循环赋值
      selectedGoodsArray.map((item) => {
        // 如果已有的表单物资里没有，那么新增该物资
        if (detailGoodsCodesArray.indexOf(item.goodsCode) < 0) {
          preGoodsArray.push(
            {
              // 隐藏字段
              id: null,
              unitId: item.unitId,
              dualUnitId: item.dualUnitId,
              goodsId: item.id,
              ordUnitId: item.ordUnitId,
              dualUnitFlag: item.dualUnitFlag,
              ordUnitName: item.ordUnitName,
              ordUnitQty: 0,
              ordUnitRates: item.ordUnitRates,
              tranRates: item.ordUnitRates,
              dualWareQty: item.dualWareQty,
              lastPrice: item.lastPrice,
              // 显示字段
              goodsCode: item.goodsCode,
              goodsName: item.goodsName,
              goodsSpec: item.goodsSpec,
              dualUnitName: item.dualUnitName,
              dualGoodsQty: 0,
              unitName: item.unitName,
              goodsQty: 0,
              unitPrice: item.lastPrice,
              goodsAmt: 0,
              taxRatio: item.taxRatio,
              goodsTaxAmt: 0,
              unitPriceNotax: item.lastPrice / (1 + Number(item.taxRatio)),
              goodsAmtNotax: 0,
              remarks: null,
            },
          );
        }
        // 如果已有的验证列表里没有该项，那么新增该项
        if (detailGoodsCodesArray.indexOf(item.goodsCode) < 0) {
          preValidateArray.push(
            {
              goodsCode: item.goodsCode,
            },
          );
        }
        return false;
      });
      // 增加后半段的值
      afterGoodsArray.map((item) => {
        preGoodsArray.push(item);
        return false;
      });
      afterValidateArray.map((item) => {
        preValidateArray.push(item);
        return false;
      });
      yield put({
        type: 'querySuccess',
        payload: {
          detailList: preGoodsArray,
          validateList: preValidateArray,
          hotTableHeight: (preGoodsArray.length * 29) + 65,
          chooseGoodsCode: newSelectCode,
          cacheGoodsCodes: newSelectCode,
        },
      });
    },
    * selectGoodsMini({ payload }, { put, select }) {
      yield put({ type: 'showLoading' });
      const detailListOld = yield select(state => state.zbStockInItem.detailList);
      const validateListOld = yield select(state => state.zbStockInItem.validateList);
      const miniData = payload.dataArray[0];
      const tempDetailList = [];
      const tempValidateList = [];
      let index = 0;
      let validateIndex = 0;
      detailListOld.map((item) => {
        if (index !== payload.row) {
          tempDetailList.push(item);
        } else if (index === payload.row) {
          tempDetailList.push(
            {
              // 隐藏字段
              id: null,
              unitId: miniData.unitId,
              dualUnitId: miniData.dualUnitId,
              goodsId: miniData.id,
              ordUnitId: miniData.ordUnitId,
              dualUnitFlag: miniData.dualUnitFlag,
              ordUnitName: miniData.ordUnitName,
              ordUnitQty: 0,
              ordUnitRates: miniData.ordUnitRates,
              tranRates: miniData.ordUnitRates,
              dualWareQty: miniData.dualWareQty,
              lastPrice: miniData.lastPrice,
              // 显示字段
              goodsCode: miniData.goodsCode,
              goodsName: miniData.goodsName,
              goodsSpec: miniData.goodsSpec,
              dualUnitName: miniData.dualUnitName,
              dualGoodsQty: 0,
              unitName: miniData.unitName,
              goodsQty: 0,
              unitPrice: miniData.lastPrice,
              goodsAmt: 0,
              taxRatio: miniData.taxRatio,
              goodsTaxAmt: 0,
              unitPriceNotax: miniData.lastPrice / (1 + Number(miniData.taxRatio)),
              goodsAmtNotax: 0,
              remarks: null,
            },
          );
        }
        index += 1;
        return false;
      });
      // 修改验证数组
      validateListOld.map((item) => {
        if (validateIndex !== payload.row) {
          tempValidateList.push(item);
        } else if (validateIndex === payload.row) {
          tempValidateList.push({
            goodsCode: null,
          });
        }
        validateIndex += 1;
        return false;
      });
      yield put({
        type: 'querySuccess',
        payload: {
          detailList: tempDetailList,
          validateList: tempValidateList,
          hotTableHeight: (tempDetailList.length * 29) + 65,
          miniGoodsVisible: false,
        },
      });
    },
    * addRow({ payload }, { put, select }) {
      const detailListOld = yield select(state => state.zbStockInItem.detailList);
      const validateListOld = yield select(state => state.zbStockInItem.validateList);
      const tempDetailList = [{
        // 隐藏字段
        id: null,
        unitId: null,
        dualUnitId: null,
        goodsId: null,
        ordUnitId: null,
        dualUnitFlag: null,
        ordUnitName: null,
        ordUnitQty: null,
        ordUnitRates: null,
        tranRates: null,
        dualWareQty: 0,
        lastPrice: 0,
        // 显示字段
        goodsCode: null,
        goodsName: null,
        goodsSpec: null,
        dualUnitName: null,
        dualGoodsQty: 0,
        unitName: null,
        goodsQty: 0,
        unitPrice: 0,
        goodsAmt: 0,
        taxRatio: 0,
        goodsTaxAmt: 0,
        unitPriceNotax: 0,
        goodsAmtNotax: 0,
        remarks: null,
      }];
      const tempValidateList = [
        {
          goodsCode: null,
        },
      ];
      yield put({
        type: 'querySuccess',
        payload: {
          detailList: [...detailListOld, ...tempDetailList],
          validateList: [...validateListOld, ...tempValidateList],
          hotTableHeight: ([...detailListOld, ...tempDetailList].length * 29) + 65,
        },
      });
    },
    * resizePage({ payload }, { put, select }) {
      const oldHotTableHeight = yield select(state => state.zbStockInItem.hotTableHeight);
      if (payload.value === -1) {
        yield put({
          type: 'querySuccess',
          payload: {
            hotTableHeight: oldHotTableHeight - 29,
          },
        });
      }
    },
    * back({ payload }, { put }) {
      const path = `/stock/zb/stockIn/${payload.storeId}`;
      yield put(routerRedux.push(path));
    },
  },
  reducers: {
    showLoading(state) {
      return { ...state, loading: true };
    },
    hideLoading(state) {
      return { ...state, loading: false };
    },
    showLoadingSave(state) {
      return { ...state, loadingSave: true };
    },
    hideLoadingSave(state) {
      return { ...state, loadingSave: false };
    },
    showLoadingStock(state) {
      return { ...state, loadingStock: true };
    },
    hideLoadingStock(state) {
      return { ...state, loadingStock: false };
    },
    querySuccess(state, action) { return { ...state, ...action.payload, loading: false }; },
    showModal(state, action) {
      return {
        ...state,
        ...action.payload,
        modalVisible: true,
        modalKey: Date.parse(new Date()) / 1000,
      };
    },
    hideModal(state) {
      return { ...state, modalVisible: false };
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        const pathname = location.pathname;
        const re = pathToRegexp('/stock/zb/stockIn/item/:itemId/:storeId/:id');
        const match = re.exec(pathname);
        if (match) {
          const pageType = match[1];
          const storeId = match[2];
          const id = match[3] === '0' ? '' : match[3];
          const detailList = [];
          if (pageType === 'add') {
            for (let i = 0; i < 1; i += 1) {
              detailList.push(
                {
                  // 隐藏字段
                  id: null,
                  unitId: null,
                  dualUnitId: null,
                  goodsId: null,
                  ordUnitId: null,
                  dualUnitFlag: null,
                  ordUnitName: null,
                  ordUnitQty: null,
                  ordUnitRates: null,
                  tranRates: null,
                  dualWareQty: 0,
                  lastPrice: 0,
                  // 显示字段
                  goodsCode: null,
                  goodsName: null,
                  goodsSpec: null,
                  dualUnitName: null,
                  dualGoodsQty: 0,
                  unitName: null,
                  goodsQty: 0,
                  unitPrice: 0,
                  goodsAmt: 0,
                  taxRatio: 0,
                  goodsTaxAmt: 0,
                  unitPriceNotax: 0,
                  goodsAmtNotax: 0,
                  remarks: null,
                },
              );
            }
          } else if (pageType === 'view' || 'edit') {
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
              storeId,
              pageType,
              detailList,
              id,
              listGoods: [],
              miniGoodsVisible: false,
              hotTableHeight: (detailList.length * 29) + 65,
              validateList: [
                {
                  goodsCode: null,
                },
              ],
            },
          });
          if (pageType === 'add') { // 新增入库单之前，清空一些条件
            dispatch({
              type: 'querySuccess',
              payload: {
                chooseGoodsCode: [],
                cacheGoodsCodes: [],
                billType: null,
                busiId: null,
                busiName: null,
                bussDate: moment().format(dateFormat),
                depotId: null,
                depotName: null,
                remarks: null,
              },
            });
          }
          dispatch({
            type: 'addForm',
            payload: {
              storeId,
            },
          });
          dispatch({
            type: 'queryTree',
            payload: {
              type: '0',
            },
          });
        }
      });
    },
  },
};
