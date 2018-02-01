import { parse } from 'qs';
import { message } from 'antd';
import _ from 'lodash';
import { queryWarehouse, queryGoodsID, findTreeList, queryOrg } from '../../services/inventory/common';
import { query, addPriorityByOne, addSupplyGoods, addDepot, check, delSupplyGoods } from '../../services/inventory/depotRelationSetting';

export default {
  namespace: 'depotRelationSetting',
  state: {
    list: [],
    valueGoods: [],
    valueShop: [],
    storeIdList: [],
    valueStores: [],
    setPriority: '',
    modalSelectValue: '',
    supplierId: '',
    supplierList: [],
    scmInStoreList: [],
    goodsList: [],
    storeId: '',
    addVisible: false,
    dataList: [],
    fetching: false,
    fetchingGoods: false,
    fetchingSupplier: false,
    fetchingStores: false,
    supplierAloneList: [],
    goodsAloneList: [],
    storeGoodsGetAll: [],
    addGoodsVisible: false,
    findTreeList: [],
    selectedRowKeysModal: [],
    paginationVerify: {
      showTotal: total => `共 ${total} 条`,
      current: 1,
      total: 0,
      pageSize: 10,
      size: 'default',
    },
    paginationGoods: {
      showTotal: total => `共 ${total} 条`,
      current: 1,
      total: 0,
      size: 'default',
    },
    paginationGoodsModal: {
      showTotal: total => `共 ${total} 条`,
      current: 1,
      total: 0,
      size: 'default',
    },
    paginationSupply: {
      showTotal: total => `共 ${total} 条`,
      current: 1,
      total: 0,
      pageSize: 10,
      size: 'default',
    },
    paginationStore: {
      showTotal: total => `共 ${total} 条`,
      current: 1,
      total: 0,
      size: 'default',
    },
    paginationBySupplier: {
      showTotal: total => `共 ${total} 条`,
      current: 1,
      total: 0,
      size: 'default',
    },
    paginationPrioritysModal: {
      showTotal: total => `共 ${total} 条`,
      current: 1,
      total: 0,
      size: 'default',
    },
    paginationSupplyLeft: {
      showTotal: total => `共 ${total} 条`,
      current: 1,
      total: 0,
      size: 'default',
    },
    paginationSupplyStore: {
      showTotal: total => `共 ${total} 条`,
      current: 1,
      total: 0,
      size: 'default',
    },
    goodsModalList: [],
    cateId: '',
    goodsRowKeysModal: [],
    goodsRowConcatList: [],
    priorityRowList: [],
    aclStoreListAll: [],
    storeRowKeysModal: [],
    storeRowConcatList: [],
    supplierFindAdd: {
      depotId: '',
      depotName: '',
    },
    depotList: [],
    findGoodsBySupplierList: [],
    tenantPriorityList: [],
    supplyGoodsPrioritySave: {
      supplyId: '',
      supplyCode: '',
      supplyName: '',
    },
    selectSupplyDefault: 'A',
    goodsListValue: [],
    depotIdListValue: [],
    storeIdListValue: [],
    priorityRowListNewData: [], // 实时更新新的选择
    selectedSupplierRowKeys: [], // 实时更新新的选择
    orgInfoIdList: [], // 物流中心
    orgInfoId: '', // 物流中心id
    depotRowConcatList: [], // 一页的数据
    depotOldRowListAll: [], // 全部数据
    orgInfoName: '', // 物流中心名称
    verifyVisible: false, // 物流中心名称
    verifyModalList: [], // 存在供货关系的数组
    verifyDetailList: [], // 新增配送关系的全部数组
    verifyVisibleDiffList: [], // 没有供应关系的数组
    verifyRowConcatList: [], // 去除供应商的数组

    // depotRowKeysModal: [], // 首页数据
  },
  effects: {
    * query({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      const data = yield call(query, parse(payload));
      if (data.data && data.data.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            dataList: data.data.data.page.data,
            paginationSupply: {
              showSizeChanger: true,
              showQuickJumper: true,
              total: data.data.data.page.totalCount,
              current: data.data.data.page.page,
              pageSize: data.data.data.page.limit,
              showTotal: total => `共 ${total} 条`,
              size: 'default',
              pageSizeOptions: [10, 20, 50, 100],
            },
          },
        });
      } else {
        message.error(data.data.errorInfo);
        yield put({ type: 'hideLoading' });
      }
    },
    * querySupplier({ payload }, { call, put, select }) {
      yield put({ type: 'showSupplierLoading' });
      const data = yield call(queryWarehouse, parse(payload));
      const valueShop = yield select(state => state.depotRelationSetting.valueShop);
      if (data.data && data.data.success) {
        let newShopList = data.data.data.page.data;
        newShopList = newShopList.concat(valueShop);
        newShopList = _.uniqBy(newShopList, 'id');
        yield put({
          type: 'updateDate',
          payload: {
            supplierList: newShopList,
            supplierAloneList: data.data.data.page.data,
            supplierPriorityList: data.data.data.page.data,
            fetching: false,
            paginationSupplyLeft: {
              total: data.data.data.page.totalCount,
              current: data.data.data.page.page,
              showTotal: total => `共 ${total} 条`,
              size: 'default',
            },
          },
        });
      } else {
        message.warning(`操作失败，请参考：${data.data.errorInfo}`);
        yield put({ type: 'hideSupplierLoading' });
      }
    },
    // * queryGoosUpdate({ payload }, { call, put }) {
    //   yield put({ type: 'showLoading' });
    //   const data = yield call(querySupplier, parse(payload));
    //   if (data.data && data.data.success) {
    //     yield put({
    //       type: 'querySuccess',
    //       payload: {
    //         supplierPriorityList: data.data.data.page.data,
    //         paginationSupplyStore: {
    //           total: data.data.data.page.totalCount,
    //           current: data.data.data.page.page,
    //           showTotal: total => `共 ${total} 条`,
    //           size: 'default',
    //         },
    //       },
    //     });
    //   } else {
    //     message.warning(`操作失败，请参考：${data.data.errorInfo}`);
    //     yield put({ type: 'hideLoading' });
    //   }
    // },
    * queryDepot({ payload }, { call, put }) {
      // yield put({ type: 'showLoading' });
      const data = yield call(queryOrg, parse(payload));
      if (data.data && data.data.success) {
        yield put({
          type: 'updateDate',
          payload: {
            depotList: data.data.data.aclStoreList,
            fetchingStores: false,
            storeIdList: data.data.data.aclStoreList,
          },
        });
      } else {
        message.error(data.data.errorInfo);
        yield put({ type: 'hideLoading' });
      }
    },
    * newQueryDepot({ payload }, { call, put, select }) {
      yield put({ type: 'showStoreIdLoading' });
      const data = yield call(queryOrg, parse(payload));
      const valueStores = yield select(state => state.depotRelationSetting.valueStores);
      if (data.data && data.data.success) {
        let newStoreList = data.data.data.aclStoreList;
        newStoreList = newStoreList.concat(valueStores);
        newStoreList = _.uniqBy(newStoreList, 'id');
        yield put({
          type: 'updateDate',
          payload: {
            storeIdList: newStoreList,
            fetchingStores: false,
          },
        });
      } else {
        message.error(data.data.errorInfo);
        yield put({ type: 'hideStoreIdLoading' });
      }
    },
    * addPriorityByOne({ payload }, { call, put, select }) {
      yield put({ type: 'showLoading' });
      const data = yield call(addPriorityByOne, parse(payload));
      const goodsListValue = yield select(state => state.depotRelationSetting.goodsListValue);
      const depotIdListValue = yield select(state => state.depotRelationSetting.depotIdListValue);
      const storeIdListValue = yield select(state => state.depotRelationSetting.storeIdListValue);
      const paginationSupply = yield select(state => state.depotRelationSetting.paginationSupply);
      if (data.data && data.data.success) {
        message.success('设置成功');
        yield put({
          type: 'query',
          payload: {
            page: paginationSupply.current,
            rows: paginationSupply.pageSize,
            goodIdList: goodsListValue,
            supplyList: depotIdListValue,
            storeIdList: storeIdListValue,
          },
        });
      } else {
        message.error(data.data.errorInfo);
        yield put({ type: 'hideLoading' });
      }
    },
    * addSupplyGoods({ payload }, { call, put, select }) {
      yield put({ type: 'showLoading' });
      const data = yield call(addSupplyGoods, payload);
      const goodsListValue = yield select(state => state.depotRelationSetting.goodsListValue);
      const depotIdListValue = yield select(state => state.depotRelationSetting.depotIdListValue);
      const storeIdListValue = yield select(state => state.depotRelationSetting.storeIdListValue);
      if (data.data && data.data.success) {
        message.success('新增成功');
        yield put({
          type: 'query',
          payload: {
            page: 1,
            rows: 10,
            goodsList: goodsListValue,
            supplyList: depotIdListValue,
            storeIdList: storeIdListValue,
          },
        });
        yield put({
          type: 'querySuccess',
          payload: {
            goodsModalList: [],
            storeRowKeysModal: [],
            goodsRowConcatList: [],
            storeRowConcatList: [],
            storeGoodsGetAll: [],
            supplierFindAdd: {
              depotId: '',
            },
          },
        });
      } else {
        message.warning(`操作失败，请参考：${data.data.errorInfo}`);
        yield put({ type: 'hideLoading' });
      }
    },
    * addDepotAll({ payload }, { call, put, select }) {
      yield put({ type: 'showLoading' });
      const data = yield call(addDepot, payload);
      const { goodsListValue, depotIdListValue, storeIdListValue, orgInfoId } = yield select(state => state.depotRelationSetting);
      if (data.data && data.data.success) {
        message.success('新增成功');
        yield put({
          type: 'query',
          payload: {
            page: 1,
            rows: 10,
            orgInfoId,
            goodIdList: goodsListValue,
            depotIdList: depotIdListValue,
            storeIdList: storeIdListValue,
          },
        });
        yield put({
          type: 'querySuccess',
          payload: {
            verifyVisible: false,
            addVisible: false,
            goodsModalList: [],
            storeRowKeysModal: [],
            goodsRowConcatList: [],
            storeRowConcatList: [],
            storeGoodsGetAll: [],
            supplierFindAdd: {
              depotId: '',
            },
            verifyModalList: [],
            verifyRowConcatList: [],
            paginationVerify: {
              total: 0,
              current: 1,
              pageSize: 10,
              showTotal: total => `共 ${total} 条`,
            },
          },
        });
      } else {
        message.warning(`操作失败，请参考：${data.data.errorInfo}`);
        yield put({ type: 'hideLoading' });
      }
    },
    * verifySupplyGoods({ payload }, { call, put, select }) {
      yield put({ type: 'showLoading' });
      const data = yield call(check, payload);
      const { goodsListValue, depotIdListValue, storeIdListValue, orgInfoId } = yield select(state => state.depotRelationSetting);
      const verifyDetailList = yield select(state => state.depotRelationSetting.verifyDetailList);
      const verifyDetailListAll = _.cloneDeep(verifyDetailList);
      if (data.data && data.data.success) {
        // console.log("我是有关系的全部数据newData",newData,"我是移除之前verifyDetailList",verifyDetailListAll);
        // _.pullAllWith(verifyDetailListAll, newData, _.include);
        // console.log("我是之后的verifyDetailList",verifyDetailListAll);
        const dataList = data.data.data;
        if (dataList.length > 0) {
          yield put({
            type: 'updateDate',
            payload: {
              verifyVisible: true,
            },
          });
        // console.log("dataList",dataList);
          dataList.map((item) => {
            // console.log("item.goodsId + item.storeId", item.goodsId + item.storeId);
            // newDataList.push({ id: item.goodsId + item.storeId })
            Object.assign(item, { id: item.goodsId + item.storeId });
            return item;
          });
          // console.log("333333333333333dataList",dataList);
          yield put({
            type: 'querySuccess',
            payload: {
              // verifyVisible: true,
              verifyModalList: dataList,
              verifyRowConcatList: dataList,
              paginationVerify: {
                total: dataList.length,
                current: 1,
                pageSize: 10,
                showTotal: total => `共 ${total} 条`,
              },
            },
          });
          let newData = [];
          newData = verifyDetailListAll.filter((item) => {
            const newDataList = dataList.every((itemData) => {
              const isRemove = !((itemData.goodsId === item.goodsId) && (itemData.storeId === item.storeId));
              return isRemove;
            });
            return newDataList;
          });
          // console.log("我是全部的数据newData", newData);
          // return false;
          yield put({
            type: 'updateDate',
            payload: {
              verifyVisibleDiffList: newData,
            },
          });
        } else {
          message.success('新增成功');
          yield put({
            type: 'query',
            payload: {
              page: 1,
              rows: 10,
              orgInfoId,
              goodIdList: goodsListValue,
              depotIdList: depotIdListValue,
              storeIdList: storeIdListValue,
            },
          });
          yield put({
            type: 'updateDate',
            payload: {
              addVisible: false,
              goodsModalList: [],
              storeRowKeysModal: [],
              goodsRowConcatList: [],
              storeRowConcatList: [],
              storeGoodsGetAll: [],
              supplierFindAdd: {
                depotId: '',
              },
            },
          });
        }
        // console.log("我是全部数据",data.data);
      } else {
        message.warning(`操作失败，请参考：${data.data.errorInfo}`);
        yield put({ type: 'hideLoading' });
      }
    },
    // * addSupplyPriority({ payload }, { call, put, select }) {
    //   yield put({ type: 'showLoading' });
    //   const data = yield call(addSupplyPriority, payload);
    //   const goodsListValue = yield select(state => state.depotRelationSetting.goodsListValue);
    //   const depotIdListValue = yield select(state => state.depotRelationSetting.depotIdListValue);
    //   const storeIdListValue = yield select(state => state.depotRelationSetting.storeIdListValue);
    //   if (data.data && data.data.success) {
    //     message.success('设置成功');
    //     yield put({
    //       type: 'query',
    //       payload: {
    //         page: 1,
    //         rows: 10,
    //         goodsList: goodsListValue,
    //         supplyList: depotIdListValue,
    //         storeIdList: storeIdListValue,
    //       },
    //     });
    //     yield put({
    //       type: 'querySuccess',
    //       payload: {
    //         priorityRowList: [],
    //         priorityRowListNewData: [],
    //         selectedSupplierRowKeys: [],
    //         supplierPriorityList: [],
    //         findGoodsBySupplierList: [],
    //         storeId: '',
    //         supplyGoodsPrioritySave: {
    //           supplyId: '',
    //         },
    //       },
    //     });
    //   } else {
    //     message.warning(`操作失败，请参考：${data.data.errorInfo}`);
    //     yield put({ type: 'hideLoading' });
    //   }
    // },
    * delSupplyGoods({ payload }, { call, put, select }) {
      yield put({ type: 'showLoading' });
      const data = yield call(delSupplyGoods, { delIds: payload.delIds });
      const { goodsListValue, depotIdListValue, dataList, paginationSupply, storeIdListValue, orgInfoId } = yield select(state => state.depotRelationSetting);
      if (data.data && data.data.success) {
        message.success('删除成功');
        let pageSize = '';
        if (payload.type === 'all') {
          pageSize = 1;
        } else if (payload.type === 'one' && dataList.length === 1 && paginationSupply.current !== 1) {
          pageSize = paginationSupply.current - 1;
        } else {
          pageSize = paginationSupply.current;
        }
        yield put({
          type: 'query',
          payload: {
            page: pageSize,
            rows: paginationSupply.pageSize,
            orgInfoId,
            goodIdList: goodsListValue,
            depotIdList: depotIdListValue,
            storeIdList: storeIdListValue,
          },
        });
        yield put({
          type: 'querySuccess',
          payload: {
            depotRowConcatList: [],
          },
        });
      } else {
        message.warning(`操作失败，请参考：${data.data.errorInfo}`);
        yield put({ type: 'hideLoading' });
      }
    },
    * findAclStoreForPage({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      const data = yield call(queryOrg, parse(payload));
      if (data.data && data.data.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            aclStoreListAll: data.data.data.aclStoreList,
            paginationStore: {
              showSizeChanger: true,
              showQuickJumper: true,
              total: data.data.data.totalCount,
              current: data.data.data.page,
              showTotal: total => `共 ${total} 条`,
              size: 'default',
              pageSizeOptions: [10, 20, 50, 100],
            },
          },
        });
      } else {
        message.warning(`操作失败，请参考：${data.data.errorInfo}`);
        yield put({ type: 'hideLoading' });
      }
    },
    * findAclOrgInfoIdList({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      const data = yield call(queryOrg, parse(payload));
      if (data.data && data.data.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            orgInfoIdList: data.data.data.aclStoreList,
          },
        });
        if (data.data.data.aclStoreList.length === 1) {
          yield put({
            type: 'query',
            payload: {
              orgInfoId: data.data.data.aclStoreList[0].id,
              page: 1,
              rows: 10,
            },
          });
          yield put({ // 获取仓库
            type: 'depotRelationSetting/querySupplier',
            payload: {
              storeId: data.data.data.aclStoreList[0].id,
            },
          });
          // 获取门店
          yield put({
            type: 'depotRelationSetting/queryDepot',
            payload: { distribId: data.data.data.aclStoreList[0].id, orgType: 1, rows: 10 },
          });
          yield put({
            type: 'updateDate',
            payload: {
              orgInfoId: data.data.data.aclStoreList[0].id,
              orgInfoName: data.data.data.aclStoreList[0].name,
            },
          });
        }
      } else {
        message.warning(`操作失败，请参考：${data.data.errorInfo}`);
        yield put({ type: 'hideLoading' });
      }
    },
    // * findGoodsBySupplier({ payload }, { call, put, select }) { // 根据供应商查询物资
    //   yield put({ type: 'showLoading' });
    //   const data = yield call(findGoodsBySupplier, parse(payload));
    //   const priorityRowList = yield select(state => state.depotRelationSetting.priorityRowList);
    //   if (data.data && data.data.success) {
    //     const newData = data.data.data.page.data;
    //     if (priorityRowList.length !== 0) {
    //       priorityRowList.map((item) => {
    //         // const dateList = _.find(newData, subItem => subItem.id === item.id);
    //         // console.log("dateList", dateList);
    //         // dateList ? dateList.priority = item.priority : dateList.priority;
    //         // return newData;
    //         newData.map((subItem) => {
    //           if (subItem.id === item.id) {
    //             subItem.priority = item.priority;
    //           }
    //           return subItem.priority;
    //         });
    //         return newData;
    //       });
    //     }
    //     // console.log("分页之后出现的错误是否赋值",newData);
    //     yield put({
    //       type: 'querySuccess',
    //       payload: {
    //         findGoodsBySupplierList: newData,
    //         paginationBySupplier: {
    //           total: data.data.data.page.totalCount,
    //           current: data.data.data.page.page,
    //           showTotal: total => `共 ${total} 条`,
    //           size: 'default',
    //         },
    //       },
    //     });
    //   } else {
    //     message.warning(`操作失败，请参考：${data.data.errorInfo}`);
    //     yield put({ type: 'hideLoading' });
    //   }
    // },
    * findScmInGoods({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      const data = yield call(queryGoodsID, parse(payload));
      if (data.data && data.data.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            goodsAloneList: data.data.data.data,
            paginationGoods: {
              howSizeChanger: true,
              showQuickJumper: true,
              total: data.data.data.totalCount,
              current: data.data.data.page,
              showTotal: total => `共 ${total} 条`,
              size: 'small',
            },
          },
        });
      } else {
        message.warning(`操作失败，请参考：${data.data.errorInfo}`);
        yield put({ type: 'hideLoading' });
      }
    },
    * findScmShowGoods({ payload }, { call, put, select }) {
      yield put({ type: 'showGoodsLoading' });
      const data = yield call(queryGoodsID, parse(payload));
      const valueGoods = yield select(state => state.depotRelationSetting.valueGoods);
      if (data.data && data.data.success) {
        let newgoodsList = data.data.data.data;
        newgoodsList = newgoodsList.concat(valueGoods);
        newgoodsList = _.uniqBy(newgoodsList, 'id');
        yield put({
          type: 'updateDate',
          payload: {
            goodsList: newgoodsList,
            fetchingGoods: false,
          },
        });
      } else {
        message.warning(`操作失败，请参考：${data.data.errorInfo}`);
        yield put({ type: 'hideGoodsLoading' });
      }
    },
    * findTreeList({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      const data = yield call(findTreeList, parse(payload));
      if (data.data && data.data.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            findTreeList: data.data.data,
          },
        });
      } else {
        message.warning(`操作失败，请参考：${data.data.errorInfo}`);
        yield put({ type: 'hideLoading' });
      }
    },
  },
  reducers: {
    showLoading(state) {
      return { ...state, loading: true };
    },
    showSupplierLoading(state) {
      return { ...state, fetching: true };
    },
    hideSupplierLoading(state) {
      return { ...state, fetching: false };
    },
    showStoreIdLoading(state) {
      return { ...state, fetchingStores: true };
    },
    hideStoreIdLoading(state) {
      return { ...state, fetchingStores: false };
    },
    showGoodsLoading(state) {
      return { ...state, fetchingGoods: true };
    },
    hideGoodsLoading(state) {
      return { ...state, fetchingGoods: false };
    },
    hideLoading(state) {
      return { ...state, loading: false };
    },
    querySuccess(state, action) {
      return { ...state, ...action.payload, loading: false };
    },
    updateDate(state, action) {
      return { ...state, ...action.payload };
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/stock/depotRelationSetting') {
          dispatch({ // 获取物流中心
            type: 'findAclOrgInfoIdList',
            payload: { orgType: 2, rows: 10 },
          });
          // 获取物品
          dispatch({
            type: 'findScmShowGoods',
            payload: {
              limit: '20',
              status: '1',
              queryString: '',
            },
          });
          // 获取机构编码
          // dispatch({
          //   type: 'findAclStoreForPage',
          //   payload: {
          //     rows: 10,
          //     page: 1,
          //   },
          // });
          // 获取类别树
          dispatch({
            type: 'findTreeList',
            payload: { type: 0 },
          });
        }
      });
    },
  },
};
