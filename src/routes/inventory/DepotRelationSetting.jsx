import React, { PropTypes } from 'react';
import { connect } from 'dva';
import { message } from 'antd';
import _ from 'lodash';
import SupplyList from '../../components/Inventory/DepotRelationSetting/list';
import SupplySearch from '../../components/Inventory/DepotRelationSetting/search';
import SupplyModalAdd from '../../components/Inventory/DepotRelationSetting/modalAdd';
import SupplyAddGoodsModal from '../../components/Inventory/DepotRelationSetting/modal';

const DepotRelationSetting = ({ depotRelationSettingData, dispatch }) => {
  const {
  loading,
  dataList,
  storeList,
  addVisible,
  goodsList,
  supplierList,
  fetching,
  fetchingGoods,
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
  scmInStoreList,
  storeRowConcatList,
  storeRowKeysModal,
  supplierFindAdd,
  valueGoods,
  fetchingStores,
  storeIdList,
  modalSelectValue,
  goodsListValue,
  depotIdListValue,
  storeIdListValue,
  storeGoodsGetAll,
  orgInfoIdList,
  orgInfoId,
  depotRowConcatList,
  orgInfoName,
  verifyVisible,
  verifyModalList,
  paginationVerify,
  verifyVisibleDiffList,
  verifyRowConcatList,
  } = depotRelationSettingData.depotRelationSetting;

  const setSupplySearch = { // 首页请求搜索功能
    orgInfoIdList,
    storeIdList,
    goodsList,
    supplierList,
    valueGoods,
    fetching,
    fetchingGoods,
    fetchingStores,
    depotRowConcatList,
    orgInfoId,
    key: orgInfoId,
    onDelete() { // 批量删除
      const delIdsList = [];
      if (depotRowConcatList.length > 0) {
        depotRowConcatList.map((item) => {
          delIdsList.push(item.id);
          return delIdsList;
        });
        dispatch({
          type: 'depotRelationSetting/delSupplyGoods',
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
    changeOrgInfoId(value) {
      const findData = _.find(orgInfoIdList, item => item.id === value);
      dispatch({
        type: 'depotRelationSetting/updateDate',
        payload: {
          orgInfoId: value,
          orgInfoName: findData.name || '',
          depotIdList: [],
          storeIdList: [],
          goodIdList: [],
          dataList: [],
          valueGoods: [],
          valueStores: [],
          valueShop: [],
        },
      });
      dispatch({
        type: 'depotRelationSetting/query',
        payload: { orgInfoId: value, page: 1, rows: 10 },
      });
      dispatch({ // 获取仓库
        type: 'depotRelationSetting/querySupplier',
        payload: {
          storeId: value,
        },
      });
      // 获取门店
      dispatch({
        type: 'depotRelationSetting/queryDepot',
        payload: { distribId: value, orgType: 1, rows: 10 },
      });
    },
    onAdd() {
      dispatch({
        type: 'depotRelationSetting/querySuccess',
        payload: {
          addVisible: true,
        },
      });
      dispatch({
        type: 'depotRelationSetting/findAclStoreForPage',
        payload: {
          distribId: orgInfoId,
          orgType: 1,
          rows: 10,
          page: 1,
        },
      });
    },
    setPriority() {
      dispatch({
        type: 'depotRelationSetting/querySuccess',
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
        type: 'depotRelationSetting/querySuccess',
        payload: {
          valueShop: newValueShop,
        },
      });
    },
    fetchShop(value) { // 供应商名称搜索
      dispatch({
        type: 'depotRelationSetting/updateDate',
        payload: {
          fetching: true,
        },
      });
      dispatch({
        type: 'depotRelationSetting/querySupplier',
        payload: {
          status: 1,
          storeId: orgInfoId,
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
        type: 'depotRelationSetting/querySuccess',
        payload: {
          valueGoods: newValueGoods,
        },
      });
    },
    fetchGoods(value) { // 物资名称搜索
      // console.log("改变物资value",value);
      dispatch({
        type: 'depotRelationSetting/updateDate',
        payload: {
          fetchingGoods: true,
        },
      });
      dispatch({
        type: 'depotRelationSetting/findScmShowGoods',
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
        type: 'depotRelationSetting/querySuccess',
        payload: {
          valueStores: newValueStores,
        },
      });
    },
    fetchStores(value) { // 门店名称搜索
      // console.log("改变门店value",value);
      dispatch({
        type: 'depotRelationSetting/updateDate',
        payload: {
          fetchingStores: true,
        },
      });
      dispatch({
        type: 'depotRelationSetting/newQueryDepot',
        payload: {
          rows: 10,
          distribId: orgInfoId,
          orgType: 1,
          queryString: value,
        },
      });

    },
    onSearch(value) { // 全部搜索
      // console.log("我是搜索value",value,);
      dispatch({
        type: 'depotRelationSetting/query',
        payload: {
          page: 1,
          rows: 10,
          orgInfoId,
          goodIdList: value.goodIdList,
          depotIdList: value.depotIdList,
          storeIdList: value.storeIdList,
        },
      });
      dispatch({
        type: 'depotRelationSetting/updateDate',
        payload: {
          goodsListValue: value.goodIdList,
          depotIdListValue: value.depotIdList,
          storeIdListValue: value.storeIdList,
        },
      });
    },
  };
  const setListState = {  // 首页请求列表功能
    dataList,
    paginationSupply,
    loading,
    orgInfoId,
    depotRowConcatList,
    // depotRowKeysModal,
    depotRowConcat(keys, value) {
      const oldData = depotRowConcatList || [];
      const newData = value;
      let allData = [];
      allData = oldData.concat(newData);
      allData = _.uniqBy(allData, 'id');
      dispatch({
        type: 'depotRelationSetting/querySuccess',
        payload: {
          selectedRowKeysModal: keys,
          // goodsRowKeysModal: keys,
        },
      });
      dispatch({
        type: 'depotRelationSetting/querySuccess',
        payload: {
          depotRowConcatList: allData,
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
    removeDepotExport(record, selected, selectedRows) {  // 删除的数据
      // console.log("11111selected----------",selected ,record.id);
      if (selected === false) { // 取消选择
        const depotRowConcatListClone = _.cloneDeep(depotRowConcatList);
        _.remove(depotRowConcatListClone, (item) => {
            //  console.log("item.id",item.id);
          return item.id === record.id;
        });
        // console.warn("goodsRowConcatListClone",goodsRowConcatListClone);
        dispatch({
          type: 'depotRelationSetting/querySuccess',
          payload: {
            depotRowConcatList: depotRowConcatListClone,
          },
        });
      }
      // console.log("我是删除的-----", priorityRowList, newPriorityRowList);
    },
    depotExportAll(selected, selectedRows, changeRows) {  // 删除的数据
      // console.log("2222selected----------",selected,selectedRows,changeRows);
      if (selected === false) { // 取消选择
        const depotRowConcatListClone = _.cloneDeep(depotRowConcatList);
        dataList.map((item) => {
          _.remove(depotRowConcatListClone, data => {
              // console.log("item.id",item.id);
            return data.id === item.id;
          });
        });
        // console.log("你好删除的数据",goodsRowConcatListClone);
        dispatch({
          type: 'depotRelationSetting/querySuccess',
          payload: {
            depotRowConcatList: depotRowConcatListClone,
          },
        });
      }
      // console.log("我是删除的-----", priorityRowList, newPriorityRowList);
    },
    onPageChange(page, filters, sorter) {
      // const oldData = depotOldRowListAll || [];
      // const newData = depotRowConcatList;
      // let allData = [];
      // allData = oldData.concat(newData);
      // allData = _.uniqBy(allData, 'id');
      // // console.log(`-------------------allData${allData}`);
      // dispatch({
      //   type: 'depotRelationSetting/querySuccess',
      //   payload: {
      //     depotOldRowListAll: allData,
      //     // priorityRowListNewData: allData,
      //   },
      // });
      let createTimeOrder = '', orgInfoOrder = '', goodCatOrder = '';
      // console.log("sorter",sorter);
      if (Object.keys(sorter).length !== 0) {
        switch (sorter.field) {
          case 'orgInfoName':
            sorter.order === 'ascend' ? orgInfoOrder = 'asc' : orgInfoOrder = 'desc';
            break;
          case 'cateName':
            sorter.order === 'ascend' ? goodCatOrder = 'asc' : goodCatOrder = 'desc';
            break;
          case 'createTime':
            sorter.order === 'ascend' ? createTimeOrder = 'asc' : createTimeOrder = 'desc';
            break;
          default:
        }
      }
      // Object.keys(filters).length !== 0 && filters.priority.length === 1 ? (newFilters = filters.priority[0]) : newFilters;
      dispatch({
        type: 'depotRelationSetting/query',
        payload: {
          orgInfoId,
          goodIdList: goodsListValue,
          depotIdList: depotIdListValue,
          storeIdList: storeIdListValue,
          page: page.current,
          rows: page.pageSize,
          createTimeOrder,
          orgInfoOrder,
          goodCatOrder,
        },
      });
    },
    onPageSizeChange(current, pageSize) {
      dispatch({
        type: 'depotRelationSetting/query',
        payload: {
          orgInfoId,
          goodIdList: goodsListValue,
          depotIdList: depotIdListValue,
          storeIdList: storeIdListValue,
          page: 1,
          rows: pageSize,
        },
      });
    },
    onDeleteItem(id) {
      // console.log("id",id);
      dispatch({
        type: 'depotRelationSetting/delSupplyGoods',
        payload: {
          delIds: [id],
          type: 'one'
        },
      });
    },
  };
  const setSupplyAdd = {  // 新增供货关系弹窗
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
    orgInfoName,
    orgInfoIdList,
    verifyVisible,
    verifyModalList,
    paginationVerify,
    verifyRowConcatList,
    loading,
    depotId: supplierFindAdd.depotId,
    depotName: supplierFindAdd.depotName,
    okHideModalAdd() {
      // console.warn("storeRowConcatList",storeRowConcatList,"goodsRowConcatList",goodsRowConcatList);
      if (!supplierFindAdd.depotId) {
        message.error('仓库不能为空!');
      } else if (goodsRowConcatList.length === 0) {
        message.error('物品数量不能为空!');
      } else if (storeRowConcatList.length === 0) {
        message.error('机构数量不能为空!');
      } else {
        const detailList = [];
        goodsRowConcatList.map( item => {
          storeRowConcatList.map( data => {
            detailList.push({
              goodsId: item.id,
              orgInfoId,
              depotId: supplierFindAdd.depotId,
              storeId: data.id,
            });
          });
        });
        // 校验是否符合规范
        dispatch({
          type: 'depotRelationSetting/verifySupplyGoods',
          payload: {
            scmGoodDirectionVos: detailList
          },
        });
        dispatch({
          type: 'depotRelationSetting/updateDate',
          payload: {
            verifyDetailList: detailList,
          },
        });
        // dispatch({
        //   type: 'depotRelationSetting/addSupplyGoods',
        //   payload: {
        //     depotId: supplierFindAdd.depotId,
        //     supplyCode: supplierFindAdd.supplyCode,
        //     supplyName: supplierFindAdd.supplyName,
        //     // priority: 'A',
        //     goodDirectionVos: detailList,
        //   },
        // });
        // dispatch({
        //   type: 'depotRelationSetting/querySuccess',
        //   payload: {
        //     addVisible: false,
        //   },
        // });
      }
    },
    onVerifyPageChange(page) {
      dispatch({
        type: 'depotRelationSetting/querySuccess',
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
      //   type: 'depotRelationSetting/querySuccess',
      //   payload: {
      //     verifyRowKeysModal: keys,
      //   },
      // });
      dispatch({
        type: 'depotRelationSetting/querySuccess',
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
          type: 'depotRelationSetting/querySuccess',
          payload: {
            verifyRowConcatList: verifyRowConcatListClone,
          },
        });
      }
      // console.log("我是删除的-----", priorityRowList, newPriorityRowList);
    },
    verifyExportAll(selected, selectedRows, changeRows) {  // 删除的数据
      // dispatch({
      //   type: 'depotRelationSetting/querySuccess',
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
          type: 'depotRelationSetting/querySuccess',
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
          goodsId: item.goodsId,
          orgInfoId,
          goodDirection: item.goodDirection,
          depotId: supplierFindAdd.depotId,
          storeId: item.storeId,
        });
        return newVerifyRowConcatList;
      });
      const newData = newVerifyRowConcatList.concat(verifyVisibleDiffList);
      dispatch({
        type: 'depotRelationSetting/addDepotAll',
        payload: {
          scmGoodDirectionVos: newData
        },
      });
    },
    onVerifyCancel() {
      dispatch({
        type: 'depotRelationSetting/querySuccess',
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
    onCancel() {
      dispatch({
        type: 'depotRelationSetting/querySuccess',
        payload: {
          addVisible: false,
          goodsModalList: [],
          storeRowKeysModal: [],
          goodsRowConcatList: [],
          storeRowConcatList: [],
          storeGoodsGetAll: [],
          // selectedRowKeysModal: [],
          supplierFindAdd: {
            depotId: '',
          },
        },
      });
    },
    upadateSupplier(value) {
      // console.log("value",value);
      if (value) {
        const findData = _.find(supplierAloneList, item=> item.id === value);
        // console.log("---------findData",findData);
        dispatch({
          type: 'depotRelationSetting/querySuccess',
          payload: {
            supplierFindAdd: {
              depotId: value,
              depotName: findData.depotName,
            },
          },
        });
      } else {
        dispatch({
          type: 'depotRelationSetting/querySuccess',
          payload: {
            supplierFindAdd: {
              depotId: value,
            },
          },
        });
      }
    },
    selectSupplier(value, option) {
      // console.log("2222222222222value",value,"option",option);
        // dispatch({
        //   type: 'depotRelationSetting/querySuccess',
        //   payload: {
        //     addVisible: false,
        //   },
        // });
    },
    onNewGoodsList(value) {
      // console.log("value",value);
      dispatch({
        type: 'depotRelationSetting/querySuccess',
        payload: {
          addGoodsVisible: true,
          // goodsModalList: [],
        },
      });
      dispatch({
        type: 'depotRelationSetting/findScmInGoods',
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
        type: 'depotRelationSetting/querySuccess',
        payload: {
          goodsRowKeysModal: keys,
        },
      });
      dispatch({
        type: 'depotRelationSetting/querySuccess',
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
          type: 'depotRelationSetting/querySuccess',
          payload: {
            goodsRowConcatList: goodsRowConcatListClone,
          },
        });
      }
      // console.log("我是删除的-----", priorityRowList, newPriorityRowList);
    },
    goodsExportAll(selected, selectedRows, changeRows) {  // 删除的数据
      // console.log("2222selected----------",selected,selectedRows,changeRows);
      dispatch({
        type: 'depotRelationSetting/querySuccess',
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
      //     type: 'depotRelationSetting/querySuccess',
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
          type: 'depotRelationSetting/querySuccess',
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
          type: 'depotRelationSetting/querySuccess',
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
        type: 'depotRelationSetting/querySuccess',
        payload: {
          storeRowKeysModal: keys,
        },
      });
      dispatch({
        type: 'depotRelationSetting/querySuccess',
        payload: {
          storeRowConcatList: allData,
        },
      });
    },
  };
  const setSupplyAddGoods = { // 根据类别查找物资弹窗
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
          type: 'depotRelationSetting/findScmInGoods',
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
          type: 'depotRelationSetting/findScmInGoods',
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
      // console.log("target.value", value.target.value);
      dispatch({
        type: 'depotRelationSetting/querySuccess',
        payload: {
          modalSelectValue: value.target.value,
        },
      });
    },
    onCancel() {
      dispatch({
        type: 'depotRelationSetting/querySuccess',
        payload: {
          goodsModalList: storeGoodsGetAll,
          addGoodsVisible: false,
        },
      });
      dispatch({
        type: 'depotRelationSetting/querySuccess',
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
        type: 'depotRelationSetting/querySuccess',
        payload: {
          selectedRowKeysModal: keys,
          // goodsRowKeysModal: keys,
        },
      });
      dispatch({
        type: 'depotRelationSetting/querySuccess',
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
          type: 'depotRelationSetting/querySuccess',
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
          type: 'depotRelationSetting/querySuccess',
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
          type: 'depotRelationSetting/findScmInGoods',
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
          type: 'depotRelationSetting/findScmInGoods',
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
        type: 'depotRelationSetting/findScmInGoods',
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
        type: 'depotRelationSetting/querySuccess',
        payload: {
          cateId: selectedKeys[0],
        },
      });
    },
    okHideModal() {
      dispatch({
        type: 'depotRelationSetting/querySuccess',
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
        type: 'depotRelationSetting/goodsModalListAll',
        payload: {},
      });
    },
  };
  return (
    <div className="routes">
      <SupplySearch {...setSupplySearch} />
      <SupplyList {...setListState} />
      <SupplyModalAdd {...setSupplyAdd} />
      <SupplyAddGoodsModal {...setSupplyAddGoods} />
    </div>
  );
};
DepotRelationSetting.propTypes = {
  list: PropTypes.object,
};
const mapStateToProps = (depotRelationSettingData) => {
  return { depotRelationSettingData }
};
export default connect(mapStateToProps)(DepotRelationSetting);
