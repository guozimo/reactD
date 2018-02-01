import React, { PropTypes } from 'react';
import { connect } from 'dva';
import { message } from 'antd';
import _ from 'lodash';
import SupplyList from '../../components/Inventory/SupplyRelation/list';
import SupplySearch from '../../components/Inventory/SupplyRelation/search';
import SupplyModalAdd from '../../components/Inventory/SupplyRelation/modalAdd';
import SupplyModalExplore from '../../components/Inventory/SupplyRelation/modalSupply';
import SupplyAddGoodsModal from '../../components/Inventory/SupplyRelation/modal';

const SupplyRelation = ({ supplyData, dispatch }) => {
  const {
  depotList,
  loading,
  dataList,
  storeList,
  addVisible,
  exportVisible,
  goodsList,
  supplierList,
  fetching,
  fetchingGoods,
  fetchingSupplier,
  supplierAloneList,
  goodsAloneList,
  addGoodsVisible,
  findTreeList,
  paginationGoods,
  selectedRowKeysModal,
  cateId,
  goodsModalList,
  goodsRowKeysModal,
  goodsRowConcatList,
  paginationSupply,
  aclStoreListAll,
  paginationStore,
  supplierPriorityList,
  scmInStoreList,
  storeRowConcatList,
  storeRowKeysModal,
  supplierFindAdd,
  storeId,
  paginationBySupplier,
  findGoodsBySupplierList,
  selectSupplyDefault,
  selectedPriorityRowKeys,
  priorityRowList,
  tenantPriorityList,
  supplyGoodsPrioritySave,
  setPriority,
  supplierId,
  valueGoods,
  fetchingStores,
  storeIdList,
  modalSelectValue,
  goodsListValue,
  supplyListValue,
  storeIdListValue,
  priorityRowListNewData,
  paginationSupplyStore,
  selectedSupplierRowKeys,
  storeGoodsGetAll,
  verifyVisible, // 校验弹窗
  verifyModalList, // 校验弹窗数据
  paginationVerify, // 分页
  verifyRowConcatList, // 校验弹窗勾选的数据
  verifyVisibleDiffList,
  supplyListRowConcatList,
  } = supplyData.supplyRelation;
  const { menuData } = supplyData.merchantApp;
  const setSupplySearch = { // 首页请求搜索功能
    menuData,
    storeIdList,
    goodsList,
    supplierList,
    valueGoods,
    fetching,
    fetchingGoods,
    fetchingStores,
    supplyListRowConcatList,
    onDelete() { // 批量删除
      const delIdsList = [];
      if (supplyListRowConcatList.length > 0) {
        supplyListRowConcatList.map((item) => {
          delIdsList.push(item.id);
          return delIdsList;
        });
        dispatch({
          type: 'supplyRelation/delSupplyGoods',
          payload: {
            delIds: delIdsList,
            type: 'all',
          },
        });
      } else {
        message.error('请选择要删除的订单')
      }
      // const oldData = depotOldRowListAll || [];
      // const newData = depotRowConcatList;
      // let allData = [];
      // allData = oldData.concat(newData);
      // allData = _.uniqBy(allData, 'id');
      // dispatch({
      //   type: 'depotRelationSetting/querySuccess',
      //   payload: {
      //     depotOldRowListAll: allData,
      //     // priorityRowListNewData: allData,
      //   },
      // });
    },
    onAdd() {
      dispatch({
        type: 'supplyRelation/querySuccess',
        payload: {
          addVisible: true,
        },
      });
    },
    setPriority() {
      dispatch({
        type: 'supplyRelation/querySuccess',
        payload: {
          exportVisible: true,
        },
      });
    },
    changeShop(value) { // 供应商名称修改
      // console.log("供应商value",value);
      const newValueShop = [];
      value && value.forEach((data) => {
        newValueShop.push(_.find(supplierList, item => item.id === data));
      });
      dispatch({
        type: 'supplyRelation/querySuccess',
        payload: {
          valueShop: newValueShop,
        },
      });
    },
    fetchShop(value) { // 供应商名称搜索
      dispatch({
        type: 'supplyRelation/querySuccess',
        payload: {
          fetching: true,
        },
      });
      dispatch({
        type: 'supplyRelation/querySupplier',
        payload: {
          status: 1,
          rows: '1000',
          queryString: value,
        },
      });
    },
    changeGoods(value) { // 物资名称修改
      // console.log("物资value",value);
      const newValueGoods = [];
      value && value.forEach((data) => {
        newValueGoods.push(_.find(goodsList, item => item.id === data));
      });
        // console.log("newValueGoods",newValueGoods)
      dispatch({
        type: 'supplyRelation/querySuccess',
        payload: {
          valueGoods: newValueGoods,
        },
      });
    },
    fetchGoods(value) { // 物资名称搜索
      // console.log("改变物资value",value);
      dispatch({
        type: 'supplyRelation/querySuccess',
        payload: {
          fetchingGoods: true,
        },
      });
      dispatch({
        type: 'supplyRelation/findScmShowGoods',
        payload: {
          limit: '20',
          status: '1',
          queryString: value,
        },
      });
    },
    changeStores(value) { // 门店名称修改
      // console.log("门店value",value);
      const newValueStores = [];
      value && value.forEach((data) => {
        newValueStores.push(_.find(storeIdList, item => item.id === data));
      });
        // console.log("newValueStores",newValueStores)
      dispatch({
        type: 'supplyRelation/querySuccess',
        payload: {
          valueStores: newValueStores,
        },
      });
    },
    fetchStores(value) { // 门店名称搜索
      // console.log("改变门店value",value);
      dispatch({
        type: 'supplyRelation/querySuccess',
        payload: {
          fetchingStores: true,
        },
      });
      dispatch({
        type: 'supplyRelation/newQueryDepot',
        payload: {
          rows: 10,
          queryString: value,
        },
      });
    },
    onSearch(value) { // 全部搜索
      // console.log("我是搜索value",value,);
      dispatch({
        type: 'supplyRelation/query',
        payload: {
          page: 1,
          rows: 10,
          goodsList: value.goodsList,
          supplyList: value.supplyList,
          storeIdList: value.storeIdList,
        },
      });
      dispatch({
        type: 'supplyRelation/querySuccess',
        payload: {
          goodsListValue: value.goodsList,
          supplyListValue: value.supplyList,
          storeIdListValue: value.storeIdList,
        },
      });
    },
  };
  const setListState = {  // 首页请求列表功能
    menuData,
    dataList,
    paginationSupply,
    loading,
    supplyListRowConcatList,
    supplyListRowConcat(keys, value) {
      const oldData = supplyListRowConcatList || [];
      const newData = value;
      let allData = [];
      allData = oldData.concat(newData);
      allData = _.uniqBy(allData, 'id');
      // dispatch({
      //   type: 'supplyRelation/querySuccess',
      //   payload: {
      //     selectedRowKeysModal: keys,
      //     // goodsRowKeysModal: keys,
      //   },
      // });
      dispatch({
        type: 'supplyRelation/querySuccess',
        payload: {
          supplyListRowConcatList: allData,
          // paginationGoodsModal: {
          //   showSizeChanger: true,
          //   showQuickJumper: true,
          //   total: goodsModalList.length,
          //   current: 1,
          //   showTotal: total => `共 ${total} 条`,
          //   size: 'default',
          // },
        },
      });
    },
    removeSupplyListExport(record, selected, selectedRows) {  // 删除的数据
      // console.log("11111selected----------",selected ,record.id);
      if (selected === false) { // 取消选择
        const depotRowConcatListClone = _.cloneDeep(supplyListRowConcatList);
        _.remove(depotRowConcatListClone, (item) => {
            //  console.log("item.id",item.id);
          return item.id === record.id;
        });
        // console.warn("goodsRowConcatListClone",goodsRowConcatListClone);
        dispatch({
          type: 'supplyRelation/querySuccess',
          payload: {
            supplyListRowConcatList: depotRowConcatListClone,
          },
        });
      }
      // console.log("我是删除的-----", priorityRowList, newPriorityRowList);
    },
    supplyListExportAll(selected, selectedRows, changeRows) {  // 删除的数据
      // console.log("2222selected----------",selected,selectedRows,changeRows);
      if (selected === false) { // 取消选择
        const depotRowConcatListClone = _.cloneDeep(supplyListRowConcatList);
        dataList.map((item) => {
          _.remove(depotRowConcatListClone, data => {
              // console.log("item.id",item.id);
            return data.id === item.id;
          });
        });
        // console.log("你好删除的数据",goodsRowConcatListClone);
        dispatch({
          type: 'supplyRelation/querySuccess',
          payload: {
            supplyListRowConcatList: depotRowConcatListClone,
          },
        });
      }
      // console.log("我是删除的-----", priorityRowList, newPriorityRowList);
    },
    onPageChange(page, filters, sorter) {
      let newFilters = '';
      let timeDesc = '';
      // console.log("timeDesc", timeDesc ,sorter);
      if (Object.keys(sorter).length !== 0) {
        sorter.order === 'ascend' ? timeDesc = 'asc' : timeDesc = 'desc';
      }
      Object.keys(filters).length !== 0 && filters.priority.length === 1 ? (newFilters = filters.priority[0]) : newFilters;
      dispatch({
        type: 'supplyRelation/query',
        payload: {
          goodsList: goodsListValue,
          supplyList: supplyListValue,
          storeIdList: storeIdListValue,
          page: page.current,
          rows: page.pageSize,
          priority: newFilters,
          timeDesc,
        },
      });
    },
    onPageSizeChange(current, pageSize) {
      dispatch({
        type: 'supplyRelation/query',
        payload: {
          goodsList: goodsListValue,
          supplyList: supplyListValue,
          storeIdList: storeIdListValue,
          page: 1,
          rows: pageSize,
        },
      });
    },
    onDeleteItem(id) {
      // console.log("id",id);
      dispatch({
        type: 'supplyRelation/delSupplyGoods',
        payload: {
          delIds: [id],
          type: 'one',
        },
      });
    },
    updateSupplyChange(record) {
      let newValue = '';
      record.priority === 'A' ? (newValue = 'B') : (newValue = 'A');
      // console.log("priority",record.priority,"newValue",newValue);
      dispatch({
        type: 'supplyRelation/addPriorityByOne',
        payload: {
          storeId: record.storeId,
          supplyId: record.supplyId,
          goodsId: record.goodsId,
          priority: newValue,
        },
      });
    },
  };
  const setSupplyAdd = {  // 新增供货关系弹窗
    menuData,
    storeList,
    addVisible,
    aclStoreListAll,
    paginationStore,
    supplierAloneList,
    goodsModalList,
    goodsRowKeysModal,
    scmInStoreList,
    storeRowKeysModal,
    storeGoodsGetAll,
    goodsRowConcatList,
    verifyVisible, // 校验弹窗
    verifyModalList, // 校验弹窗数据
    paginationVerify, // 分页
    verifyRowConcatList,
    loading,
    supplyId: supplierFindAdd.supplyId,
    supplyName: supplierFindAdd.supplyName,
    onVerifyPageChange(page) {
      dispatch({
        type: 'supplyRelation/querySuccess',
        payload: {
          paginationVerify: {
            total: verifyModalList.length,
            current: page.current,
            showTotal: total => `共 ${total} 条`,
            pageSize: 10,
            size: 'default',
          },
        },
      });
    },
    verifyRowConcat(keys, value) {
      // console.log("-------------keys", keys, "value", value);
      const oldData = verifyRowConcatList || [];
      const newData = value;
      let allData = [];
      allData = oldData.concat(newData);
      allData = _.uniqBy(allData, 'id');
      // console.log("-------------allData", allData);
      // dispatch({
      //   type: 'supplyRelation/querySuccess',
      //   payload: {
      //     verifyRowKeysModal: keys,
      //   },
      // });
      dispatch({
        type: 'supplyRelation/querySuccess',
        payload: {
          verifyRowConcatList: allData,
        },
      });
    },
    removeVerifyExport(record, selected) {  // 删除的数据
      // console.log("11111selected----------",selected ,record.id);
      if (selected === false) { // 取消选择
        const verifyRowConcatListClone = _.cloneDeep(verifyRowConcatList);
        _.remove(verifyRowConcatListClone, item => item.id === record.id);
        dispatch({
          type: 'supplyRelation/querySuccess',
          payload: {
            verifyRowConcatList: verifyRowConcatListClone,
          },
        });
      }
      // console.log("我是删除的-----", priorityRowList, newPriorityRowList);
    },
    verifyExportAll(selected, selectedRows, changeRows) {  // 删除的数据
      // dispatch({
      //   type: 'supplyRelation/querySuccess',
      //   payload: {
      //     verifyRowConcatList: selectedRows,
      //   },
      // });
      // console.log("selectedRows",selectedRows,"changeRows",changeRows);
      if (selected === false) { // 取消选择
        const verifyRowConcatListClone = _.cloneDeep(verifyRowConcatList);
        changeRows.map((item) => {
          _.remove(verifyRowConcatListClone, data => {
              // console.log("item.id",item.id);
            return data.id === item.id;
          });
        });
        // console.log("你好删除的数据",goodsRowConcatListClone);
        dispatch({
          type: 'supplyRelation/querySuccess',
          payload: {
            verifyRowConcatList: verifyRowConcatListClone,
          },
        });
      }
      // console.log("我是删除的-----", priorityRowList, newPriorityRowList);
    },
    handleVerifyOk() {
      // console.warn("storeRowConcatList",storeRowConcatList,"goodsRowConcatList",goodsRowConcatList);
    // verifyModalList
    // 查找没有供应关系的物资
    // verifyDetailList
    // let newVerifyModalList = [];
    // verifyModalList.map((item) => {
    //
    // })
      const newVerifyRowConcatList = [];
      verifyRowConcatList.map((item) => {
        newVerifyRowConcatList.push({
          goodDirection: item.goodDirection,
          goodsId: item.goodsId,
          goodsCode: item.goodsCode,
          goodsName: item.goodsName,
          storeId: item.storeId,
          storeName: item.storeName,
          storeCode: item.storeCode,
        });
        return newVerifyRowConcatList;
      });
      const newData = newVerifyRowConcatList.concat(verifyVisibleDiffList);
      dispatch({
        type: 'supplyRelation/addDepotAll',
        payload: {
          supplyId: supplierFindAdd.supplyId,
          supplyCode: supplierFindAdd.supplyCode,
          supplyName: supplierFindAdd.supplyName,
          priority: 'A',
          detailList: newData
        },
      });
    },
    onVerifyCancel() {
      dispatch({
        type: 'supplyRelation/querySuccess',
        payload: {
          verifyVisible: false,
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
    },
    okHideModalAdd() {
      // console.warn("storeRowConcatList",storeRowConcatList,"goodsRowConcatList",goodsRowConcatList);
      if (!supplierFindAdd.supplyId) {
        message.error('供应商不能为空!');
      } else if (goodsRowConcatList.length === 0) {
        message.error('物资数量不能为空!');
      } else if (storeRowConcatList.length === 0) {
        message.error('机构数量不能为空!');
      } else {
        const detailList = [];
        goodsRowConcatList.map( item => {
          storeRowConcatList.map( data => {
            detailList.push({
              goodsId: item.id,
              goodsCode: item.goodsCode,
              goodsName: item.goodsName,
              storeId: data.id,
              storeName: data.name,
              storeCode: data.code,
            });
          });
        });
        // 校验是否符合规范
        dispatch({
          type: 'supplyRelation/verifySupplyGoods',
          payload: {
            supplyId: supplierFindAdd.supplyId,
            supplyCode: supplierFindAdd.supplyCode,
            supplyName: supplierFindAdd.supplyName,
            priority: 'A',
            detailList,
          },
        });
        dispatch({
          type: 'supplyRelation/updateDate',
          payload: {
            verifyDetailList: detailList,
          },
        });
        // dispatch({
        //   type: 'supplyRelation/addSupplyGoods',
        //   payload: {
        //     supplyId: supplierFindAdd.supplyId,
        //     supplyCode: supplierFindAdd.supplyCode,
        //     supplyName: supplierFindAdd.supplyName,
        //     priority: 'A',
        //     detailList,
        //   },
        // });
        // dispatch({
        //   type: 'supplyRelation/querySuccess',
        //   payload: {
        //     addVisible: false,
        //   },
        // });
      }
    },
    onCancel() {
      dispatch({
        type: 'supplyRelation/querySuccess',
        payload: {
          addVisible: false,
          goodsModalList: [],
          storeRowKeysModal: [],
          goodsRowConcatList: [],
          storeRowConcatList: [],
          storeGoodsGetAll: [],
          // selectedRowKeysModal: [],
          supplierFindAdd: {
            supplyId: '',
          },
        },
      });
    },
    upadateSupplier(value) {
      // console.log("value",value);
      if (value) {
        const findData = _.find(supplierAloneList,item=> item.id === value);
        // console.log("---------findData",findData);
        dispatch({
          type: 'supplyRelation/querySuccess',
          payload: {
            supplierFindAdd: {
              supplyId: value,
              supplyCode: findData.suppCode,
              supplyName: findData.suppName,
            },
          },
        });
      } else {
        dispatch({
          type: 'supplyRelation/querySuccess',
          payload: {
            supplierFindAdd: {
              supplyId: value,
            },
          },
        });
      }
    },
    selectSupplier(value, option) {
      // console.log("2222222222222value",value,"option",option);
        // dispatch({
        //   type: 'supplyRelation/querySuccess',
        //   payload: {
        //     addVisible: false,
        //   },
        // });
    },
    onNewGoodsList(value) {
      // console.log("value",value);
      dispatch({
        type: 'supplyRelation/querySuccess',
        payload: {
          addGoodsVisible: true,
          // goodsModalList: [],
        },
      });
      dispatch({
        type: 'supplyRelation/findTreeList',
        payload: { type: 0 },
      });
      dispatch({
        type: 'supplyRelation/findScmInGoods',
        payload: {
          limit: '20',
          status: '1',
          rows: 10,
          page: 1,
        },
      });
    },
    goodsRowConcat(keys, value) {
      // console.log("-------------keys", keys, "value", value);
      const oldData = goodsRowConcatList || [];
      const newData = value;
      let allData = [];
      allData = oldData.concat(newData);
      allData = _.uniqBy(allData, 'id');
      // console.log("-------------allData", allData);
      dispatch({
        type: 'supplyRelation/querySuccess',
        payload: {
          goodsRowKeysModal: keys,
        },
      });
      dispatch({
        type: 'supplyRelation/querySuccess',
        payload: {
          goodsRowConcatList: allData,
        },
      });
    },
    removeGoodsExport(record, selected, selectedRows) {  // 删除的数据
      // console.log("11111selected----------",selected ,record.id);
      if (selected === false) { // 取消选择
        const goodsRowConcatListClone = _.cloneDeep(goodsRowConcatList);
        _.remove(goodsRowConcatListClone, (item) => {
            //  console.log("item.id",item.id);
          return item.id === record.id;
        });
        // console.warn("goodsRowConcatListClone",goodsRowConcatListClone);
        dispatch({
          type: 'supplyRelation/querySuccess',
          payload: {
            goodsRowConcatList: goodsRowConcatListClone,
          },
        });
      }
      // console.log("我是删除的-----", priorityRowList, newPriorityRowList);
    },
    goodsExportAll(selected, selectedRows, changeRows) {  // 删除的数据
      console.log("2222selected----------",selected,selectedRows,changeRows);
      dispatch({
        type: 'supplyRelation/querySuccess',
        payload: {
          goodsRowConcatList: selectedRows,
        },
      });
      // if (selected === false) { // 取消选择
      //   const goodsRowConcatListClone = _.cloneDeep(goodsRowConcatList);
      //   storeGoodsGetAll.map((item) => {
      //     _.remove(goodsRowConcatListClone, data => {
      //         // console.log("item.id",item.id);
      //       return data.id === item.id;
      //     });
      //   });
      //   // console.log("你好删除的数据",goodsRowConcatListClone);
      //   dispatch({
      //     type: 'supplyRelation/querySuccess',
      //     payload: {
      //       goodsRowConcatList: goodsRowConcatListClone,
      //     },
      //   });
      // }
      // console.log("我是删除的-----", priorityRowList, newPriorityRowList);
    },
    removeStoreExport(record, selected, selectedRows) {  // 删除的数据
      // console.log("11111selected----------",selected ,record.id);
      if (selected === false) { // 取消选择
        const storeRowConcatListClone = _.cloneDeep(storeRowConcatList);
        _.remove(storeRowConcatListClone, (item) => {
            //  console.log("item.id",item.id);
          return item.id === record.id;
        });
        // console.warn("storeRowConcatListClone",storeRowConcatListClone);
        dispatch({
          type: 'supplyRelation/querySuccess',
          payload: {
            storeRowConcatList: storeRowConcatListClone,
          },
        });
      }
      // console.log("我是删除的-----", priorityRowList, newPriorityRowList);
    },
    storeExportAll(selected, selectedRows, changeRows) {  // 删除的数据
      // console.log("2222selected----------",selected,selectedRows,changeRows);
      if (selected === false) { // 取消选择
        const storeRowConcatListClone = _.cloneDeep(storeRowConcatList);
        aclStoreListAll.map((item) => {
          _.remove(storeRowConcatListClone, data => {
              // console.log("item.id",item.id);
            return data.id === item.id;
          });
        });
        // console.log("你好删除的数据",storeRowConcatListClone);
        dispatch({
          type: 'supplyRelation/querySuccess',
          payload: {
            storeRowConcatList: storeRowConcatListClone,
          },
        });
      }
      // console.log("我是删除的-----", priorityRowList, newPriorityRowList);
    },
    storeRowConcat(keys, value) {
      // console.log("-------------keys",keys);
      let oldData = storeRowConcatList || [];
      let newData = value;
      let allData = [];
      allData = oldData.concat(newData);
      allData = _.uniqBy(allData, 'id');
      dispatch({
        type: 'supplyRelation/querySuccess',
        payload: {
          storeRowKeysModal: keys,
        },
      });
      dispatch({
        type: 'supplyRelation/querySuccess',
        payload: {
          storeRowConcatList: allData,
        },
      });
    },
  };
  const setSupplyAddGoods = { // 根据类别查找物资弹窗
    menuData,
    visible: addGoodsVisible,
    scmInGoodsList: goodsAloneList,
    dataTree: findTreeList,
    goodsModalList,
    paginationGoods,
    storeGoodsGetAll,
    modalSelectValue,
    selectedRowKeys: selectedRowKeysModal,
    onModalSearch(value) {
      if (cateId) {
        dispatch({
          type: 'supplyRelation/findScmInGoods',
          payload: {
            cateId,
            limit: '20',
            status: '1',
            rows: 10,
            page: 1,
            queryString: value,
          },
        });
      } else {
        dispatch({
          type: 'supplyRelation/findScmInGoods',
          payload: {
            limit: '20',
            status: '1',
            rows: 10,
            page: 1,
            queryString: value,
          },
        });
      }
    },
    onModalChange(value) {
      dispatch({
        type: 'supplyRelation/querySuccess',
        payload: {
          modalSelectValue: value.target.value,
        },
      });
    },
    onCancel() {
      dispatch({
        type: 'supplyRelation/querySuccess',
        payload: {
          goodsModalList: storeGoodsGetAll,
          addGoodsVisible: false,
        },
      });
      dispatch({
        type: 'supplyRelation/querySuccess',
        payload: {
          selectedRowKeysModal: [],
          goodsRowKeysModal: [],
          cateId: '',
          modalSelectValue: '',
        },
      });
    },
    goodsAddModalExport(keys, value) {
      const oldData = goodsModalList || [];
      const newData = value;
      let allData = [];
      allData = oldData.concat(newData);
      allData = _.uniqBy(allData, 'id');
      dispatch({
        type: 'supplyRelation/querySuccess',
        payload: {
          selectedRowKeysModal: keys,
          // goodsRowKeysModal: keys,
        },
      });
      dispatch({
        type: 'supplyRelation/querySuccess',
        payload: {
          goodsModalList: allData,
          paginationGoodsModal: {
            showSizeChanger: true,
            showQuickJumper: true,
            total: goodsModalList.length,
            current: 1,
            showTotal: total => `共 ${total} 条`,
            size: 'default',
          },
        },
      });
    },
    removeGoodsModalExport(record, selected, selectedRows) {  // 删除的数据
      // console.log("11111selected----------",selected ,record.id);
      if (selected === false) { // 取消选择
        const goodsRowConcatListClone = _.cloneDeep(goodsModalList);
        _.remove(goodsRowConcatListClone, (item) => {
            //  console.log("item.id",item.id);
          return item.id === record.id;
        });
        // console.warn("goodsRowConcatListClone",goodsRowConcatListClone);
        dispatch({
          type: 'supplyRelation/querySuccess',
          payload: {
            goodsModalList: goodsRowConcatListClone,
          },
        });
      }
      // console.log("我是删除的-----", priorityRowList, newPriorityRowList);
    },
    goodsModalExportAll(selected, selectedRows, changeRows) {  // 删除的数据
      // console.log("2222selected----------",selected,selectedRows,changeRows);
      if (selected === false) { // 取消选择
        const goodsRowConcatListClone = _.cloneDeep(goodsModalList);
        goodsAloneList.map((item) => {
          _.remove(goodsRowConcatListClone, data => {
              // console.log("item.id",item.id);
            return data.id === item.id;
          });
        });
        // console.log("你好删除的数据",goodsRowConcatListClone);
        dispatch({
          type: 'supplyRelation/querySuccess',
          payload: {
            goodsModalList: goodsRowConcatListClone,
          },
        });
      }
      // console.log("我是删除的-----", priorityRowList, newPriorityRowList);
    },
    onPageChange(page) {
      if (cateId) {
        dispatch({
          type: 'supplyRelation/findScmInGoods',
          payload: {
            page: page.current,
            rows: page.pageSize,
            limit: '20',
            status: '1',
            cateId,
            queryString: modalSelectValue,
          },
        });
      } else {
        dispatch({
          type: 'supplyRelation/findScmInGoods',
          payload: {
            page: page.current,
            rows: page.pageSize,
            limit: '20',
            status: '1',
            queryString: modalSelectValue,
          },
        });
      }
    },
    onSelectMenu(selectedKeys) {
      dispatch({
        type: 'supplyRelation/findScmInGoods',
        payload: {
          cateId: selectedKeys[0],
          queryString: modalSelectValue,
          limit: '20',
          status: '1',
          rows: 10,
          page: 1,
        },
      });
      dispatch({
        type: 'supplyRelation/querySuccess',
        payload: {
          cateId: selectedKeys[0],
        },
      });
    },
    okHideModal() {
      dispatch({
        type: 'supplyRelation/querySuccess',
        payload: {
          storeGoodsGetAll: _.cloneDeep(goodsModalList),
          goodsRowConcatList: _.cloneDeep(goodsModalList),
          addGoodsVisible: false,
          selectedRowKeysModal: [],
          goodsRowKeysModal: [],
          cateId: '',
          modalSelectValue: '',
        },
      });
      dispatch({
        type: 'supplyRelation/goodsModalListAll',
        payload: {},
      });
    },
  };
  const setSupplyExplore = { // 首页设置优先级弹窗
    menuData,
    exportVisible,
    supplierPriorityList,
    storeId,
    loading,
    paginationBySupplier,
    findGoodsBySupplierList,
    selectSupplyDefault,
    fetchingSupplier,
    supplierId,
    selectedPriorityRowKeys,
    paginationSupplyStore,
    selectedSupplierRowKeys,
    storeList: depotList,
    supplyId: supplyGoodsPrioritySave.supplyId,
    setPriority,
    priorityRowList,
    priorityRowListNewData,
    changeShop(value) {
      // console.log("我是changeShop值",value);
      dispatch({
        type: 'supplyRelation/querySuccess',
        payload: {
          supplierId: value,
          selectedSupplierRowKeys: [],
        },
      });
    },
    fetchShop(value) {
      // console.log("我是fetchShop值",value);
      dispatch({
        type: 'supplyRelation/querySuccess',
        payload: {
          supplierList: [],
          fetching: true,
        },
      });
      dispatch({
        type: 'supplyRelation/querySupplier',
        payload: {
          status: 1,
          rows: '1000',
          queryString: value,
        },
      });
    },
    onSearch(value) {
      // console.log("我是onSearch值",value);
      dispatch({
        type: 'supplyRelation/queryGoosUpdate',
        payload: {
          status: 1,
          rows: '1000',
          queryString: value,
        },
      });
    },
    okTenantPriority() { // 确定物资
      // let priorityRowList=[] supplyGoodsPrioritySave;
      // console.log("我是ok--------------priorityRowListNewData", priorityRowListNewData);

      const oldData = priorityRowList || [];
      const newData = priorityRowListNewData;
      let allData = [];
      allData = oldData.concat(newData);
      allData = _.uniqBy(allData, 'id');
      // console.log("-------------------allData", allData);
      if (!storeId) {
        message.error('请选择机构');
      } else if (!supplyGoodsPrioritySave.supplyId) {
        message.error('请选择供应商！');
      } else if (allData.length === 0) {
        message.error('请选择物资！');
      } else {
        const scmSupplyGoodsPriorities = [];
        allData.map((item) => {
          scmSupplyGoodsPriorities.push({
            supplyId: supplyGoodsPrioritySave.supplyId,
            supplyCode: supplyGoodsPrioritySave.supplyCode,
            supplyName: supplyGoodsPrioritySave.supplyName,
            priority: item.priority,
            goodsId: item.id,
            goodsName: item.goodsName,
            goodsCode: item.goodsCode,
          });
        });
        dispatch({
          type: 'supplyRelation/addSupplyPriority',
          payload: {
            id: '',
            storeId: tenantPriorityList.storeId,
            storeName: tenantPriorityList.storeName,
            storeCode: tenantPriorityList.storeCode,
            scmSupplyGoodsPriorities,
          },
        });
        dispatch({
          type: 'supplyRelation/querySuccess',
          payload: {
            exportVisible: false,
            priorityRowList: allData,
            priorityRowListNewData: allData,
          },
        });
      }
    },
    onCancel() {
      dispatch({
        type: 'supplyRelation/querySuccess',
        payload: {
          exportVisible: false,
          supplierPriorityList: [],
          selectedSupplierRowKeys: [],
          findGoodsBySupplierList: [],
          priorityRowList: [],
          priorityRowListNewData: [],
          storeId: '',
          supplyGoodsPrioritySave: {
            supplyId: '',
          }
        },
      });
    },
    onPageChange(page) {
      dispatch({
        type: 'supplyRelation/queryGoosUpdate',
        payload: {
          status: 1,
          page: page.current,
          rows: page.pageSize,
          storeId,
        },
      });
    },
    changeStore(value) {
      if (value) {
        const newChangeStore = _.find(depotList, item => item.id === value);
        // console.log("tenantPriorityListvalue",value);
        dispatch({
          type: 'supplyRelation/querySuccess',
          payload: {
            tenantPriorityList: {
              storeId: value,
              storeName: newChangeStore.name,
              storeCode: newChangeStore.code,
            },
          },
        });
        dispatch({
          type: 'supplyRelation/querySuccess',
          payload: {
            supplierPriorityList: [],
            findGoodsBySupplierList: [],
          },
        });
        dispatch({
          type: 'supplyRelation/queryGoosUpdate',
          payload: {
            storeId: value,
            status: 1,
            rows: '10',
          },
        });
      }
      dispatch({
        type: 'supplyRelation/querySuccess',
        payload: {
          storeId: value,
        },
      });
    },
    supplyModalRowChange(keys, value) {
      dispatch({
        type: 'supplyRelation/querySuccess',
        payload: {
          findGoodsBySupplierList: [],
          selectedPriorityRowKeys: [],
          selectedSupplierRowKeys: keys,
        },
      });
      dispatch({
        type: 'supplyRelation/querySuccess',
        payload: {
          supplyGoodsPrioritySave: {
            supplyId: value[0].id,
            supplyCode: value[0].suppCode,
            supplyName: value[0].suppName,
          },
        },
      });
      dispatch({
        type: 'supplyRelation/findGoodsBySupplier',
        payload: {
          storeId,
          supplyId: value[0].id,
          rows: 10,
          page: 1,
          delete: 1,
        },
      });
    },
    onPageBySupplierChange(page) { // 根据供应商查询物资分页查询

      // let newFilters = '';
      // console.log("filters", filters);
      // Object.keys(filters).length !== 0 && filters.priority.length === 1 ? (newFilters=filters.priority[0]) : newFilters;
      // console.log("--------------priorityRowListNewData", priorityRowListNewData);
      const oldData = priorityRowList || [];
      const newData = priorityRowListNewData;
      let allData = [];
      allData = oldData.concat(newData);
      allData = _.uniqBy(allData, 'id');
      // console.log(`-------------------allData${allData}`);
      dispatch({
        type: 'supplyRelation/querySuccess',
        payload: {
          priorityRowList: allData,
          // priorityRowListNewData: allData,
        },
      });
      dispatch({
        type: 'supplyRelation/findGoodsBySupplier',
        payload: {
          supplyId: supplyGoodsPrioritySave.supplyId,
          storeId,
          page: page.current,
          rows: page.pageSize,
          delete: 1,
        },
      });
    },
    goodsPriorityExport(keys, value) {  // 勾选的数据
      //  console.log("我是勾选的value",value);
      dispatch({
        type: 'supplyRelation/querySuccess',
        payload: {
          selectedPriorityRowKeys: keys,
          priorityRowListNewData: value,
        },
      });
      // dispatch({
      //   type: 'supplyRelation/querySuccess',
      //   payload: {
      //
      //
      //   },
      // });
    },
    removePriorityExport(record, selected, selectedRows) {  // 删除的数据

      // console.log("selected----------",selected);

      if (selected == false) { // 取消选择
        const priorityRowListNewDataClone = _.cloneDeep(priorityRowListNewData);
        const priorityRowListClone = _.cloneDeep(priorityRowList);
          //  console.log("record.id",record.id);
             _.remove(priorityRowListNewDataClone, item => {
            //  console.log("item.id",item.id);

             return item.id == record.id;
           });
           _.remove(priorityRowListClone, item => {
            //  console.log("item.id",item.id);

             return item.id==record.id;
           });
           dispatch({
             type: 'supplyRelation/querySuccess',
             payload: {
               priorityRowList: priorityRowListClone,
               priorityRowListNewData: priorityRowListNewDataClone,
             },
           });
      }
      // console.log("我是删除的-----", priorityRowList, newPriorityRowList);

    },
    goodsPriorityExportAll(selected, selectedRows, changeRows) {  // 删除的数据

      // console.log("selected----------",selected);

      if (selected == false) { // 取消选择
        let priorityRowListClone = _.cloneDeep(priorityRowList);
        findGoodsBySupplierList.map(item =>{
          _.remove(priorityRowListClone, data => {
              // console.log("item.id",item.id);
            return data.id === item.id;
          });
        });
        // console.log("你好删除的数据",priorityRowListClone);
        dispatch({
          type: 'supplyRelation/querySuccess',
          payload: {
            priorityRowList: priorityRowListClone,
            priorityRowListNewData: [],
          },
        });
      }
      // console.log("我是删除的-----", priorityRowList, newPriorityRowList);

    },
    onPriorityAChange(value) {  // 设置一键AB
      // console.log("--------------priorityRowListNewData", priorityRowListNewData);
      // console.log("--------------priorityRowList", priorityRowList);
      // const oldData = priorityRowList || [];
      // const newData = priorityRowListNewData;
      // const oldData = priorityRowList || [];
      // const newData = priorityRowListNewData;
      const oldData = priorityRowList || [];
      const newData = priorityRowListNewData;
      let allData = [];
      allData = oldData.concat(newData);
      allData = _.uniqBy(allData, 'id');
      if (allData.length === 0) {
        message.info('您勾选的物资为空，不能一键修改');
      } else {
          // console.log("您勾选的物资", allData, "111111findGoodsBySupplierList",findGoodsBySupplierList);
        allData.map(item => {
          item.priority = value;
          _.find(findGoodsBySupplierList, function(data){ data.id === item.id ? data.priority = value : data.priority });
        });
          console.log("222222findGoodsBySupplierList",findGoodsBySupplierList,"priorityRowList",allData);
        dispatch({
          type: 'supplyRelation/querySuccess',
          payload: {
            findGoodsBySupplierList,
            priorityRowList: allData,
          },
        });
      }
    },
    selectSupplyChange(value, selectId) {
      let newValue = '';
      value ? (newValue = 'A') : (newValue = 'B');
      _.find(findGoodsBySupplierList, function(item){ item.id === selectId ? item.priority = newValue : item.priority})
      _.find(priorityRowList, function(item) {item.id === selectId ? (item.priority = newValue) : item.priority})
      _.find(priorityRowListNewData, function(item) {item.id === selectId ? (item.priority = newValue) : item.priority})
      dispatch({
        type: 'supplyRelation/querySuccess',
        payload: {
          findGoodsBySupplierList,
          priorityRowList,
          priorityRowListNewData,
        },
      });
    },
  };
  return (
    <div className="routes">
      <SupplySearch {...setSupplySearch} />
      <SupplyList {...setListState} />
      <SupplyModalAdd {...setSupplyAdd} />
      <SupplyModalExplore {...setSupplyExplore} />
      <SupplyAddGoodsModal {...setSupplyAddGoods} />
    </div>
  );
};
SupplyRelation.propTypes = {
  list: PropTypes.object,
};
const mapStateToProps = (supplyData) => {
  return { supplyData }
};
export default connect(mapStateToProps)(SupplyRelation);
